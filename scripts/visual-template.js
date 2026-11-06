// Renders a visual spec (produced by Gemini) into a 1080x1350 HTML page.
// Gemini only decides WHAT goes in the diagram; the layouts and looks below decide how it looks.

export const LAYOUTS = ['comparison', 'architecture', 'timeline', 'steps', 'big-idea', 'dos-donts'];
export const NODE_KINDS = ['client', 'service', 'database', 'cache', 'queue', 'storage', 'other'];
export const SEGMENT_KINDS = ['run', 'wait', 'idle'];

export const CANVAS_WIDTH = 1080;
export const CANVAS_HEIGHT = 1350;

// Colour schemes, picked at random per post so the feed doesn't look like one template on repeat.
export const LOOKS = {
  midnight: {
    bg: '#07080d', glow1: 'rgba(99,102,241,.28)', glow2: 'rgba(168,85,247,.22)',
    text: '#f3f4f6', soft: '#d1d5db', muted: '#9ca3af', card: 'rgba(15,17,28,.75)', line: 'rgba(255,255,255,.08)',
    head: 'Outfit', body: 'Inter', accents: ['#818cf8', '#2dd4bf', '#c084fc', '#f472b6'],
  },
  paper: {
    bg: '#f6f1e7', glow1: 'rgba(234,179,8,.10)', glow2: 'rgba(14,116,144,.08)',
    text: '#1c1917', soft: '#44403c', muted: '#78716c', card: '#fffdf8', line: 'rgba(28,25,23,.12)',
    head: 'Fraunces', body: 'Inter', accents: ['#c2410c', '#0f766e', '#4338ca', '#a21caf'],
  },
  terminal: {
    bg: '#0b0f0c', glow1: 'rgba(34,197,94,.10)', glow2: 'rgba(34,197,94,.04)',
    text: '#e7f5ea', soft: '#c3d9c8', muted: '#7f9a86', card: 'rgba(20,30,23,.85)', line: 'rgba(74,222,128,.18)',
    head: 'JetBrains Mono', body: 'JetBrains Mono', accents: ['#4ade80', '#facc15', '#38bdf8', '#fb923c'],
  },
  slate: {
    bg: '#0f172a', glow1: 'rgba(20,184,166,.18)', glow2: 'rgba(59,130,246,.14)',
    text: '#f1f5f9', soft: '#cbd5e1', muted: '#94a3b8', card: 'rgba(30,41,59,.8)', line: 'rgba(148,163,184,.18)',
    head: 'Space Grotesk', body: 'Inter', accents: ['#2dd4bf', '#60a5fa', '#fbbf24', '#f87171'],
  },
  chalk: {
    bg: '#ffffff', glow1: 'rgba(0,0,0,0)', glow2: 'rgba(0,0,0,0)',
    text: '#111827', soft: '#374151', muted: '#6b7280', card: '#f9fafb', line: '#e5e7eb',
    head: 'Space Grotesk', body: 'Inter', accents: ['#2563eb', '#16a34a', '#db2777', '#ea580c'],
  },
};

const FONTS_URL = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700' +
  '&family=Outfit:wght@600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,800' +
  '&family=JetBrains+Mono:wght@400;600;800&family=Space+Grotesk:wght@500;700&display=swap';

// Lucide-style icon paths for architecture nodes
const ICONS = {
  client: '<rect width="20" height="14" x="2" y="3" rx="2"/><path d="M8 21h8M12 17v4"/>',
  service: '<rect width="20" height="8" x="2" y="2" rx="2"/><rect width="20" height="8" x="2" y="14" rx="2"/><path d="M6 6h.01M6 18h.01"/>',
  database: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14a9 3 0 0 0 18 0V5"/><path d="M3 12a9 3 0 0 0 18 0"/>',
  cache: '<path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/>',
  queue: '<rect width="6" height="16" x="2" y="4" rx="1"/><rect width="6" height="16" x="9" y="4" rx="1"/><rect width="6" height="16" x="16" y="4" rx="1"/>',
  storage: '<path d="M21 8 12 3 3 8v8l9 5 9-5V8z"/><path d="m3 8 9 5 9-5M12 13v8"/>',
  other: '<circle cx="12" cy="12" r="9"/>',
};

