// Quick test to verify the API is working
async function testAPI() {
  const facilityId = 23288;
  const sport = 'tennis';
  const date = new Date().toISOString().split('T')[0];
  const courtIds = [44656, 44657, 44658, 44920, 44921, 44922, 44644, 44645, 44646, 44647, 44643, 44648, 44649, 44650, 44651, 44652, 44653, 44654];

  const courtsParam = courtIds.map(id => `courts[]=${id}`).join('&');
  const url = `https://www.eversports.de/widget/api/slot?facilityId=${facilityId}&sport=${sport}&startDate=${date}&${courtsParam}`;

  console.log('Testing Eversports API...');
  console.log(`URL: ${url}\n`);

  try {
    const response = await fetch(url);
    const data = await response.json();

    console.log(`✅ API Response received`);
    console.log(`   Total slots returned: ${data.slots?.length || 0}`);

    // Show availability summary
    const available = data.slots?.filter(s => !s.booking) || [];
    const booked = data.slots?.filter(s => s.booking) || [];

    console.log(`   Available slots: ${available.length}`);
    console.log(`   Booked slots: ${booked.length}`);

    // Show some examples
    console.log(`\n📅 Sample available slots for ${date}:`);
    const samples = available.slice(0, 5);
    samples.forEach(slot => {
      const time = `${slot.start.slice(0, 2)}:${slot.start.slice(2)}`;
      console.log(`   ${time} - Court ${slot.court}`);
    });

    if (samples.length === 0) {
      console.log('   (No available slots found in the data)');
    }

    // Show slots around 18:00 if available
    console.log(`\n🎯 Slots around 18:00:`);
    const evening = data.slots?.filter(s => s.start >= '1700' && s.start <= '1900') || [];
    evening.slice(0, 5).forEach(slot => {
      const time = `${slot.start.slice(0, 2)}:${slot.start.slice(2)}`;
      const status = slot.booking ? '❌ Booked' : '✅ Available';
      console.log(`   ${time} - Court ${slot.court} - ${status}`);
    });

    console.log('\n✅ API test successful!\n');
  } catch (error) {
    console.error('❌ API test failed:', error.message);
  }
}

testAPI();
