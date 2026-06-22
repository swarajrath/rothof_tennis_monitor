const puppeteer = require('puppeteer');

async function navigateToDate() {
  const browser = await puppeteer.launch({ headless: false, slowMo: 100 });
  const page = await browser.newPage();

  await page.goto('https://widget.eversports.com/w/jmjffr', {
    waitUntil: 'networkidle2',
    timeout: 60000
  });

  console.log('Waiting for calendar...');
  await page.waitForSelector('td[data-date]', { timeout: 15000 });
  await new Promise(resolve => setTimeout(resolve, 2000));

  console.log('Looking for date picker...');

  // Try to find and click the date input field (showing 23/06/2026 in your screenshot)
  const dateInputClicked = await page.evaluate(() => {
    // Look for input with date value or date picker trigger
    const inputs = document.querySelectorAll('input[type="text"], input[placeholder*="date"], .date-picker, [data-toggle="datepicker"]');

    for (const input of inputs) {
      const value = input.value || input.textContent || '';
      if (value.includes('2026') || value.includes('/')) {
        input.click();
        return true;
      }
    }

    // Try clicking any calendar icon
    const calIcon = document.querySelector('.fa-calendar, .calendar-icon, [class*="calendar"]');
    if (calIcon) {
      calIcon.click();
      return true;
    }

    return false;
  });

  console.log(`Date picker clicked: ${dateInputClicked}`);

  await new Promise(resolve => setTimeout(resolve, 2000));

  // Now try to click on day 23 in the date picker
  const day23Clicked = await page.evaluate(() => {
    // Look for elements showing "23"
    const elements = Array.from(document.querySelectorAll('td, div, span, a, button'));

    for (const el of elements) {
      const text = el.textContent?.trim();
      if (text === '23' && !el.classList.contains('disabled')) {
        el.click();
        return true;
      }
    }

    return false;
  });

  console.log(`Day 23 clicked: ${day23Clicked}`);

  await new Promise(resolve => setTimeout(resolve, 3000));

  // Check what date we're now showing
  const currentDates = await page.evaluate(() => {
    const dates = new Set();
    document.querySelectorAll('td[data-date]').forEach(el => {
      dates.add(el.getAttribute('data-date'));
    });
    return Array.from(dates).sort();
  });

  console.log('Dates now visible:', currentDates);

  console.log('\nBrowser will stay open for 20 seconds so you can see...');
  await new Promise(resolve => setTimeout(resolve, 20000));

  await browser.close();
}

navigateToDate();
