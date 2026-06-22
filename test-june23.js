const puppeteer = require('puppeteer');

async function scrapeJune23() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto('https://widget.eversports.com/w/jmjffr', {
    waitUntil: 'networkidle2',
    timeout: 60000
  });

  console.log('Waiting for calendar...');
  await page.waitForSelector('td[data-date]', { timeout: 15000 });
  await new Promise(resolve => setTimeout(resolve, 3000));

  // The calendar shows a week view, so June 23 might already be visible
  // Let's check all dates currently visible
  const allData = await page.evaluate(() => {
    const results = [];
    const slots = document.querySelectorAll('td[data-date]');

    slots.forEach(slot => {
      const date = slot.getAttribute('data-date');
      const time = slot.getAttribute('data-start');
      const court = slot.getAttribute('data-court');
      const state = slot.getAttribute('data-state');

      results.push({ date, time, court, state });
    });

    return results;
  });

  await browser.close();

  // Filter for June 23 at 18:00
  const june23_18 = allData.filter(s => s.date === '2026-06-23' && s.time === '1800');

  console.log(`\nTotal slots for June 23 at 18:00: ${june23_18.length}`);

  const available = june23_18.filter(s => s.state === 'free');
  const booked = june23_18.filter(s => s.state === 'booked');

  console.log(`Available: ${available.length}`);
  console.log(`Booked: ${booked.length}`);

  console.log('\n✅ Available courts:');
  available.forEach(s => console.log(`   Court ${s.court}`));

  console.log('\n🔒 Booked courts:');
  booked.forEach(s => console.log(`   Court ${s.court}`));

  console.log(`\n🎯 Expected: 2 available`);
  console.log(`🎯 Got: ${available.length} available`);
  console.log(available.length === 2 ? '✅ MATCH!' : `❌ MISMATCH (difference: ${Math.abs(available.length - 2)})`);
}

scrapeJune23();
