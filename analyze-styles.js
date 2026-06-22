const puppeteer = require('puppeteer');

async function analyzeStyles() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

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
      if (input.value?.includes('2026')) input.click();
    }
  });
  await new Promise(resolve => setTimeout(resolve, 1500));
  await page.evaluate(() => {
    Array.from(document.querySelectorAll('td, div, span')).find(el => el.textContent?.trim() === '23')?.click();
  });
  await new Promise(resolve => setTimeout(resolve, 3000));

  //Extract styling info for June 23 at 18:00
  const styles = await page.evaluate(() => {
    const results = [];
    const slots = document.querySelectorAll('td[data-date="2026-06-23"][data-start="1800"]');

    slots.forEach(slot => {
      const court = slot.getAttribute('data-court');
      const state = slot.getAttribute('data-state');
      const computedStyle = window.getComputedStyle(slot);
      const classes = slot.className;
      const bgColor = computedStyle.backgroundColor;
      const opacity = computedStyle.opacity;
      const display = computedStyle.display;
      const hasPrice = slot.textContent.includes('€');

      results.push({
        court,
        state,
        classes,
        bgColor,
        opacity,
        display,
        hasPrice,
        text: slot.textContent.trim().substring(0, 20)
      });
    });

    return results;
  });

  await browser.close();

  console.log('Styles for June 23 at 18:00:\n');
  styles.forEach((s, i) => {
    console.log(`${i+1}. Court ${s.court}:`);
    console.log(`   State: ${s.state}`);
    console.log(`   BG Color: ${s.bgColor}`);
    console.log(`   Opacity: ${s.opacity}`);
    console.log(`   Has Price: ${s.hasPrice}`);
    console.log(`   Classes: ${s.classes}`);
    console.log(`   Text: ${s.text}`);
    console.log('');
  });
}

analyzeStyles();
