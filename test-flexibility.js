const RothofWebScraper = require('./web-scraper');

async function testDifferentDateTime() {
  const scraper = new RothofWebScraper();

  console.log('Testing scraper flexibility...\n');

  // Test 1: June 24 at 19:00
  console.log('📅 Test 1: June 24, 2026 at 19:00');
  const result1 = await scraper.checkSpecificDateTime('2026-06-24', '1900');

  console.log(`   Total courts: ${result1.totalCourts}`);
  console.log(`   Available: ${result1.available} ✅`);
  console.log(`   Booked: ${result1.booked} 🔒`);

  if (result1.available > 0) {
    console.log(`   Available courts:`);
    result1.availableCourts.slice(0, 5).forEach(c => console.log(`      ${c.court}`));
    if (result1.available > 5) console.log(`      ... and ${result1.available - 5} more`);
  }

  // Test 2: June 25 at 18:00
  console.log('\n📅 Test 2: June 25, 2026 at 18:00');
  const result2 = await scraper.checkSpecificDateTime('2026-06-25', '1800');

  console.log(`   Total courts: ${result2.totalCourts}`);
  console.log(`   Available: ${result2.available} ✅`);
  console.log(`   Booked: ${result2.booked} 🔒`);

  // Test 3: Multiple times in one day
  console.log('\n📅 Test 3: June 23, 2026 at 18:00 AND 19:00');
  const result3 = await scraper.scrapeAvailability('2026-06-23', ['1800', '1900']);

  const available18 = result3.filter(s => s.time === '1800' && s.available);
  const available19 = result3.filter(s => s.time === '1900' && s.available);

  console.log(`   At 18:00: ${available18.length} available`);
  console.log(`   At 19:00: ${available19.length} available`);

  console.log('\n✅ All tests complete!');
}

testDifferentDateTime().catch(console.error);
