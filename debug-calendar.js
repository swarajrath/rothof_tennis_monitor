const puppeteer = require('puppeteer');

async function debugCalendar() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // Capture console messages from the page
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));

  await page.goto('https://widget.eversports.com/w/jmjffr', {
    waitUntil: 'networkidle2',
    timeout: 60000
  });

  console.log('Waiting for calendar...');
  await page.waitForSelector('td[data-date]', { timeout: 15000 });
  await new Promise(resolve => setTimeout(resolve, 3000));

  console.log('Extracting debug info...\n');

  const debug = await page.evaluate(() => {
    const dates = new Set();
    const times = new Set();
    const courts = new Set();
    const states = new Set();

    document.querySelectorAll('td[data-date]').forEach(el => {
      dates.add(el.getAttribute('data-date'));
      times.add(el.getAttribute('data-start'));
      courts.add(el.getAttribute('data-court'));
      states.add(el.getAttribute('data-state'));
    });

    // Get a sample slot
    const sample = document.querySelector('td[data-date]');
    const sampleData = sample ? {
      date: sample.getAttribute('data-date'),
      start: sample.getAttribute('data-start'),
      court: sample.getAttribute('data-court'),
      state: sample.getAttribute('data-state'),
      title: sample.getAttribute('data-original-title')
    } : null;

    return {
      dates: Array.from(dates).sort(),
      times: Array.from(times).sort(),
      courts: Array.from(courts).sort(),
      states: Array.from(states),
      totalSlots: document.querySelectorAll('td[data-date]').length,
      sample: sampleData
    };
  });

  console.log('Debug Info:');
  console.log('  Total slots found:', debug.totalSlots);
  console.log('  Dates:', debug.dates);
  console.log('  Times:', debug.times);
  console.log('  Courts:', debug.courts);
  console.log('  States:', debug.states);
  console.log('\nSample slot:', JSON.stringify(debug.sample, null, 2));

  await browser.close();
}

debugCalendar();
