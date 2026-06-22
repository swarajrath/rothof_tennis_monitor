const puppeteer = require('puppeteer');

async function findNextButton() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto('https://widget.eversports.com/w/jmjffr', {
    waitUntil: 'networkidle2',
    timeout: 60000
  });

  await page.waitForSelector('td[data-date]', { timeout: 15000 });

  console.log('Browser open - look for the "next day" button');
  console.log('In the browser dev tools console, run:');
  console.log('  document.querySelector(".next-button-class")');
  console.log('\nKeeping browser open for 30 seconds...');

  // Try to find any button-like elements
  const buttons = await page.evaluate(() => {
    const btns = [];
    document.querySelectorAll('button, a, [role="button"], .btn').forEach(el => {
      const text = el.textContent?.trim() || '';
      const classes = el.className || '';
      if (text.includes('>') || text.includes('next') || classes.includes('next') || classes.includes('forward')) {
        btns.push({
          text: text.substring(0, 50),
          classes: classes,
          tag: el.tagName
        });
      }
    });
    return btns;
  });

  console.log('\nPotential next buttons found:');
  buttons.forEach((btn, i) => {
    console.log(`${i + 1}. <${btn.tag}> class="${btn.classes}" text="${btn.text}"`);
  });

  await new Promise(resolve => setTimeout(resolve, 30000));

  await browser.close();
}

findNextButton();
