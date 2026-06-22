const puppeteer = require('puppeteer');

async function captureRealRequest() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  // Capture all API requests
  const apiRequests = [];

  page.on('request', req => {
    const url = req.url();
    if (url.includes('/api/slot')) {
      apiRequests.push({
        url: url,
        method: req.method(),
        postData: req.postData()
      });
      console.log('\n🎯 Found slot API call:');
      console.log(url);
    }
  });

  page.on('response', async res => {
    const url = res.url();
    if (url.includes('/api/slot')) {
      try {
        const data = await res.json();
        console.log('\n📊 Slot API Response:');
        console.log(`Total slots: ${data.slots?.length || 0}`);

        // Show unique court IDs
        const courtIds = [...new Set(data.slots?.map(s => s.court) || [])];
        console.log(`Court IDs: ${courtIds.join(', ')}`);
      } catch (e) {}
    }
  });

  console.log('Loading Eversports widget...');
  await page.goto('https://widget.eversports.com/w/jmjffr', {
    waitUntil: 'networkidle2',
    timeout: 60000
  });

  console.log('\nWaiting 30 seconds for you to interact with the calendar...');
  console.log('Try clicking on June 23rd to see what API call is made.\n');

  await new Promise(resolve => setTimeout(resolve, 30000));

  await browser.close();

  console.log('\n=== Summary of captured requests ===');
  apiRequests.forEach((req, i) => {
    console.log(`\n${i + 1}. ${req.url}`);
  });
}

captureRealRequest();
