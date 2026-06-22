const puppeteer = require('puppeteer');

async function checkVisual() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 2000 });

  await page.goto('https://widget.eversports.com/w/jmjffr', {
    waitUntil: 'networkidle2',
    timeout: 60000
  });

  await page.waitForSelector('td[data-date]', { timeout: 15000 });
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Navigate to June 23
  await page.evaluate(() => {
    const inputs = document.querySelectorAll('input');
    for (const input of inputs) {
      if (input.value?.includes('2026')) {
        input.click();
        break;
      }
    }
  });

  await new Promise(resolve => setTimeout(resolve, 1500));

  await page.evaluate(() => {
    const elements = Array.from(document.querySelectorAll('td, div, span'));
    for (const el of elements) {
      if (el.textContent?.trim() === '23') {
        el.click();
        break;
      }
    }
  });

  await new Promise(resolve => setTimeout(resolve, 3000));

  // Take screenshot
  await page.screenshot({ path: 'calendar-screenshot.png', fullPage: false });
  console.log('Screenshot saved to calendar-screenshot.png');

  await browser.close();
}

checkVisual();
