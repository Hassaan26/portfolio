const token = process.env.LINKEDIN_ACCESS_TOKEN;
if (!token) {
    console.error("No LINKEDIN_ACCESS_TOKEN provided");
    process.exit(1);
}

fetch('https://api.linkedin.com/v2/me', {
    headers: { Authorization: 'Bearer ' + token }
})
.then(r => r.json())
.then(d => {
    console.log('API Response:', JSON.stringify(d, null, 2));
    if (d.id) {
          console.log('ID length:', d.id.length);
          console.log('ID characters separated:', d.id.split('').join(' '));
    } else {
          console.log('No ID in response. Error/Warning?');
    }
})
.catch(e => {
    console.error('Fetch error:', e);
});
