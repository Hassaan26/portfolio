// Variety for the weekly LinkedIn post: each run picks a writing style, a visual look, a preferred
// layout and a few small details at random, avoiding whatever the previous post used.
// The goal is posts that read like a person wrote them, not one template on repeat.
import { LAYOUTS, LOOKS } from './visual-template.js';

// `pillars` limits a style to certain content pillars (omit = any).
export const POST_STYLES = [
  {
    id: 'quick-take',
    brief: 'A quick opinion, like a note to a peer. 3-5 short sentences, no list. Say what you think and why.',
  },
  {
    id: 'common-mistake',
    brief: 'Name one mistake teams make with this, in plain words, in the first line. Then say what to do instead in 2-4 short lines.',
  },
  {
    id: 'short-list',
    brief: 'One plain intro line, then 3 items, each on its own line starting with "- ". Stop after the list, no summary.',
  },
  {
    id: 'from-my-work',
    pillars: ['experience'],
    brief: 'Start from the work he actually did (from his profile, no invented events, numbers or clients), then what he would tell someone starting on the same thing. Conversational, 2 short paragraphs.',
  },
  {
    id: 'question-answer',
    brief: 'Open with the question a teammate would really ask (e.g. "Do we need a queue here?"). Answer it directly in the next line ("Usually not." / "It depends on one thing:"), then 2-3 short lines of why.',
  },
  {
    id: 'rule-of-thumb',
    brief: 'First line is one rule of thumb. Then a short paragraph on when the rule breaks.',
  },
];

// Chip label above the title on the image. null = no chip.
const CHIPS = [null, null, 'topic', 'Notes', 'Quick guide', 'Field notes'];

// Words and patterns that make posts read as machine-written. Checked case-insensitively.
export const BANNED_PHRASES = [
  'game-changer', 'game changer', 'delve', 'leverage', 'unlock', 'paramount', 'non-negotiable', 'crucial',
  'robust', 'seamless', 'elevate', 'navigate the', 'in today\'s', 'let\'s dive', 'let\'s talk about',
  'here\'s the thing', 'the key is', 'it\'s not just', 'not just about', 'at the end of the day',
  'tapestry', 'landscape', 'realm', 'pivotal', 'supercharge', 'ever-evolving', 'fast-paced',
  'thoughts?', 'agree?', '—',
];

export function findBannedPhrases(text) {
  const lower = text.toLowerCase();
  return BANNED_PHRASES.filter(phrase => lower.includes(phrase));
}

function pick(options, avoid, random) {
  const pool = options.filter(option => option !== avoid);
  return (pool.length ? pool : options)[Math.floor(random() * (pool.length || options.length))];
}

// `previous` is the newest entry in visuals.json (or undefined). `random` is injectable for tests.
export function pickVariety(pillar, previous, random = Math.random) {
  const styles = POST_STYLES.filter(style => !style.pillars || style.pillars.includes(pillar)).map(style => style.id);
  const chip = CHIPS[Math.floor(random() * CHIPS.length)];
  return {
    postStyle: pick(styles, previous?.postStyle, random),
    look: pick(Object.keys(LOOKS), previous?.look, random),
    layout: pick(LAYOUTS, previous?.layout, random),
    chip,
    takeawayBox: random() < 0.5,
    // Most posts end without a question; a question every time is a giveaway.
    endWithQuestion: random() < 0.3,
    hashtagCount: Math.floor(random() * 4), // 0-3
  };
}

export function styleBrief(styleId) {
  return POST_STYLES.find(style => style.id === styleId).brief;
}
