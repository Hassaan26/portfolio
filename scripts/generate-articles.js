import fs from 'fs';
import path from 'path';

const ARTICLES_PATH = path.resolve('src/data/articles.json');
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

async function getTrendingTopics() {
  try {
    console.log('Fetching trending tech topics from Hacker News...');
    const topStoriesRes = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json');
    const storyIds = await topStoriesRes.json();
    
    // Fetch titles of the top 8 stories
    const topTitles = [];
    for (let i = 0; i < Math.min(storyIds.length, 8); i++) {
      const storyRes = await fetch(`https://hacker-news.firebaseio.com/v0/item/${storyIds[i]}.json`);
      const story = await storyRes.json();
      if (story && story.title) {
        topTitles.push(story.title);
      }
    }
    console.log('Trending Topics Found:', topTitles);
    return topTitles;
  } catch (error) {
    console.error('Error fetching trending topics:', error);
    return ['AI pipelines', 'Scalable Backend architectures', 'Big Data Orchestration'];
  }
}

async function generateArticle(trends) {
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY environment variable is not defined!');
  }

  const prompt = `You are Hassaan Riaz, an experienced Staff Software Consultant and Full Stack Engineer with 10+ years of experience in Python (Django/FastAPI), Scala (AWS Glue/EMR pipelines), and AI/RAG architectures.

Based on these current trending tech topics:
${trends.map((t, idx) => `${idx + 1}. ${t}`).join('\n')}

Select the single most relevant topic for a backend system architect, data engineer, or generative AI developer. Write a highly detailed, educational, and engaging article about it.

Requirements:
1. Tone should be professional, experienced, and highly technical yet clear.
2. The content must include markdown sections (headings, bullet points, and code snippet block if appropriate).
3. The content body should be 400 to 500 words.
4. Output should be formatted as a single JSON object (with NO markdown code wrapping around it) containing:
   - title: Title of the article.
   - snippet: 1-2 sentence summary.
   - category: One of "AI & RAG", "Data Engineering", "Backend Architecture", or "Full Stack".
   - readTime: Estimated read time (e.g., "5 min read").
   - content: The full body text of the article in Markdown format (with escaped newlines).
   - date: Today's date in YYYY-MM-DD format.`;

  console.log('Calling Gemini API for article generation...');
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        parts: [{ text: prompt }]
      }],
      generationConfig: {
        responseMimeType: 'application/json'
      }
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gemini API error (${response.status}): ${errText}`);
  }

  const result = await response.json();
  const textResponse = result.candidates[0].content.parts[0].text;
  
  // Parse the JSON output from the model
  const generatedData = JSON.parse(textResponse);
  return generatedData;
}

async function main() {
  try {
    const trends = await getTrendingTopics();
    const newArticle = await generateArticle(trends);
    
    // Read current articles
    let articles = [];
    if (fs.existsSync(ARTICLES_PATH)) {
      const fileContent = fs.readFileSync(ARTICLES_PATH, 'utf-8');
      articles = JSON.parse(fileContent || '[]');
    }

    // Assign dynamic ID
    const nextId = articles.length > 0 ? Math.max(...articles.map(a => a.id || 0)) + 1 : 1;
    newArticle.id = nextId;

    // Prepends to list
    articles.unshift(newArticle);

    // Save back to disk
    fs.writeFileSync(ARTICLES_PATH, JSON.stringify(articles, null, 2), 'utf-8');
    console.log(`Successfully generated and appended new article: "${newArticle.title}" (ID: ${newArticle.id})`);
  } catch (error) {
    console.error('Critical execution error:', error);
    process.exit(1);
  }
}

main();
