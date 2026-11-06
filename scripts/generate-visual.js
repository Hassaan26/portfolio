import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';
import { BRAND, PILLAR_PATTERN, PROFILE, THEMES } from './experience-profile.js';
import { formatPost } from './format-post.js';
import { findBannedPhrases, pickVariety, styleBrief } from './post-styles.js';
import { LAYOUTS, NODE_KINDS, SEGMENT_KINDS, renderPng } from './visual-template.js';

const VISUALS_PATH = path.resolve('src/data/visuals.json');
const IMAGES_DIR = path.resolve('public/visuals');
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const DRY_RUN = process.env.DRY_RUN === 'true';
const MAX_POST_CHARS = 900;

// 1) The pillar comes from PILLAR_PATTERN, cycling by how many visuals exist (2 architecture : 1 experience).
// 2) Within the pillar, pick a theme never used, else the one used longest ago; ties keep THEMES order.
// `override` comes from the workflow input THEME (e.g. "messaging"); blank means rotate.
export function pickTheme(visuals, override = process.env.THEME?.trim()) {
  if (override) {
    const theme = THEMES.find(t => t.id === override);
    if (!theme) throw new Error(`Unknown THEME "${override}". Valid: ${THEMES.map(t => t.id).join(', ')}`);
    return theme;
  }
  const pillar = PILLAR_PATTERN[visuals.length % PILLAR_PATTERN.length];
  // Themes marked rotate: false are off the main topics; they can still be picked via THEME.
  const candidates = THEMES.filter(t => t.pillar === pillar && t.rotate !== false);
  // visuals is newest-first, so the first index a theme appears at is its recency (lower = more recent)
  const lastUsed = theme => {
    const idx = visuals.findIndex(v => v.theme === theme.id);
    return idx === -1 ? Infinity : idx;
  };
  // Strict ">" keeps the earlier theme on ties (e.g. two never-used themes, both Infinity).
  return candidates.reduce((best, theme) => (lastUsed(theme) > lastUsed(best) ? theme : best));
}

function themeBrief(theme) {
  if (theme.pillar === 'experience') {
    return `This post's pillar: LESSONS FROM HIS OWN WORK
Experience area: ${theme.area}
What he actually did here: ${theme.experience}

Pick ONE concept from this area. Candidate angles (choose one, or a closely related concept he would credibly have met in this work):
${theme.angles.map(a => `- ${a}`).join('\n')}

Pillar rules:
- Write as lessons learned: practical trade-offs, pitfalls, what to check, what he would do differently.
- First person is fine for general practice ("I start by checking partition sizes"), not for invented specific events.`;
  }
  return `This post's pillar: ARCHITECTURE & SCALING DEEP-DIVE
Topic area: ${theme.area}
Focus: ${theme.focus}

Pick ONE advanced concept from this area. Candidate angles (choose one, or a closely related concept of similar depth):
${theme.angles.map(a => `- ${a}`).join('\n')}

Pillar rules:
- Write like an experienced engineer talking to a team: when to use it, when NOT to, what it costs, how to decide. A decision guide beats a definition.
- Do NOT claim he has used a technology in production unless it appears in his profile above (e.g. no "when I ran Kafka at scale" unless Kafka is listed). Explaining and advising is fine.
- You may connect the concept to his real experience only where it genuinely relates (e.g. async FastAPI services, Spark on EMR, RAG with Pinecone).`;
}

const LAYOUT_GUIDE = `Layouts:
- "comparison": 2-3 side-by-side columns contrasting approaches. Fill "columns": each with name (1-3 words), tagline (max 60 chars), points (3-4 items, max 70 chars each), analogy (a real-world analogy, max 80 chars).
- "architecture": components flowing top to bottom through 3-5 tiers. Fill "tiers": each tier has nodes (1-4 per tier; label max 20 chars, detail max 40 chars, kind one of ${NODE_KINDS.join(', ')}) and arrowLabel (max 45 chars, describes what flows from this tier to the next; empty for the last tier).
- "timeline": how work is scheduled over time (great for concurrency, async, pipelining, retries). Fill "totalUnits" (8-16) and "timelines": 2-3 groups, each with name (max 25 chars), caption (max 60 chars), and 1-3 lanes (label max 14 chars, e.g. "Thread 1" or "Core 2"). Each lane has segments with integer start/end within 0..totalUnits, a short label (max 8 chars, e.g. "Task A") and kind one of ${SEGMENT_KINDS.join(', ')} ("wait" = blocked on I/O). Segments in a lane must not overlap.
- "steps": a numbered sequence of 4-6 steps. Fill "steps": each with title (max 35 chars) and detail (max 110 chars).
- "big-idea": one big statement and a few supporting lines; the simplest layout. Fill "statement" (max 90 chars) and "lines" (2-3 items, max 80 chars each).
- "dos-donts": two plain lists. Fill "dos" and "donts" (3-4 items each, max 70 chars each).`;

