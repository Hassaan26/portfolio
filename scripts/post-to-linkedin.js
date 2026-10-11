import fs from 'fs';
import path from 'path';

const ARTICLES_PATH = path.resolve('src/data/articles.json');
const LINKEDIN_ACCESS_TOKEN = process.env.LINKEDIN_ACCESS_TOKEN;
const PORTFOLIO_URL = process.env.PORTFOLIO_URL || 'https://hassaan-portfolio.vercel.app'; // Fallback link

// Resolve the author URN from the token itself so it always matches the token's owner.
// Requires the token to include the `openid` and `profile` scopes.
async function getAuthorUrn() {
  const response = await fetch('https://api.linkedin.com/v2/userinfo', {
    headers: { 'Authorization': `Bearer ${LINKEDIN_ACCESS_TOKEN}` }
  });
  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Could not resolve LinkedIn member from token (${response.status}): ${errText}. ` +
      'Make sure the token was generated with the openid, profile and w_member_social scopes.');
  }
  const { sub } = await response.json();
  return `urn:li:person:${sub}`;
}

async function postToLinkedIn() {
  if (!LINKEDIN_ACCESS_TOKEN) {
    console.error('LINKEDIN_ACCESS_TOKEN is not configured.');
    process.exit(1);
  }

  try {
    const authorUrn = await getAuthorUrn();

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
      author: authorUrn,
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
    process.exit(1);
  }
}

postToLinkedIn();
