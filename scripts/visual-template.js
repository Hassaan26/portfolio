// Renders a visual spec (produced by Gemini) into a branded 1080x1350 HTML page.
// Gemini only decides WHAT goes in the diagram; the layouts below decide how it looks.

export const LAYOUTS = ['comparison', 'architecture', 'timeline', 'steps'];
export const NODE_KINDS = ['client', 'service', 'database', 'cache', 'queue', 'storage', 'other'];
export const SEGMENT_KINDS = ['run', 'wait', 'idle'];

export const CANVAS_WIDTH = 1080;
export const CANVAS_HEIGHT = 1350;

const AUTHOR = 'Hassaan Riaz';
const AUTHOR_ROLE = 'Staff Software Consultant · Backend & AI';

const ACCENTS = ['#818cf8', '#2dd4bf', '#c084fc', '#f472b6'];

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

function renderComparison(spec) {
  const columns = spec.columns.map((col, idx) => `
    <div class="col" style="--accent:${ACCENTS[idx % ACCENTS.length]}">
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
    <div class="tl-group" style="--accent:${ACCENTS[idx % ACCENTS.length]}">
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
    <li style="--accent:${ACCENTS[idx % ACCENTS.length]}">
      <div class="step-num">${idx + 1}</div>
      <div><div class="step-title">${esc(step.title)}</div><div class="step-detail">${esc(step.detail)}</div></div>
    </li>`).join('')}
  </ol>`;
}

const RENDERERS = {
  comparison: renderComparison,
  architecture: renderArchitecture,
  timeline: renderTimeline,
  steps: renderSteps,
};

export function renderHtml(spec) {
  return `<!doctype html>
