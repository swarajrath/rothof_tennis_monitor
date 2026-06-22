const RothofMonitor = require('./monitor');

// Configuration
const monitor = new RothofMonitor({
  checkIntervalMinutes: 4,           // Check every 4 minutes
  targetTimes: ['1800', '1900'],     // 6pm, 7pm
  targetDates: ['2026-06-23'],       // OPTIONAL: Only monitor these specific dates (leave empty for all 7 days)
  daysAhead: 7                       // Check next 7 days (ignored if targetDates is set)
});

// Start monitoring
monitor.start();

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down...');
  monitor.stop();
  process.exit(0);
});
