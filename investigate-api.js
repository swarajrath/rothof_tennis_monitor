const puppeteer = require('puppeteer');

async function investigateEversportsAPI() {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // Capture network requests
  const apiCalls = [];

  page.on('request', request => {
    const url = request.url();
    if (url.includes('eversports') || url.includes('api') || url.includes('booking')) {
      apiCalls.push({
        url: url,
        method: request.method(),
        headers: request.headers(),
        postData: request.postData()
      });
    }
  });

  page.on('response', async response => {
    const url = response.url();
    if (url.includes('eversports') || url.includes('api') || url.includes('booking')) {
      try {
        const contentType = response.headers()['content-type'] || '';
        if (contentType.includes('application/json')) {
          const data = await response.json();
          console.log('\n=== API Response ===');
          console.log('URL:', url);
          console.log('Status:', response.status());
          console.log('Data:', JSON.stringify(data, null, 2).substring(0, 500));
        }
      } catch (e) {
        // Ignore parsing errors
      }
    }
  });

  console.log('Navigating to Rothof booking page...');
  await page.goto('https://rothof.de/online-buchen/', {
    waitUntil: 'networkidle2',
    timeout: 30000
  });

  // Wait a bit for dynamic content to load
  await new Promise(resolve => setTimeout(resolve, 5000));

  // Try to click the load button if it exists
  try {
    await page.click('button, .button, [role="button"]');
    console.log('Clicked load button, waiting for widget...');
    await new Promise(resolve => setTimeout(resolve, 5000));
  } catch (e) {
    console.log('No button found or already loaded');
  }

  console.log('\n=== Captured API Calls ===');
  apiCalls.forEach((call, index) => {
    console.log(`\n${index + 1}. ${call.method} ${call.url}`);
    if (call.postData) {
      console.log('   POST Data:', call.postData);
    }
  });

  // Try to extract venue/widget ID from page content
  const content = await page.content();
  const widgetMatches = content.match(/widget\.eversports\.com[^"'\s]*/g);
  const venueMatches = content.match(/venue[_-]?id['":\s]*([0-9a-zA-Z-]+)/gi);

  console.log('\n=== Widget URLs Found ===');
  if (widgetMatches) {
    widgetMatches.forEach(match => console.log(match));
  }

  console.log('\n=== Venue IDs Found ===');
  if (venueMatches) {
    venueMatches.forEach(match => console.log(match));
  }

  await browser.close();
  console.log('\nInvestigation complete!');
}

investigateEversportsAPI().catch(console.error);
