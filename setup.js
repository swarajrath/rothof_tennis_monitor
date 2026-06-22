#!/usr/bin/env node

const readline = require('readline');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function setup() {
  console.log('🎾 Rothof Monitor Setup\n');

  console.log('This wizard will help you configure email notifications.\n');

  // Check if .env already exists
  const envPath = path.join(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    const overwrite = await question('.env file already exists. Overwrite? (y/n): ');
    if (overwrite.toLowerCase() !== 'y') {
      console.log('Setup cancelled.');
      rl.close();
      return;
    }
  }

  // Email configuration
  console.log('\n📧 Email Configuration:');
  console.log('For Gmail: Enable 2FA and create an App Password at https://myaccount.google.com/apppasswords\n');

  const emailService = await question('Email service (gmail/outlook/yahoo) [gmail]: ') || 'gmail';
  const emailUser = await question('Your email address: ');
  const emailPassword = await question('Your email password (or App Password for Gmail): ');
  const notifyEmail = await question(`Notification recipient email [${emailUser}]: `) || emailUser;

  // Monitoring configuration
  console.log('\n⚙️  Monitoring Configuration:');
  const targetTimesInput = await question('Target times (comma-separated, e.g., 18:00,19:00,20:00) [18:00]: ') || '18:00';
  const targetTimes = targetTimesInput.split(',').map(t => t.trim().replace(':', ''));

  const checkInterval = await question('Check interval in minutes [5]: ') || '5';

  // Create .env file
  const envContent = `# Rothof Monitor Configuration
# Generated on ${new Date().toISOString()}

# Email Configuration
EMAIL_SERVICE=${emailService}
EMAIL_USER=${emailUser}
EMAIL_PASSWORD=${emailPassword}

# Notification recipient
NOTIFY_EMAIL=${notifyEmail}

# Monitoring settings (these are defaults, edit index.js to change)
# Check interval: ${checkInterval} minutes
# Target times: ${targetTimesInput}
`;

  fs.writeFileSync(envPath, envContent);

  // Update index.js with target times
  const indexPath = path.join(__dirname, 'index.js');
  let indexContent = fs.readFileSync(indexPath, 'utf-8');

  const targetTimesArray = targetTimes.map(t => `'${t}'`).join(', ');
  indexContent = indexContent.replace(
    /targetTimes: \[.*?\]/,
    `targetTimes: [${targetTimesArray}]`
  );
  indexContent = indexContent.replace(
    /checkIntervalMinutes: \d+/,
    `checkIntervalMinutes: ${checkInterval}`
  );

  fs.writeFileSync(indexPath, indexContent);

  console.log('\n✅ Configuration complete!');
  console.log('\n📋 Summary:');
  console.log(`   Email: ${emailUser}`);
  console.log(`   Notifications to: ${notifyEmail}`);
  console.log(`   Monitoring times: ${targetTimesInput}`);
  console.log(`   Check interval: ${checkInterval} minutes`);

  console.log('\n🚀 To start monitoring, run:');
  console.log('   npm start');

  console.log('\n💡 Tip: Run in background with:');
  console.log('   nohup npm start > monitor.log 2>&1 &\n');

  rl.close();
}

setup().catch(err => {
  console.error('Setup failed:', err.message);
  rl.close();
  process.exit(1);
});