<html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@600;700;800&display=swap" rel="stylesheet">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html { font-size: 16px; }
  body { width: ${CANVAS_WIDTH}px; background: #07080d; font-family: Inter, sans-serif; color: #f3f4f6; }
  .canvas {
    width: ${CANVAS_WIDTH}px; min-height: ${CANVAS_HEIGHT}px; padding: 4.5rem 4rem 3rem;
    display: flex; flex-direction: column; gap: 2.5rem;
    background:
      radial-gradient(circle at 0% 0%, rgba(99,102,241,.28), transparent 45%),
      radial-gradient(circle at 100% 100%, rgba(168,85,247,.22), transparent 45%),
      #07080d;
  }
  .chip { display: inline-block; font-size: .95rem; font-weight: 700; letter-spacing: .14em; color: #a5b4fc;
    border: 1px solid rgba(129,140,248,.4); background: rgba(99,102,241,.12); padding: .45rem 1rem; border-radius: 999px; }
  h1 { font-family: Outfit, sans-serif; font-size: 4rem; line-height: 1.05; font-weight: 800; margin-top: 1.4rem;
    background: linear-gradient(90deg, #fff, #c7d2fe); -webkit-background-clip: text; color: transparent; }
  .subtitle { font-size: 1.6rem; line-height: 1.4; color: #9ca3af; margin-top: 1rem; }
  main { flex: 1; display: flex; flex-direction: column; justify-content: center; }

  .comparison { display: grid; gap: 1.25rem; }
  .col { background: rgba(15,17,28,.75); border: 1px solid rgba(255,255,255,.08); border-top: 6px solid var(--accent);
    border-radius: 18px; padding: 1.75rem 1.5rem; display: flex; flex-direction: column; }
  .col-name { font-family: Outfit, sans-serif; font-size: 2.1rem; font-weight: 700; color: var(--accent); }
  .col-tagline { font-size: 1.2rem; color: #d1d5db; margin: .5rem 0 1.25rem; line-height: 1.4; font-weight: 500; }
  .col ul { list-style: none; display: flex; flex-direction: column; gap: .8rem; flex: 1; }
  .col li { font-size: 1.15rem; line-height: 1.45; color: #e5e7eb; padding-left: 1.4rem; position: relative; }
  .col li::before { content: ''; position: absolute; left: 0; top: .55em; width: .55rem; height: .55rem; border-radius: 50%; background: var(--accent); }
  .analogy { margin-top: 1.5rem; padding: 1rem 1.1rem; border-radius: 12px; background: rgba(255,255,255,.04);
    font-size: 1.1rem; line-height: 1.45; color: #d1d5db; font-style: italic; }
  .analogy span { display: block; font-style: normal; font-size: .8rem; font-weight: 700; letter-spacing: .12em;
    text-transform: uppercase; color: var(--accent); margin-bottom: .35rem; }

  .architecture { display: flex; flex-direction: column; align-items: center; }
  .tier { display: flex; justify-content: center; gap: 1rem; width: 100%; flex-wrap: wrap; }
  .node { flex: 1 1 0; max-width: 300px; min-width: 170px; background: rgba(15,17,28,.85); border: 1px solid rgba(129,140,248,.35);
    border-radius: 16px; padding: 1.1rem 1rem; text-align: center; }
  .node-icon { width: 2.6rem; height: 2.6rem; margin: 0 auto .6rem; color: #818cf8; }
  .kind-database .node-icon, .kind-storage .node-icon { color: #2dd4bf; }
  .kind-cache .node-icon { color: #fbbf24; }
  .kind-queue .node-icon { color: #f472b6; }
  .kind-client .node-icon { color: #c084fc; }
  .node-label { font-family: Outfit, sans-serif; font-size: 1.45rem; font-weight: 700; }
  .node-detail { font-size: 1.05rem; color: #9ca3af; margin-top: .35rem; line-height: 1.35; }
  .arrow { position: relative; height: 5.5rem; width: 100%; display: flex; align-items: center; justify-content: center; }
  .arrow::before { content: ''; position: absolute; top: .4rem; bottom: .9rem; left: 50%; width: 3px; transform: translateX(-50%);
    background: linear-gradient(#818cf8, #c084fc); }
  .arrow::after { content: ''; position: absolute; bottom: .3rem; left: 50%; transform: translateX(-50%);
    border: .6rem solid transparent; border-top: .8rem solid #c084fc; border-bottom: 0; }
  .arrow span { position: relative; z-index: 1; background: #1e1b4b; border: 1px solid rgba(129,140,248,.5); color: #e0e7ff;
    font-size: 1.1rem; font-weight: 600; padding: .4rem 1rem; border-radius: 999px; max-width: 85%; text-align: center; }

  .timeline { display: flex; flex-direction: column; gap: 1.6rem; }
  .tl-group { background: rgba(15,17,28,.75); border: 1px solid rgba(255,255,255,.08); border-left: 6px solid var(--accent);
    border-radius: 16px; padding: 1.25rem 1.4rem; display: flex; flex-direction: column; gap: .7rem; }
  .tl-head { display: flex; align-items: baseline; gap: 1rem; flex-wrap: wrap; margin-bottom: .2rem; }
  .tl-name { font-family: Outfit, sans-serif; font-size: 1.8rem; font-weight: 700; color: var(--accent); }
  .tl-caption { font-size: 1.1rem; color: #9ca3af; }
  .lane { display: flex; align-items: center; gap: 1rem; }
  .lane-label { width: 8.5rem; flex-shrink: 0; font-size: 1.05rem; font-weight: 600; color: #d1d5db; text-align: right; }
  .track { position: relative; flex: 1; height: 2.6rem; background: rgba(255,255,255,.03); border-radius: 8px; }
  .seg { position: absolute; top: 0; bottom: 0; border-radius: 7px; display: flex; align-items: center; justify-content: center;
    font-size: .95rem; font-weight: 600; overflow: hidden; white-space: nowrap; border: 2px solid #07080d; }
  .seg-run { background: linear-gradient(90deg, #6366f1, #8b5cf6); color: #fff; }
  .seg-wait { background: repeating-linear-gradient(45deg, rgba(251,191,36,.35) 0 8px, rgba(251,191,36,.12) 8px 16px); color: #fde68a; }
  .seg-idle { background: transparent; border: 2px dashed rgba(255,255,255,.18); color: #6b7280; }
  .axis .track { background: none; height: 1.6rem; border-top: 2px solid rgba(255,255,255,.2); border-radius: 0; }
  .axis .lane-label { color: #6b7280; font-weight: 500; }
  .ticks span { position: absolute; top: .2rem; transform: translateX(-50%); font-size: .9rem; color: #6b7280; }
  .legend { display: flex; justify-content: center; gap: 2rem; font-size: 1.05rem; color: #9ca3af; }
  .legend span { display: flex; align-items: center; gap: .5rem; }
  .legend i { display: inline-block; width: 1.6rem; height: 1rem; border-radius: 4px; position: static; }

  .steps { list-style: none; display: flex; flex-direction: column; gap: 1.1rem; position: relative; }
  .steps li { display: flex; gap: 1.4rem; align-items: flex-start; background: rgba(15,17,28,.75);
    border: 1px solid rgba(255,255,255,.08); border-radius: 16px; padding: 1.3rem 1.5rem; }
  .step-num { flex-shrink: 0; width: 3.2rem; height: 3.2rem; border-radius: 50%; display: flex; align-items: center; justify-content: center;
    font-family: Outfit, sans-serif; font-size: 1.6rem; font-weight: 800; color: #07080d; background: var(--accent); }
  .step-title { font-family: Outfit, sans-serif; font-size: 1.6rem; font-weight: 700; }
  .step-detail { font-size: 1.2rem; line-height: 1.45; color: #d1d5db; margin-top: .3rem; }

  .takeaway { border-radius: 18px; padding: 1.5rem 1.75rem; background: linear-gradient(135deg, rgba(99,102,241,.22), rgba(20,184,166,.14));
    border: 1px solid rgba(129,140,248,.35); }
  .takeaway-label { font-size: .85rem; font-weight: 700; letter-spacing: .14em; color: #5eead4; margin-bottom: .4rem; }
  .takeaway-text { font-size: 1.45rem; line-height: 1.4; font-weight: 600; }
  footer { display: flex; justify-content: space-between; align-items: center; font-size: 1.05rem; color: #6b7280;
    border-top: 1px solid rgba(255,255,255,.08); padding-top: 1.25rem; }
  footer strong { color: #e5e7eb; font-family: Outfit, sans-serif; font-size: 1.3rem; margin-right: .6rem; }
</style></head>
<body><div class="canvas">
  <header>
    <span class="chip">SYSTEM DESIGN, VISUALIZED</span>
    <h1>${esc(spec.title)}</h1>
    <p class="subtitle">${esc(spec.subtitle)}</p>
  </header>
  <main>${RENDERERS[spec.layout](spec)}</main>
  <div class="takeaway"><div class="takeaway-label">KEY TAKEAWAY</div><div class="takeaway-text">${esc(spec.takeaway)}</div></div>
  <footer><span><strong>${AUTHOR}</strong>${AUTHOR_ROLE}</span><span>Save this for later ↗</span></footer>
</div></body></html>`;
}

// Screenshots the page with Playwright, shrinking the type until everything fits the canvas
export async function renderPng(spec, outputPath) {
  const { chromium } = await import('playwright');
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: CANVAS_WIDTH, height: CANVAS_HEIGHT }, deviceScaleFactor: 2 });
    await page.setContent(renderHtml(spec), { waitUntil: 'networkidle' });
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
