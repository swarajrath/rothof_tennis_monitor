const RothofWebScraper = require('./web-scraper');

async function testFreiplatzFilter() {
  const scraper = new RothofWebScraper();

  console.log('Testing Freiplatz filter for June 23 at 18:00...\n');

  const result = await scraper.checkSpecificDateTime('2026-06-23', '1800');

  // Court type definitions
  const freiplatzIds = [44644, 44645, 44646, 44647, 44643, 44648, 44649, 44650, 44651, 44652, 44653, 44654];
  const halleIds = [44656, 44657, 44658, 44920, 44921, 44922];

  // Filter results
  const allAvailable = result.availableCourts;
  const freiplatzAvailable = allAvailable.filter(c => freiplatzIds.includes(parseInt(c.courtId)));
  const halleAvailable = allAvailable.filter(c => halleIds.includes(parseInt(c.courtId)));

  console.log('📊 All Courts:');
  console.log(`   Total available: ${result.available}`);
  allAvailable.forEach(c => console.log(`      ${c.court} (ID: ${c.courtId})`));

  console.log('\n🌤️  Freiplatz (Outdoor) Only:');
  console.log(`   Available: ${freiplatzAvailable.length}`);
  freiplatzAvailable.forEach(c => console.log(`      ${c.court}`));

  console.log('\n🏢 Halle (Indoor) Only:');
  console.log(`   Available: ${halleAvailable.length}`);
  halleAvailable.forEach(c => console.log(`      ${c.court}`));

  console.log(`\n✅ With 'freiplatz' filter, you would only be notified about ${freiplatzAvailable.length} court(s)`);
}

testFreiplatzFilter();
