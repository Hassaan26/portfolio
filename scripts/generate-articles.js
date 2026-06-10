import fs from 'fs';
import path from 'path';

const ARTICLES_PATH = path.resolve('src/data/articles.json');
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

async function getTrendingTopics() {
  try {
    console.log('Fetching trending tech topics from Hacker News...');
    const topStoriesRes = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json');
    const storyIds = await topStoriesRes.json();
    
    // Fetch titles of the top 30 stories to look for AI/Tech related themes
    const techKeywords = [
      'ai', 'llm', 'rag', 'openai', 'gemini', 'claude', 'machine learning', 'deep learning',
      'neural', 'gpt', 'gpu', 'vector', 'agent', 'transformer', 'tpu', 'nvidia', 'prompt engineering',
      'copilot', 'nlp', 'robot', 'llms', 'artificial intelligence', 'h100', 'b200', 'data pipeline',
      'vector database', 'chromadb', 'pgvector', 'pinecone', 'milvus', 'langchain', 'llamaindex'
    ];
    
    const storiesToFetch = Math.min(storyIds.length, 30);
    const topTitles = [];
    const aiTitles = [];
    
    for (let i = 0; i < storiesToFetch; i++) {
      const storyRes = await fetch(`https://hacker-news.firebaseio.com/v0/item/${storyIds[i]}.json`);
      const story = await storyRes.json();
      if (story && story.title) {
        const titleLower = story.title.toLowerCase();
        const matchesKeyword = techKeywords.some(keyword => titleLower.includes(keyword));
        
        if (matchesKeyword) {
          aiTitles.push(story.title);
        } else {
          topTitles.push(story.title);
        }
      }
    }
    
    // Merge prioritizing AI/tech topics first, then general topics if we don't have enough
    const mergedTopics = [...aiTitles, ...topTitles].slice(0, 10);
    console.log('Trending AI/Tech Topics Found:', aiTitles);
    console.log('Other Trending Topics Found:', topTitles);
    console.log('Selected Topics for Prompt:', mergedTopics);
    return mergedTopics;
  } catch (error) {
    console.error('Error fetching trending topics:', error);
    return ['AI pipelines', 'Scalable Backend architectures', 'Big Data Orchestration'];
  }
}

async function generateArticle(trends) {
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY environment variable is not defined!');
  }

  const prompt = `You are Hassaan Riaz, an experienced Staff Software Consultant, Backend Architect, and Generative AI developer with 10+ years of experience in Python (Django/FastAPI), Scala (AWS Glue/EMR pipelines), and AI/RAG architectures.

Based on these current trending tech topics:
${trends.map((t, idx) => `${idx + 1}. ${t}`).join('\n')}

Select the single most relevant topic for a backend system architect or generative AI developer, focusing STRICTLY on the AI, Large Language Models (LLMs), Retrieval-Augmented Generation (RAG), Agentic Systems, AI Pipelines, or related cutting-edge engineering space.
If none of the trending topics fit this space, ignore them and select a current hot concept in the AI/LLM engineering space (e.g., GraphRAG, Agentic flow routing, Vector DB optimization, evaluation frameworks like Ragas, multi-modal pipelines) to write about.

Write a highly detailed, educational, and engaging technical article about it.

Requirements:
1. Tone should be professional, authoritative, and technical yet clear.
2. The content must include markdown sections (headings, bullet points, and a code snippet block if appropriate).
3. The content body should be 400 to 500 words.
4. Output should be formatted as a single JSON object (with NO markdown code wrapping around it) containing:
   - title: Title of the article.
   - snippet: 1-2 sentence summary.
   - category: Must be "AI & RAG".
   - readTime: Estimated read time (e.g., "5 min read").
   - content: The full body text of the article in Markdown format (with escaped newlines).
   - linkedinSummary: An array of exactly 3 to 4 bullet points representing high-value technical learning takeaways/insights from the article. Each takeaway should be concise, educational, and professionally written, suitable to share directly on LinkedIn for educational value (do not include hashtags, markdown formatting, or URLs in these takeaways).
   - date: Today's date in YYYY-MM-DD format.`;

  console.log('Calling Gemini API for article generation...');
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
  
  const maxRetries = 3;
  let delay = 2000;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
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
      
      // Parse the JSON output from the model
      const generatedData = JSON.parse(textResponse);
      return generatedData;
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
