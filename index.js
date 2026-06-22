const RothofMonitor = require('./monitor');

// Configuration
const monitor = new RothofMonitor({
  checkIntervalMinutes: 5,           // Check every 5 minutes
  targetTimes: ['1800', '1900', '2000'], // 6pm, 7pm, 8pm
  daysAhead: 7                       // Check next 7 days
});

// Start monitoring
monitor.start();

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down...');
  monitor.stop();
  process.exit(0);
});
