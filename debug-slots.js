// Debug script to see what data we're actually getting
async function debug() {
  const facilityId = 23288;
  const sport = 'tennis';
  const date = new Date().toISOString().split('T')[0];
  const courtIds = [44656, 44657, 44658, 44920, 44921, 44922, 44644, 44645, 44646, 44647, 44643, 44648, 44649, 44650, 44651, 44652, 44653, 44654];

  const courtsParam = courtIds.map(id => `courts[]=${id}`).join('&');
  const url = `https://www.eversports.de/widget/api/slot?facilityId=${facilityId}&sport=${sport}&startDate=${date}&${courtsParam}`;

  console.log('Fetching:', url, '\n');

  const response = await fetch(url);
  const data = await response.json();

  console.log(`Total slots returned: ${data.slots.length}\n`);

  // Check what times we're getting
  const times = new Set();
  data.slots.forEach(s => times.add(s.start));
  console.log('All time slots in data:', Array.from(times).sort().join(', '), '\n');

  // Filter for 18:00 and 19:00
  const targetSlots = data.slots.filter(s => ['1800', '1900'].includes(s.start));
  console.log(`Slots at 18:00 or 19:00: ${targetSlots.length}`);

  // Show first 10
  console.log('\nFirst 10 slots at target times:');
  targetSlots.slice(0, 10).forEach(s => {
    console.log(`  ${s.date} ${s.start} Court ${s.court} - ${s.booking ? 'BOOKED' : 'AVAILABLE'}`);
  });

  // Count by time
  const at1800 = targetSlots.filter(s => s.start === '1800');
  const at1900 = targetSlots.filter(s => s.start === '1900');
  console.log(`\nAt 18:00: ${at1800.length} slots (${at1800.filter(s => !s.booking).length} available)`);
  console.log(`At 19:00: ${at1900.length} slots (${at1900.filter(s => !s.booking).length} available)`);

  // Check if we're getting multiple days
  const dates = new Set();
  targetSlots.forEach(s => dates.add(s.date));
  console.log(`\nDates in response: ${Array.from(dates).sort().join(', ')}`);
  console.log(`Number of unique dates: ${dates.size}`);
}

debug();