const SPEC_SCHEMA = {
  type: 'object',
  properties: {
    topic: { type: 'string' },
    title: { type: 'string' },
    subtitle: { type: 'string' },
    layout: { type: 'string', enum: LAYOUTS },
    columns: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          tagline: { type: 'string' },
          points: { type: 'array', items: { type: 'string' } },
          analogy: { type: 'string' },
        },
        required: ['name', 'tagline', 'points'],
      },
    },
    tiers: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          nodes: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                label: { type: 'string' },
                detail: { type: 'string' },
                kind: { type: 'string', enum: NODE_KINDS },
              },
              required: ['label', 'kind'],
            },
          },
          arrowLabel: { type: 'string' },
        },
        required: ['nodes'],
      },
    },
    totalUnits: { type: 'integer' },
    timelines: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          caption: { type: 'string' },
          lanes: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                label: { type: 'string' },
                segments: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      start: { type: 'integer' },
                      end: { type: 'integer' },
                      label: { type: 'string' },
                      kind: { type: 'string', enum: SEGMENT_KINDS },
                    },
                    required: ['start', 'end', 'label', 'kind'],
                  },
                },
              },
              required: ['label', 'segments'],
            },
          },
        },
        required: ['name', 'caption', 'lanes'],
      },
    },
    steps: {
      type: 'array',
      items: {
        type: 'object',
        properties: { title: { type: 'string' }, detail: { type: 'string' } },
        required: ['title', 'detail'],
      },
    },
    statement: { type: 'string' },
    lines: { type: 'array', items: { type: 'string' } },
    dos: { type: 'array', items: { type: 'string' } },
    donts: { type: 'array', items: { type: 'string' } },
    takeaway: { type: 'string' },
    post: {
      type: 'object',
      properties: {
        text: { type: 'string' },
        hashtags: { type: 'array', items: { type: 'string' } },
      },
      required: ['text', 'hashtags'],
    },
  },
  required: ['topic', 'title', 'subtitle', 'layout', 'takeaway', 'post'],
};

async function callGemini(prompt, responseSchema) {
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY environment variable is not defined!');
  }

  const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';
  const maxRetries = 3;
  let delay = 2000;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': GEMINI_API_KEY },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: 'application/json', responseSchema },
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        const isTransient = [429, 500, 502, 503, 504].includes(response.status);
        if (isTransient && attempt < maxRetries) {
          console.warn(`Gemini API returned status ${response.status} (attempt ${attempt}/${maxRetries}). Retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          delay *= 2;
          continue;
        }
        throw new Error(`Gemini API error (${response.status}): ${errText}`);
      }

      const result = await response.json();
      const textResponse = result.candidates[0].content.parts[0].text;

      // Parse the JSON output from the model with raw logging on failure
      try {
        return JSON.parse(textResponse);
      } catch (parseError) {
        console.error('Failed to parse Gemini response as JSON. Raw output:');
        console.error(textResponse);
        throw parseError;
      }
    } catch (error) {
      if (attempt === maxRetries) {
        throw error;
      }
      console.warn(`Connection error on attempt ${attempt}/${maxRetries}: ${error.message}. Retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= 2;
    }
  }
}

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60);
}

