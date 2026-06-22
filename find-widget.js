const puppeteer = require('puppeteer');

async function findEversportsData() {
  const browser = await puppeteer.launch({
    headless: false,  // Show browser to see what happens
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();

  // Enable request interception
  await page.setRequestInterception(true);

  const requests = [];
  page.on('request', request => {
    requests.push({
      url: request.url(),
      method: request.method()
    });
    request.continue();
  });

  const responses = [];
  page.on('response', async response => {
    const url = response.url();
    if (url.includes('eversports') || url.includes('booking') || url.includes('calendar') || url.includes('api')) {
      responses.push({
        url: url,
        status: response.status(),
        contentType: response.headers()['content-type']
      });

      try {
        const text = await response.text();
        if (text.length < 5000) {
          console.log('\n=== Response from:', url);
          console.log(text.substring(0, 1000));
        }
      } catch (e) {}
    }
  });

  console.log('Opening Rothof page...');
  await page.goto('https://rothof.de/online-buchen/', {
    waitUntil: 'networkidle0',
    timeout: 60000
  });

  // Look for iframes
  const frames = page.frames();
  console.log(`\nFound ${frames.length} frames`);

  for (const frame of frames) {
    const url = frame.url();
    if (url.includes('eversports')) {
      console.log('\nEversports frame found:', url);
    }
  }

  // Wait and check for new frames
  await new Promise(resolve => setTimeout(resolve, 10000));

  const framesAfter = page.frames();
  console.log(`\nFrames after wait: ${framesAfter.length}`);

  for (const frame of framesAfter) {
    const url = frame.url();
    console.log('Frame URL:', url);
  }

  console.log('\n=== All Eversports-related requests ===');
  const eversportsRequests = requests.filter(r => r.url.includes('eversports'));
  eversportsRequests.forEach(r => console.log(r.method, r.url));

  console.log('\n=== All Eversports-related responses ===');
  responses.forEach(r => console.log(r.status, r.url));

  console.log('\nKeeping browser open for 30 seconds for manual inspection...');
  await new Promise(resolve => setTimeout(resolve, 30000));

  await browser.close();
}

findEversportsData().catch(console.error);
