// Check availability for a specific date and time
async function checkSpecificDate() {
  const facilityId = 23288;
  const sport = 'tennis';
  const targetDate = '2026-06-23';  // Change this
  const targetTime = '1800';         // 18:00

  const courtIds = [44656, 44657, 44658, 44920, 44921, 44922, 44644, 44645, 44646, 44647, 44643, 44648, 44649, 44650, 44651, 44652, 44653, 44654];

  const courtsParam = courtIds.map(id => `courts[]=${id}`).join('&');
  const url = `https://www.eversports.de/widget/api/slot?facilityId=${facilityId}&sport=${sport}&startDate=2026-06-22&${courtsParam}`;

  console.log(`🎾 Checking Rothof München - ${targetDate} at ${targetTime.slice(0,2)}:${targetTime.slice(2)}\n`);

  const response = await fetch(url);
  const data = await response.json();

  // Filter for specific date and time
  const targetSlots = data.slots.filter(s =>
    s.date === targetDate &&
    s.start === targetTime &&
    !s.booking
  );

  if (targetSlots.length === 0) {
    console.log('❌ No courts available at this time');
  } else {
    console.log(`✅ ${targetSlots.length} court(s) available:\n`);
    targetSlots.forEach(slot => {
      console.log(`   Court ${slot.court}`);
    });
  }

  // Also show booked courts
  const bookedSlots = data.slots.filter(s =>
    s.date === targetDate &&
    s.start === targetTime &&
    s.booking
  );

  if (bookedSlots.length > 0) {
    console.log(`\n🔒 ${bookedSlots.length} court(s) already booked`);
  }
}

checkSpecificDate();
