const RothofMonitor = require('./monitor-scraper');

// Configuration for June 23rd monitoring
const monitor = new RothofMonitor({
  targetDate: '2026-06-23',          // Specific date to monitor
  targetTimes: ['1800'],              // 18:00
  checkIntervalMinutes: 5             // Check every 5 minutes
});

// Start monitoring
monitor.start();

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down...');
  monitor.stop();
  process.exit(0);
});