function esc(text) {
  return String(text ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function icon(kind) {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ICONS[kind] || ICONS.other}</svg>`;
}

const accent = idx => `var(--a${idx % 4})`;

function renderComparison(spec) {
  const columns = spec.columns.map((col, idx) => `
    <div class="col" style="--accent:${accent(idx)}">
      <div class="col-name">${esc(col.name)}</div>
      <div class="col-tagline">${esc(col.tagline)}</div>
      <ul>${(col.points || []).map(p => `<li>${esc(p)}</li>`).join('')}</ul>
      ${col.analogy ? `<div class="analogy"><span>Think of it like</span>${esc(col.analogy)}</div>` : ''}
    </div>`).join('');
  return `<div class="comparison" style="grid-template-columns:repeat(${spec.columns.length},1fr)">${columns}</div>`;
}

function renderArchitecture(spec) {
  return `<div class="architecture">${spec.tiers.map((tier, idx) => `
    ${idx > 0 ? `<div class="arrow">${spec.tiers[idx - 1].arrowLabel ? `<span>${esc(spec.tiers[idx - 1].arrowLabel)}</span>` : ''}</div>` : ''}
    <div class="tier">${tier.nodes.map(node => `
      <div class="node kind-${esc(node.kind)}">
        <div class="node-icon">${icon(node.kind)}</div>
        <div class="node-label">${esc(node.label)}</div>
        ${node.detail ? `<div class="node-detail">${esc(node.detail)}</div>` : ''}
      </div>`).join('')}
    </div>`).join('')}
  </div>`;
}

function renderTimeline(spec) {
  const total = spec.totalUnits;
  const ticks = Array.from({ length: total + 1 }, (_, i) => `<span style="left:${(i / total) * 100}%">${i}</span>`).join('');
  const groups = spec.timelines.map((group, idx) => `
    <div class="tl-group" style="--accent:${accent(idx)}">
      <div class="tl-head"><span class="tl-name">${esc(group.name)}</span><span class="tl-caption">${esc(group.caption)}</span></div>
      ${group.lanes.map(lane => `
        <div class="lane">
          <div class="lane-label">${esc(lane.label)}</div>
          <div class="track">${lane.segments.map(seg => `
            <div class="seg seg-${esc(seg.kind)}" style="left:${(seg.start / total) * 100}%;width:${((seg.end - seg.start) / total) * 100}%">${esc(seg.label)}</div>`).join('')}
          </div>
        </div>`).join('')}
    </div>`).join('');
  return `<div class="timeline">
    ${groups}
    <div class="lane axis"><div class="lane-label">time →</div><div class="track ticks">${ticks}</div></div>
    <div class="legend"><span><i class="seg-run"></i>working</span><span><i class="seg-wait"></i>waiting on I/O</span><span><i class="seg-idle"></i>idle</span></div>
  </div>`;
}

function renderSteps(spec) {
  return `<ol class="steps">${spec.steps.map((step, idx) => `
    <li style="--accent:${accent(idx)}">
      <div class="step-num">${idx + 1}</div>
      <div><div class="step-title">${esc(step.title)}</div><div class="step-detail">${esc(step.detail)}</div></div>
    </li>`).join('')}
  </ol>`;
}

function renderBigIdea(spec) {
  return `<div class="big-idea">
    <p class="statement">${esc(spec.statement)}</p>
    <ul>${(spec.lines || []).map(line => `<li>${esc(line)}</li>`).join('')}</ul>
  </div>`;
}

function renderDosDonts(spec) {
  const list = (items, mark) => `<ul>${items.map(item => `<li><b>${mark}</b>${esc(item)}</li>`).join('')}</ul>`;
  return `<div class="dos-donts">
    <div class="dd do"><div class="dd-head">Do</div>${list(spec.dos, '✓')}</div>
    <div class="dd dont"><div class="dd-head">Don't</div>${list(spec.donts, '✕')}</div>
  </div>`;
}

const RENDERERS = {
  comparison: renderComparison,
  architecture: renderArchitecture,
  timeline: renderTimeline,
  steps: renderSteps,
  'big-idea': renderBigIdea,
  'dos-donts': renderDosDonts,
};

// options.look: a key of LOOKS. options.chip: optional small label above the title.
// options.takeawayBox: show the takeaway as a highlighted box (true) or a plain closing line (false).
export function renderHtml(spec, options = {}) {
  const look = LOOKS[options.look] || LOOKS.midnight;
  const { chip, takeawayBox = true } = options;
  const takeaway = !spec.takeaway ? ''
    : takeawayBox
      ? `<div class="takeaway"><div class="takeaway-label">TAKEAWAY</div><div class="takeaway-text">${esc(spec.takeaway)}</div></div>`
      : `<p class="takeaway-plain">${esc(spec.takeaway)}</p>`;
  return `<!doctype html>
<html><head><meta charset="utf-8">
<link href="${FONTS_URL}" rel="stylesheet">
<style>
  :root {
    --bg: ${look.bg}; --text: ${look.text}; --soft: ${look.soft}; --muted: ${look.muted};
    --card: ${look.card}; --line: ${look.line};
    --a0: ${look.accents[0]}; --a1: ${look.accents[1]}; --a2: ${look.accents[2]}; --a3: ${look.accents[3]};
    --head: '${look.head}', sans-serif; --body: '${look.body}', sans-serif;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html { font-size: 16px; }
  body { width: ${CANVAS_WIDTH}px; background: var(--bg); font-family: var(--body); color: var(--text); }
  .canvas {
    width: ${CANVAS_WIDTH}px; min-height: ${CANVAS_HEIGHT}px; padding: 4.5rem 4rem 3rem;
    display: flex; flex-direction: column; gap: 2.5rem;
    background:
      radial-gradient(circle at 0% 0%, ${look.glow1}, transparent 45%),
      radial-gradient(circle at 100% 100%, ${look.glow2}, transparent 45%),
      var(--bg);
  }
  .chip { display: inline-block; font-size: .95rem; font-weight: 700; letter-spacing: .14em; color: var(--a0);
    border: 1px solid var(--a0); padding: .45rem 1rem; border-radius: 999px; margin-bottom: 1.4rem; text-transform: uppercase; }
  h1 { font-family: var(--head); font-size: 4rem; line-height: 1.05; font-weight: 800; }
  .subtitle { font-size: 1.6rem; line-height: 1.4; color: var(--muted); margin-top: 1rem; }
  main { flex: 1; display: flex; flex-direction: column; justify-content: center; }

  .comparison { display: grid; gap: 1.25rem; }
  .col { background: var(--card); border: 1px solid var(--line); border-top: 6px solid var(--accent);
    border-radius: 18px; padding: 1.75rem 1.5rem; display: flex; flex-direction: column; }
  .col-name { font-family: var(--head); font-size: 2.1rem; font-weight: 700; color: var(--accent); }
  .col-tagline { font-size: 1.2rem; color: var(--soft); margin: .5rem 0 1.25rem; line-height: 1.4; font-weight: 500; }
  .col ul { list-style: none; display: flex; flex-direction: column; gap: .8rem; flex: 1; }
  .col li { font-size: 1.15rem; line-height: 1.45; color: var(--text); padding-left: 1.4rem; position: relative; }
  .col li::before { content: ''; position: absolute; left: 0; top: .55em; width: .55rem; height: .55rem; border-radius: 50%; background: var(--accent); }
  .analogy { margin-top: 1.5rem; padding: 1rem 1.1rem; border-radius: 12px; border: 1px dashed var(--line);
    font-size: 1.1rem; line-height: 1.45; color: var(--soft); font-style: italic; }
  .analogy span { display: block; font-style: normal; font-size: .8rem; font-weight: 700; letter-spacing: .12em;
    text-transform: uppercase; color: var(--accent); margin-bottom: .35rem; }

  .architecture { display: flex; flex-direction: column; align-items: center; }
  .tier { display: flex; justify-content: center; gap: 1rem; width: 100%; flex-wrap: wrap; }
  .node { flex: 1 1 0; max-width: 300px; min-width: 170px; background: var(--card); border: 1px solid var(--line);
    border-radius: 16px; padding: 1.1rem 1rem; text-align: center; }
  .node-icon { width: 2.6rem; height: 2.6rem; margin: 0 auto .6rem; color: var(--a0); }
  .kind-database .node-icon, .kind-storage .node-icon { color: var(--a1); }
  .kind-cache .node-icon, .kind-client .node-icon { color: var(--a2); }
  .kind-queue .node-icon { color: var(--a3); }
  .node-label { font-family: var(--head); font-size: 1.45rem; font-weight: 700; }
  .node-detail { font-size: 1.05rem; color: var(--muted); margin-top: .35rem; line-height: 1.35; }
  .arrow { position: relative; height: 5.5rem; width: 100%; display: flex; align-items: center; justify-content: center; }
  .arrow::before { content: ''; position: absolute; top: .4rem; bottom: .9rem; left: 50%; width: 3px; transform: translateX(-50%);
    background: var(--a0); }
  .arrow::after { content: ''; position: absolute; bottom: .3rem; left: 50%; transform: translateX(-50%);
    border: .6rem solid transparent; border-top: .8rem solid var(--a0); border-bottom: 0; }
  .arrow span { position: relative; z-index: 1; background: var(--bg); border: 1px solid var(--a0); color: var(--text);
    font-size: 1.1rem; font-weight: 600; padding: .4rem 1rem; border-radius: 999px; max-width: 85%; text-align: center; }

  .timeline { display: flex; flex-direction: column; gap: 1.6rem; }
  .tl-group { background: var(--card); border: 1px solid var(--line); border-left: 6px solid var(--accent);
    border-radius: 16px; padding: 1.25rem 1.4rem; display: flex; flex-direction: column; gap: .7rem; }
  .tl-head { display: flex; align-items: baseline; gap: 1rem; flex-wrap: wrap; margin-bottom: .2rem; }
  .tl-name { font-family: var(--head); font-size: 1.8rem; font-weight: 700; color: var(--accent); }
  .tl-caption { font-size: 1.1rem; color: var(--muted); }
  .lane { display: flex; align-items: center; gap: 1rem; }
  .lane-label { width: 8.5rem; flex-shrink: 0; font-size: 1.05rem; font-weight: 600; color: var(--soft); text-align: right; }
  .track { position: relative; flex: 1; height: 2.6rem; background: var(--line); border-radius: 8px; }
  .seg { position: absolute; top: 0; bottom: 0; border-radius: 7px; display: flex; align-items: center; justify-content: center;
    font-size: .95rem; font-weight: 600; overflow: hidden; white-space: nowrap; border: 2px solid var(--bg); }
  .seg-run { background: var(--a0); color: var(--bg); }
  .seg-wait { background: repeating-linear-gradient(45deg, rgba(251,191,36,.45) 0 8px, rgba(251,191,36,.18) 8px 16px); color: var(--text); }
  .seg-idle { background: transparent; border: 2px dashed var(--line); color: var(--muted); }
  .axis .track { background: none; height: 1.6rem; border-top: 2px solid var(--line); border-radius: 0; }
  .axis .lane-label { color: var(--muted); font-weight: 500; }
  .ticks span { position: absolute; top: .2rem; transform: translateX(-50%); font-size: .9rem; color: var(--muted); }
  .legend { display: flex; justify-content: center; gap: 2rem; font-size: 1.05rem; color: var(--muted); }
  .legend span { display: flex; align-items: center; gap: .5rem; }
  .legend i { display: inline-block; width: 1.6rem; height: 1rem; border-radius: 4px; position: static; }

  .steps { list-style: none; display: flex; flex-direction: column; gap: 1.1rem; position: relative; }
  .steps li { display: flex; gap: 1.4rem; align-items: flex-start; background: var(--card);
    border: 1px solid var(--line); border-radius: 16px; padding: 1.3rem 1.5rem; }
  .step-num { flex-shrink: 0; width: 3.2rem; height: 3.2rem; border-radius: 50%; display: flex; align-items: center; justify-content: center;
    font-family: var(--head); font-size: 1.6rem; font-weight: 800; color: var(--bg); background: var(--accent); }
  .step-title { font-family: var(--head); font-size: 1.6rem; font-weight: 700; }
  .step-detail { font-size: 1.2rem; line-height: 1.45; color: var(--soft); margin-top: .3rem; }

  .big-idea { display: flex; flex-direction: column; gap: 2.5rem; }
  .statement { font-family: var(--head); font-size: 3.4rem; line-height: 1.15; font-weight: 800; color: var(--a0);
    border-left: 8px solid var(--a0); padding-left: 2rem; }
  .big-idea ul { list-style: none; display: flex; flex-direction: column; gap: 1.2rem; padding-left: 2.5rem; }
  .big-idea li { font-size: 1.7rem; line-height: 1.4; color: var(--soft); padding-left: 1.6rem; position: relative; }
  .big-idea li::before { content: ''; position: absolute; left: 0; top: .7em; width: .8rem; height: 3px; background: var(--muted); }

  .dos-donts { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; }
  .dd { background: var(--card); border: 1px solid var(--line); border-radius: 18px; padding: 2.25rem 1.75rem; }
  .dd-head { font-family: var(--head); font-size: 2.8rem; font-weight: 800; margin-bottom: 1.6rem; }
  .do .dd-head, .do b { color: var(--a1); }
  .dont .dd-head, .dont b { color: var(--a3); }
  .dd ul { list-style: none; display: flex; flex-direction: column; gap: 1.6rem; }
  .dd li { font-size: 1.55rem; line-height: 1.45; display: flex; gap: .8rem; }
  .dd b { flex-shrink: 0; }

  .takeaway { border-radius: 18px; padding: 1.5rem 1.75rem; background: var(--card); border: 1px solid var(--line); border-left: 6px solid var(--a1); }
  .takeaway-label { font-size: .85rem; font-weight: 700; letter-spacing: .14em; color: var(--a1); margin-bottom: .4rem; }
  .takeaway-text { font-size: 1.45rem; line-height: 1.4; font-weight: 600; }
  .takeaway-plain { font-size: 1.5rem; line-height: 1.4; font-weight: 600; color: var(--soft); border-top: 2px solid var(--line); padding-top: 1.5rem; }
  footer { font-size: 1rem; color: var(--muted); letter-spacing: .04em; }
</style></head>
<body><div class="canvas">
  <header>
    ${chip ? `<span class="chip">${esc(chip)}</span>` : ''}
    <h1>${esc(spec.title)}</h1>
    ${spec.subtitle ? `<p class="subtitle">${esc(spec.subtitle)}</p>` : ''}
  </header>
  <main>${RENDERERS[spec.layout](spec)}</main>
  ${takeaway}
  <footer>Hassaan Riaz</footer></div></body></html>`;
}

// Screenshots the page with Playwright, shrinking the type until everything fits the canvas
export async function renderPng(spec, outputPath, options = {}) {
  const { chromium } = await import('playwright');
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: CANVAS_WIDTH, height: CANVAS_HEIGHT }, deviceScaleFactor: 2 });
    await page.setContent(renderHtml(spec, options), { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);

    const fontSize = await page.evaluate(({ maxHeight }) => {
      let size = 16;
      const canvas = document.querySelector('.canvas');
      while (canvas.scrollHeight > maxHeight && size > 10) {
        size -= 0.5;
        document.documentElement.style.fontSize = `${size}px`;
      }
      return size;
    }, { maxHeight: CANVAS_HEIGHT });
    if (fontSize < 16) console.log(`Scaled text down to ${fontSize}px base to fit the canvas.`);

    await page.locator('.canvas').screenshot({ path: outputPath });
  } finally {
    await browser.close();
  }
}
