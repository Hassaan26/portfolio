// Builds the LinkedIn post text for a visual. Shared by the poster and the dry-run preview,
// so what you preview is exactly what gets published.
export function formatPost(visual) {
  const { hook, context, points, question, hashtags } = visual.post;
  return [
    hook,
    context, // absent on visuals generated before experience themes; filtered below
    points.map(point => `→ ${point}`).join('\n'),
    `💡 ${visual.takeaway}`,
    question,
    hashtags.join(' '),
  ].filter(Boolean).join('\n\n');
}
