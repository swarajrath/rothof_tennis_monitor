const puppeteer = require('puppeteer');

// Scrape ACTUAL availability from the visual calendar
async function scrapeRealAvailability(targetDate, targetTime) {
  console.log(`🔍 Scraping real availability for ${targetDate} at ${targetTime}...\n`);

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto('https://widget.eversports.com/w/jmjffr', {
    waitUntil: 'networkidle2',
    timeout: 60000
  });

  // Wait for calendar to load
  await new Promise(resolve => setTimeout(resolve, 5000));

  // Get the actual HTML and parse it
  const calendarData = await page.evaluate((date, time) => {
    // This will need to be customized based on the actual HTML structure
    // For now, return a placeholder
    return {
      success: false,
      message: 'Need to inspect actual HTML structure first'
    };
  }, targetDate, targetTime);

  // For now, let's just get the page HTML to inspect
  const html = await page.content();

  await browser.close();

  // Save HTML for inspection
  return { html, calendarData };
}

async function main() {
  const result = await scrapeRealAvailability('2026-06-23', '18:00');
  console.log('\nCalendar data:', result.calendarData);
  console.log('\nHTML length:', result.html.length);
  console.log('\nSaving HTML to inspect-calendar.html for manual inspection...');

  const fs = require('fs');
  fs.writeFileSync('inspect-calendar.html', result.html);
  console.log('✅ Saved!  Open inspect-calendar.html in a browser to see the structure');
}

main();
