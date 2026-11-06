// Builds the LinkedIn post text for a visual. Shared by the poster and the dry-run preview,
// so what you preview is exactly what gets published.
export function formatPost(visual) {
  const { text, hashtags = [] } = visual.post;
  if (text) return [text, hashtags.join(' ')].filter(Boolean).join('\n\n');

  // Older visuals (before post styles) stored the post as structured parts
  const { hook, context, points, question } = visual.post;
  return [
    hook,
    context,
    points.map(point => `→ ${point}`).join('\n'),
    `💡 ${visual.takeaway}`,
    question,
    hashtags.join(' '),
  ].filter(Boolean).join('\n\n');
}
