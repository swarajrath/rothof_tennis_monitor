const puppeteer = require('puppeteer');

class RothofWebScraper {
  async scrapeAvailability(targetDate, targetTimes) {
    console.log(`🔍 Scraping Rothof for ${targetDate} at ${targetTimes.map(t => t.slice(0,2) + ':' + t.slice(2)).join(', ')}...`);

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto('https://widget.eversports.com/w/jmjffr', {
      waitUntil: 'networkidle2',
      timeout: 60000
    });

    await page.waitForSelector('td[data-date]', { timeout: 15000 });
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Navigate to target date
    const targetDay = targetDate.split('-')[2]; // "23" from "2026-06-23"

    // Click date picker
    await page.evaluate(() => {
      const inputs = document.querySelectorAll('input[type="text"], .date-picker, [data-toggle="datepicker"]');
      for (const input of inputs) {
        const value = input.value || input.textContent || '';
        if (value.includes('2026') || value.includes('/')) {
          input.click();
          return;
        }
      }
      // Fallback: click calendar icon
      const calIcon = document.querySelector('.fa-calendar, .calendar-icon');
      if (calIcon) calIcon.click();
    });

    await new Promise(resolve => setTimeout(resolve, 1500));

    // Click on the target day
    await page.evaluate((day) => {
      const elements = Array.from(document.querySelectorAll('td, div, span, a, button'));
      for (const el of elements) {
        const text = el.textContent?.trim();
        if (text === day && !el.classList.contains('disabled') && !el.classList.contains('old')) {
          el.click();
          break;
        }
      }
    }, targetDay);

    // IMPORTANT: Wait longer for data to load after date selection
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Extract data
    const availability = await page.evaluate((date, times) => {
      const results = [];
      const slots = document.querySelectorAll(`td[data-date="${date}"]`);

      slots.forEach(slot => {
        const time = slot.getAttribute('data-start');
        const court = slot.getAttribute('data-court');
        const state = slot.getAttribute('data-state');
        const title = slot.getAttribute('data-original-title') || '';

        if (times.includes(time)) {
          results.push({
            court: `Court ${court}`,
            courtId: court,
            date,
            time,
            available: state === 'free',
            state,
            title
          });
        }
      });

      return results;
    }, targetDate, targetTimes);

    await browser.close();

    return availability;
  }

  async checkSpecificDateTime(date, time) {
    const availability = await this.scrapeAvailability(date, [time]);

    const available = availability.filter(s => s.available);
    const booked = availability.filter(s => !s.available);

    return {
      date,
      time,
      totalCourts: availability.length,
      available: available.length,
      booked: booked.length,
      availableCourts: available,
      bookedCourts: booked
    };
  }
}

// Test
async function test() {
  const scraper = new RothofWebScraper();

  console.log('\n📅 Testing for June 23, 2026 at 18:00...\n');

  const result = await scraper.checkSpecificDateTime('2026-06-23', '1800');

  console.log(`\n✅ RESULTS:`);
  console.log(`   Date: ${result.date}`);
  console.log(`   Time: 18:00`);
  console.log(`   Total courts: ${result.totalCourts}`);
  console.log(`   Available: ${result.available}`);
  console.log(`   Booked: ${result.booked}`);

  if (result.available > 0) {
    console.log(`\n✅ Available courts:`);
    result.availableCourts.forEach(c => console.log(`   ${c.court}`));
  }

  console.log(`\n🎯 Expected: 2 available (from website)`);
  console.log(`🎯 Got: ${result.available} available`);

  if (result.available === 2) {
    console.log(`\n🎉 SUCCESS! Scraper is working correctly!`);
  } else {
    console.log(`\n⚠️  Mismatch - please verify manually`);
  }
}

test().catch(console.error);

module.exports = RothofWebScraper;
