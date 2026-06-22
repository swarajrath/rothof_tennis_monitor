const fs = require('fs');
const path = require('path');
const RothofMonitor = require('./monitor-scraper');

// Read configuration from web interface
function loadConfig() {
  const configPath = path.join(__dirname, 'rothof-config.json');

  if (!fs.existsSync(configPath)) {
    console.error('❌ Configuration file not found!');
    console.log('\n📝 Please:');
    console.log('   1. Open web-interface/index.html in your browser');
    console.log('   2. Set your date, time, and court type');
    console.log('   3. Click "Save & Start Monitoring"');
    console.log('   4. Move the downloaded rothof-config.json to this folder');
    console.log('   5. Run this script again\n');
    process.exit(1);
  }

  try {
    const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    return config;
  } catch (error) {
    console.error('❌ Error reading config file:', error.message);
    process.exit(1);
  }
}

// Convert time format (HH:MM to HHMM)
function convertTime(timeStr) {
  return timeStr.replace(':', '');
}

// Start monitoring
function startMonitoring() {
  const config = loadConfig();

  console.log('📋 Configuration loaded:');
  console.log(`   Date: ${config.date}`);
  console.log(`   Time: ${config.time}`);
  console.log(`   Court Type: ${config.courtType}`);
  console.log(`   Saved: ${new Date(config.timestamp).toLocaleString()}\n`);

  const monitor = new RothofMonitor({
    targetDate: config.date,
    targetTimes: [convertTime(config.time)],
    courtFilter: config.courtType,
    checkIntervalMinutes: 5
  });

  monitor.start();

  // Graceful shutdown
  process.on('SIGINT', () => {
    console.log('\nShutting down...');
    monitor.stop();
    process.exit(0);
  });
}

startMonitoring();