// Returns a list of problems; an empty list means the spec can be rendered
function validateSpec(spec) {
  const problems = [];
  if (spec.layout === 'comparison') {
    if (!spec.columns || spec.columns.length < 2 || spec.columns.length > 3) problems.push('comparison needs 2-3 columns');
    else if (spec.columns.some(col => !col.points || col.points.length < 2)) problems.push('each column needs at least 2 points');
  }
  if (spec.layout === 'architecture') {
    if (!spec.tiers || spec.tiers.length < 2 || spec.tiers.length > 5) problems.push('architecture needs 2-5 tiers');
    else if (spec.tiers.some(tier => !tier.nodes || tier.nodes.length < 1 || tier.nodes.length > 4)) problems.push('each tier needs 1-4 nodes');
  }
  if (spec.layout === 'timeline') {
    if (!Number.isInteger(spec.totalUnits) || spec.totalUnits < 4 || spec.totalUnits > 24) problems.push('totalUnits must be 4-24');
    if (!spec.timelines || spec.timelines.length < 1 || spec.timelines.length > 3) problems.push('timeline needs 1-3 groups');
    for (const group of spec.timelines || []) {
      if (!group.lanes || group.lanes.length < 1 || group.lanes.length > 4) problems.push(`"${group.name}" needs 1-4 lanes`);
      for (const lane of group.lanes || []) {
        const sorted = [...lane.segments].sort((a, b) => a.start - b.start);
        sorted.forEach((seg, idx) => {
          if (seg.start < 0 || seg.end > spec.totalUnits || seg.end <= seg.start) problems.push(`segment "${seg.label}" in "${lane.label}" is out of range`);
          if (idx > 0 && seg.start < sorted[idx - 1].end) problems.push(`segments overlap in lane "${lane.label}"`);
        });
      }
    }
  }
  if (spec.layout === 'steps') {
    if (!spec.steps || spec.steps.length < 3 || spec.steps.length > 6) problems.push('steps needs 3-6 steps');
  }
  if (spec.layout === 'big-idea') {
    if (!spec.statement) problems.push('big-idea needs a statement');
    if (!spec.lines || spec.lines.length < 2 || spec.lines.length > 3) problems.push('big-idea needs 2-3 lines');
  }
  if (spec.layout === 'dos-donts') {
    if (!spec.dos || spec.dos.length < 3 || spec.dos.length > 4) problems.push('dos-donts needs 3-4 dos');
    if (!spec.donts || spec.donts.length < 3 || spec.donts.length > 4) problems.push('dos-donts needs 3-4 donts');
  }
  const text = spec.post.text || '';
  if (text.length < 120) problems.push('post.text is too short');
  if (text.length > MAX_POST_CHARS) problems.push(`post.text is ${text.length} chars; keep it under ${MAX_POST_CHARS}`);
  if (/#\w/.test(text)) problems.push('put hashtags only in post.hashtags, not in post.text');
  const banned = findBannedPhrases([text, spec.title, spec.subtitle, spec.takeaway].join(' '));
  if (banned.length) problems.push(`remove these phrases, they sound machine-written: ${banned.map(p => `"${p}"`).join(', ')}`);
  return problems;
}

function postBrief(variety) {
  const hashtags = variety.hashtagCount === 0
    ? 'post.hashtags: return an empty array this time.'
    : `post.hashtags: exactly ${variety.hashtagCount}, specific to the topic (e.g. #ApacheKafka, #PostgreSQL), each starting with #.`;
  return `Also write the LinkedIn post that goes with the image, as plain text in post.text.

This week's post style: ${styleBrief(variety.postStyle)}

How it should read:
- Like a senior engineer typing a quick post between meetings. Simple, direct, to the point. Short sentences, everyday words.
- Under ${MAX_POST_CHARS} characters. Shorter is better; the image carries the detail, so don't repeat it.
- The first line has to work on its own (it's all people see before "...see more"). Make it a plain, specific statement, not a teaser or a cliffhanger.
- No emoji, no arrows (→), no bold, no "Key takeaway:" labels, no em dashes. Separate paragraphs with a blank line.
- Don't open with a question unless the style asks for it. Avoid "X isn't just Y, it's Z", and don't stack three adjectives.
- Don't sound like a course or a consultant's pitch. Don't say "in this post", "here's why", "let's".
- ${variety.endWithQuestion
    ? 'End with one short, specific question to other engineers (not "Thoughts?" or "Agree?").'
    : 'Do NOT end with a question or a call to action. Just stop when the point is made.'}
- ${hashtags} Never put hashtags inside post.text.
- Follow the honesty rules.`;
}

export function buildPrompt(coveredTopics, theme, variety) {
  return `You are writing as Hassaan Riaz. Once a week he posts ONE visual explainer on LinkedIn. The goal is to build his personal brand as a software consultant: engineering leaders and CTOs who might hire him should come away thinking "this person knows how to design and scale systems".

Brand positioning: ${BRAND.positioning}

Who he is:
${PROFILE}

${themeBrief(theme)}

Topics already covered (do NOT repeat these or close variants):
${coveredTopics.length ? coveredTopics.map(t => `- ${t}`).join('\n') : '- (none yet)'}

Honesty rules (these matter more than anything else):
- Do NOT invent numbers, metrics, percentages, benchmarks, team sizes, timelines, outages, incidents, client stories or anecdotes.
- Only claim experience described in his profile. Never name clients or employers' customers, and never describe proprietary details.

Writing rules (image and post):
- Plain English, simple words. No buzzwords or filler ("game-changer", "leverage", "robust", "seamless", "delve", "crucial").
- No links in the post (they reduce reach).

Create the content for a single 1080x1350 image. Keep it simple: fewer, clearer words beat more detail.
- topic: the concept's canonical name.
- title: short, plain headline, max 45 characters. Say what it is, not a slogan.
- subtitle: one short sentence that frames the problem, max 100 characters.
- takeaway: the one thing to remember, max 110 characters, said the way you'd say it to a colleague.

${LAYOUT_GUIDE}

This week, use the "${variety.layout}" layout unless it really cannot explain this concept; then pick the closest other one.
Only fill the field(s) for the layout you choose. Be technically precise: senior engineers will read this, so no hand-waving or incorrect simplifications. Respect the character limits; text that is too long will not fit.

${postBrief(variety)}`;
}

async function generateSpec(coveredTopics, theme, variety) {
  const basePrompt = buildPrompt(coveredTopics, theme, variety);

  let feedback = '';
  for (let attempt = 1; attempt <= 3; attempt++) {
    const spec = await callGemini(basePrompt + feedback, SPEC_SCHEMA);
    const covered = coveredTopics.map(slugify);
    const problems = validateSpec(spec);
    if (covered.includes(slugify(spec.topic))) problems.push(`"${spec.topic}" was already covered; choose a different topic`);
    if (problems.length === 0) return spec;

    console.warn(`Spec attempt ${attempt} rejected: ${problems.join('; ')}`);
    feedback = `\n\nYour previous answer was rejected for these reasons, fix them:\n${problems.map(p => `- ${p}`).join('\n')}`;
  }
  throw new Error('Gemini could not produce a valid visual spec after 3 attempts.');
}

async function main() {
  try {
    let visuals = [];
    if (fs.existsSync(VISUALS_PATH)) {
      visuals = JSON.parse(fs.readFileSync(VISUALS_PATH, 'utf-8') || '[]');
    }

    const theme = pickTheme(visuals);
    const variety = pickVariety(theme.pillar, visuals[0]);
    console.log(`Pillar: ${theme.pillar} | theme: ${theme.id} (${theme.area})`);
    console.log(`Variety: ${JSON.stringify(variety)}`);
    console.log('Generating visual spec with Gemini...');
    const spec = await generateSpec(visuals.map(v => v.topic), theme, variety);
    console.log(`Topic: "${spec.topic}" (layout: ${spec.layout})`);
    console.log(JSON.stringify(spec, null, 2));

    const date = new Date().toISOString().slice(0, 10);
    const fileName = `${date}-${slugify(spec.topic)}.png`;
    fs.mkdirSync(IMAGES_DIR, { recursive: true });
    await renderPng(spec, path.join(IMAGES_DIR, fileName), {
      look: variety.look,
      chip: variety.chip === 'topic' ? spec.topic : variety.chip,
      takeawayBox: variety.takeawayBox,
    });
    console.log(`Rendered public/visuals/${fileName}`);

    const nextId = visuals.length > 0 ? Math.max(...visuals.map(v => v.id || 0)) + 1 : 1;
    const entry = {
      id: nextId,
      theme: theme.id,
      pillar: theme.pillar,
      topic: spec.topic,
      title: spec.title,
      subtitle: spec.subtitle,
      takeaway: spec.takeaway,
      image: `/visuals/${fileName}`,
      date,
      layout: spec.layout,
      look: variety.look,
      postStyle: variety.postStyle,
      post: {
        text: spec.post.text.trim(),
        hashtags: spec.post.hashtags.slice(0, variety.hashtagCount).map(tag => tag.startsWith('#') ? tag : `#${tag}`),
      },
    };

    if (DRY_RUN) {
      console.log('\n----- LinkedIn post preview -----\n');
      console.log(formatPost(entry));
      console.log('\n---------------------------------');
      console.log('Dry run: not saving to visuals.json.');
      return;
    }

    visuals.unshift(entry);
    fs.writeFileSync(VISUALS_PATH, JSON.stringify(visuals, null, 2), 'utf-8');
    console.log(`Saved visual #${nextId}: "${spec.title}"`);
  } catch (error) {
    console.error('Critical execution error:', error);
    process.exit(1);
  }
}

// Run only when executed directly (node scripts/generate-visual.js), not when imported.
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}
