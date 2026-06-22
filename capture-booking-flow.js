const puppeteer = require('puppeteer');

async function captureBookingFlow() {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1400, height: 1000 }
  });

  const page = await browser.newPage();

  // Capture ALL requests
  const requests = [];
  page.on('request', req => {
    const url = req.url();
    if (url.includes('eversports') && (url.includes('api') || url.includes('slot') || url.includes('booking') || url.includes('calendar'))) {
      requests.push({
        url: url,
        method: req.method()
      });
    }
  });

  page.on('response', async res => {
    const url = res.url();
    if (url.includes('slot') || url.includes('booking') || url.includes('calendar')) {
      console.log(`\n📡 ${res.status()} ${res.request().method()} ${url}`);

      try {
        const contentType = res.headers()['content-type'] || '';
        if (contentType.includes('json')) {
          const data = await res.json();
          if (url.includes('slot')) {
            console.log(`   Slots returned: ${data.slots?.length || 0}`);
          } else {
            console.log(`   Data:`, JSON.stringify(data).substring(0, 200));
          }
        }
      } catch (e) {}
    }
  });

  console.log('Loading widget...');
  await page.goto('https://widget.eversports.com/w/jmjffr');

  console.log('\n⏳ Waiting for page to load...');
  await page.waitForSelector('body', { timeout: 10000 });

  console.log('\n📝 INSTRUCTIONS:');
  console.log('1. In the browser, click on "Tennis" tab if not already selected');
  console.log('2. Navigate to June 23rd');
  console.log('3. Try to click on the 18:00 time slot for any court');
  console.log('4. Watch the console for API calls\n');
  console.log('Browser will stay open for 60 seconds...\n');

  await new Promise(resolve => setTimeout(resolve, 60000));

  console.log('\n=== All captured requests ===');
  requests.forEach(r => console.log(`${r.method} ${r.url}`));

  await browser.close();
}

captureBookingFlow().catch(console.error);
