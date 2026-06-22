const puppeteer = require('puppeteer');

async function identifyCourtTypes() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto('https://widget.eversports.com/w/jmjffr', {
    waitUntil: 'networkidle2',
    timeout: 60000
  });

  await page.waitForSelector('td[data-date]', { timeout: 15000 });
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Extract court names and IDs
  const courts = await page.evaluate(() => {
    const results = [];

    // Find all court rows - they have court names on the left
    const rows = document.querySelectorAll('tr');

    rows.forEach(row => {
      // Look for court name in the row
      const nameCell = row.querySelector('td, th');
      const courtName = nameCell?.textContent?.trim();

      // Look for slots in this row to get court ID
      const slot = row.querySelector('td[data-court]');
      const courtId = slot?.getAttribute('data-court');

      if (courtName && courtId && (courtName.includes('Platz') || courtName.includes('Halle') || courtName.includes('Freiplatz'))) {
        results.push({
          id: courtId,
          name: courtName,
          isFreiplatz: courtName.includes('Freiplatz'),
          isHalle: courtName.includes('Halle')
        });
      }
    });

    return results;
  });

  await browser.close();

  console.log('Court Types:\n');

  const halle = courts.filter(c => c.isHalle);
  const freiplatz = courts.filter(c => c.isFreiplatz);

  console.log('🏢 Halle (Indoor) Courts:');
  halle.forEach(c => console.log(`   ${c.name} - ID: ${c.id}`));

  console.log('\n🌤️  Freiplatz (Outdoor) Courts:');
  freiplatz.forEach(c => console.log(`   ${c.name} - ID: ${c.id}`));

  console.log('\n📋 Court IDs for filtering:');
  console.log(`   Halle IDs: [${halle.map(c => c.id).join(', ')}]`);
  console.log(`   Freiplatz IDs: [${freiplatz.map(c => c.id).join(', ')}]`);
}

identifyCourtTypes();
