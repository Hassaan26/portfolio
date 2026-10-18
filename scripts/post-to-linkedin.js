import fs from 'fs';
import path from 'path';
import { formatPost } from './format-post.js';

const VISUALS_PATH = path.resolve('src/data/visuals.json');
const LINKEDIN_ACCESS_TOKEN = process.env.LINKEDIN_ACCESS_TOKEN;

const linkedInHeaders = {
  'Authorization': `Bearer ${LINKEDIN_ACCESS_TOKEN}`,
  'Content-Type': 'application/json',
  'X-Restli-Protocol-Version': '2.0.0'
};

async function checkResponse(response, action) {
  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`LinkedIn ${action} failed (${response.status}): ${errText}`);
  }
}

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

// Registers an image upload with LinkedIn, uploads the PNG and returns the asset URN
async function uploadImage(authorUrn, imagePath) {
  const registerResponse = await fetch('https://api.linkedin.com/v2/assets?action=registerUpload', {
    method: 'POST',
    headers: linkedInHeaders,
    body: JSON.stringify({
      registerUploadRequest: {
        recipes: ['urn:li:digitalmediaRecipe:feedshare-image'],
        owner: authorUrn,
        serviceRelationships: [{ relationshipType: 'OWNER', identifier: 'urn:li:userGeneratedContent' }]
      }
    })
  });
  await checkResponse(registerResponse, 'image upload registration');

  const { value } = await registerResponse.json();
  const uploadUrl = value.uploadMechanism['com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest'].uploadUrl;

  const uploadResponse = await fetch(uploadUrl, {
    method: 'PUT',
    headers: { 'Authorization': `Bearer ${LINKEDIN_ACCESS_TOKEN}`, 'Content-Type': 'image/png' },
    body: fs.readFileSync(imagePath)
  });
  await checkResponse(uploadResponse, 'image upload');

  return value.asset;
}

async function postToLinkedIn() {
  if (!LINKEDIN_ACCESS_TOKEN) {
    console.error('LINKEDIN_ACCESS_TOKEN is not configured.');
    process.exit(1);
  }

  try {
    const visuals = fs.existsSync(VISUALS_PATH) ? JSON.parse(fs.readFileSync(VISUALS_PATH, 'utf-8') || '[]') : [];
    if (visuals.length === 0) {
      throw new Error('No visuals available to share.');
    }

    const latest = visuals[0];
    const imagePath = path.resolve('public', latest.image.replace(/^\//, ''));
    console.log(`Preparing to share "${latest.title}" (${imagePath})`);

    const authorUrn = await getAuthorUrn();

    console.log('Uploading image to LinkedIn...');
    const assetUrn = await uploadImage(authorUrn, imagePath);

    const postCommentary = formatPost(latest);

    const sharePayload = {
      author: authorUrn,
      lifecycleState: 'PUBLISHED',
      specificContent: {
        'com.linkedin.ugc.ShareContent': {
          shareCommentary: { text: postCommentary },
          shareMediaCategory: 'IMAGE',
          media: [
            {
              status: 'READY',
              media: assetUrn,
              title: { text: latest.title },
              description: { text: latest.subtitle }
            }
          ]
        }
      },
      visibility: {
        'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
      }
    };

    console.log('Creating LinkedIn post...');
    const response = await fetch('https://api.linkedin.com/v2/ugcPosts', {
      method: 'POST',
      headers: linkedInHeaders,
      body: JSON.stringify(sharePayload)
    });
    await checkResponse(response, 'post creation');

    const result = await response.json();
    console.log('Successfully posted to LinkedIn! Post ID:', result.id);
  } catch (error) {
    console.error('Failed to publish visual on LinkedIn:', error);
    process.exit(1);
  }
}

postToLinkedIn();
