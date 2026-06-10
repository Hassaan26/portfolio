import fs from 'fs';
import path from 'path';

const ARTICLES_PATH = path.resolve('src/data/articles.json');
const LINKEDIN_ACCESS_TOKEN = process.env.LINKEDIN_ACCESS_TOKEN;
const LINKEDIN_PERSON_URN = process.env.LINKEDIN_PERSON_URN; // Format: urn:li:person:XXXXXXXXXX
const PORTFOLIO_URL = process.env.PORTFOLIO_URL || 'https://hassaan-portfolio.vercel.app'; // Fallback link

async function postToLinkedIn() {
  if (!LINKEDIN_ACCESS_TOKEN || !LINKEDIN_PERSON_URN) {
    console.log('LinkedIn credentials not fully configured. Skipping LinkedIn share step.');
    return;
  }

  try {
    // Read the latest article (first index)
    if (!fs.existsSync(ARTICLES_PATH)) {
      console.error('No articles database found. Skipping share.');
      return;
    }

    const articles = JSON.parse(fs.readFileSync(ARTICLES_PATH, 'utf-8') || '[]');
    if (articles.length === 0) {
      console.error('No articles available to share.');
      return;
    }

    const latestArticle = articles[0];
    console.log(`Preparing to share latest article to LinkedIn: "${latestArticle.title}"`);

    // Build educational takeaway-style commentary
    let postCommentary = `💡 Key Takeaways: ${latestArticle.title}\n\n`;
    if (Array.isArray(latestArticle.linkedinSummary) && latestArticle.linkedinSummary.length > 0) {
      postCommentary += latestArticle.linkedinSummary.map(point => `• ${point}`).join('\n');
    } else {
      postCommentary += `"${latestArticle.snippet}"`;
    }
    postCommentary += `\n\nRead the full technical breakdown on my portfolio:\n🔗 ${PORTFOLIO_URL}/#articles\n\n#AI #LLMs #RAG #SoftwareEngineering #BackendArchitect`;

    // Prepare payload for LinkedIn UGC Post API
    const sharePayload = {
      author: LINKEDIN_PERSON_URN,
      lifecycleState: 'PUBLISHED',
      specificContent: {
        'com.linkedin.ugc.ShareContent': {
          shareCommentary: {
            text: postCommentary
          },
          shareMediaCategory: 'ARTICLE',
          media: [
            {
              status: 'READY',
              description: {
                text: latestArticle.snippet
              },
              originalUrl: `${PORTFOLIO_URL}/#articles`,
              title: {
                text: latestArticle.title
              }
            }
          ]
        }
      },
      visibility: {
        'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
      }
    };

    console.log('Sending API request to LinkedIn...');
    const response = await fetch('https://api.linkedin.com/v2/ugcPosts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LINKEDIN_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
        'X-Restli-Protocol-Version': '2.0.0'
      },
      body: JSON.stringify(sharePayload)
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`LinkedIn API returned error (${response.status}): ${errText}`);
    }

    const result = await response.json();
    console.log('Successfully posted to LinkedIn! Post ID:', result.id);
  } catch (error) {
    console.error('Failed to publish article on LinkedIn:', error);
  }
}

postToLinkedIn();
