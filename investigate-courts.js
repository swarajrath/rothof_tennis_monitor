// Check what court types we're actually getting
async function investigateCourts() {
  const facilityId = 23288;
  const sport = 'tennis';
  const date = '2026-06-23';
  const courtIds = [44656, 44657, 44658, 44920, 44921, 44922, 44644, 44645, 44646, 44647, 44643, 44648, 44649, 44650, 44651, 44652, 44653, 44654];

  const courtsParam = courtIds.map(id => `courts[]=${id}`).join('&');
  const url = `https://www.eversports.de/widget/api/slot?facilityId=${facilityId}&sport=${sport}&startDate=2026-06-22&${courtsParam}`;

  console.log('Fetching court data...\n');

  const response = await fetch(url);
  const data = await response.json();

  // Filter for June 23 at 20:00 (2000)
  const slots2000 = data.slots.filter(s => s.date === date && s.start === '2000');

  console.log(`Slots for ${date} at 20:00: ${slots2000.length} total\n`);

  // Count available vs booked
  const available = slots2000.filter(s => !s.booking);
  const booked = slots2000.filter(s => s.booking);

  console.log(`Available: ${available.length}`);
  console.log(`Booked: ${booked.length}\n`);

  // Show sample slots to see the structure
  console.log('Sample slot structure:');
  console.log(JSON.stringify(slots2000[0], null, 2));

  // List all courts at that time
  console.log('\n=== All courts at 20:00 on June 23rd ===');
  slots2000.forEach(s => {
    const status = s.booking ? '🔒 BOOKED' : '✅ AVAILABLE';
    console.log(`Court ${s.court}: ${status}`);
  });
}

investigateCourts();
