const puppeteer = require('puppeteer');

async function captureEversportsAPI() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  const apiCalls = [];

  page.on('request', request => {
    const url = request.url();
    apiCalls.push({
      url: url,
      method: request.method(),
      headers: request.headers(),
      postData: request.postData()
    });
  });

  page.on('response', async response => {
    const url = response.url();
    if (url.includes('api') || url.includes('eversports')) {
      try {
        const contentType = response.headers()['content-type'] || '';
        if (contentType.includes('application/json')) {
          const data = await response.json();
          console.log('\n=== API Response ===');
          console.log('URL:', url);
          console.log('Status:', response.status());
          console.log('Data:', JSON.stringify(data, null, 2).substring(0, 2000));
        }
      } catch (e) {
        // Ignore
      }
    }
  });

  console.log('Loading Eversports widget directly...');
  await page.goto('https://widget.eversports.com/w/jmjffr', {
    waitUntil: 'networkidle2',
    timeout: 60000
  });

  // Wait for content to load
  await new Promise(resolve => setTimeout(resolve, 10000));

  console.log('\n=== All API Calls ===');
  const relevantCalls = apiCalls.filter(c =>
    c.url.includes('api') ||
    c.url.includes('booking') ||
    c.url.includes('calendar') ||
    c.url.includes('availability') ||
    c.url.includes('slot')
  );

  relevantCalls.forEach((call, i) => {
    console.log(`\n${i + 1}. ${call.method} ${call.url}`);
    if (call.postData) {
      console.log('   Data:', call.postData);
    }
  });

  await browser.close();
  console.log('\nDone!');
}

captureEversportsAPI().catch(console.error);
