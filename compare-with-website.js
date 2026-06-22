// Compare API data with what's actually shown on the website
async function compareWithWebsite() {
  const facilityId = 23288;
  const sport = 'tennis';
  const date = '2026-06-23';
  const time = '1800';

  const courtIds = [44656, 44657, 44658, 44920, 44921, 44922, 44644, 44645, 44646, 44647, 44643, 44648, 44649, 44650, 44651, 44652, 44653, 44654];

  const courtsParam = courtIds.map(id => `courts[]=${id}`).join('&');
  const url = `https://www.eversports.de/widget/api/slot?facilityId=${facilityId}&sport=${sport}&startDate=2026-06-22&${courtsParam}`;

  const response = await fetch(url);
  const data = await response.json();

  // Filter for June 23 at 18:00
  const slots = data.slots.filter(s => s.date === date && s.start === time);

  console.log(`API says: ${slots.length} total slots for June 23 at 18:00\n`);

  // Count available vs booked
  const available = slots.filter(s => !s.booking);
  const booked = slots.filter(s => s.booking);

  console.log(`According to API:`);
  console.log(`  Available: ${available.length}`);
  console.log(`  Booked: ${booked.length}\n`);

  console.log(`According to website screenshot:`);
  console.log(`  Available: 2 courts (Platz 3 Halle, Platz 8 Freiplatz)`);
  console.log(`  Booked: ~16 courts\n`);

  console.log(`❌ MISMATCH: API shows ${available.length} available, website shows 2 available\n`);

  console.log(`This means:`);
  console.log(`  1. The API data might be cached/stale`);
  console.log(`  2. The court IDs might include non-bookable courts`);
  console.log(`  3. The widget uses different logic to determine availability\n`);

  // Let's check if there's additional data in the slot objects
  console.log('Sample available slot from API:');
  if (available.length > 0) {
    console.log(JSON.stringify(available[0], null, 2));
  }

  console.log('\nSample booked slot from API:');
  if (booked.length > 0) {
    console.log(JSON.stringify(booked[0], null, 2));
  }
}

compareWithWebsite();
