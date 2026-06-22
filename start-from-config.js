const fs = require('fs');
const path = require('path');
const RothofMonitor = require('./monitor-scraper');

// Read configuration from web interface OR environment variables
function loadConfig() {
  // Option 1: Try environment variables (for cloud deployment)
  if (process.env.MONITOR_DATE && process.env.MONITOR_TIME) {
    console.log('📡 Using configuration from environment variables\n');
    return {
      date: process.env.MONITOR_DATE,
      time: process.env.MONITOR_TIME,
      courtType: process.env.MONITOR_COURT_TYPE || 'freiplatz',
      timestamp: new Date().toISOString()
    };
  }

  // Option 2: Try config file (for local deployment)
  const configPath = path.join(__dirname, 'rothof-config.json');

  if (!fs.existsSync(configPath)) {
    console.error('❌ Configuration not found!');
    console.log('\n📝 Please either:');
    console.log('   A) Set environment variables:');
    console.log('      - MONITOR_DATE=2026-06-24');
    console.log('      - MONITOR_TIME=19:00');
    console.log('      - MONITOR_COURT_TYPE=freiplatz');
    console.log('\n   B) Create rothof-config.json:');
    console.log('      1. Open web-interface/index.html in your browser');
    console.log('      2. Set your date, time, and court type');
    console.log('      3. Click "Save & Start Monitoring"');
    console.log('      4. Move the downloaded rothof-config.json to this folder\n');
    process.exit(1);
  }

  try {
    console.log('📄 Using configuration from rothof-config.json\n');
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
