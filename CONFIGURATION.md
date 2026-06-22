# Rothof Monitor - Configuration Examples

## Monitor a Specific Date and Time

Edit `index-scraper.js` and change the configuration:

### Example 1: Monitor June 24 at 19:00
```javascript
const monitor = new RothofMonitor({
  targetDate: '2026-06-24',          // June 24
  targetTimes: ['1900'],              // 19:00 (7pm)
  checkIntervalMinutes: 5
});
```

### Example 2: Monitor June 25 at 18:00
```javascript
const monitor = new RothofMonitor({
  targetDate: '2026-06-25',          // June 25
  targetTimes: ['1800'],              // 18:00 (6pm)
  checkIntervalMinutes: 5
});
```

### Example 3: Monitor Multiple Times on Same Day
```javascript
const monitor = new RothofMonitor({
  targetDate: '2026-06-23',
  targetTimes: ['1800', '1900', '2000'],  // 6pm, 7pm, 8pm
  checkIntervalMinutes: 5
});
```

### Example 4: Check More Frequently
```javascript
const monitor = new RothofMonitor({
  targetDate: '2026-06-24',
  targetTimes: ['1900'],
  checkIntervalMinutes: 2              // Check every 2 minutes
});
```

## Run the Monitor

```bash
cd ~/rothof-monitor
node index-scraper.js
```

## Current Test Results

From `test-flexibility.js`:

| Date | Time | Available Courts |
|------|------|------------------|
| June 23 | 18:00 | 2 courts (44656, 44658) |
| June 23 | 19:00 | 1 court |
| June 24 | 19:00 | 2 courts (44921, 44922) |
| June 25 | 18:00 | 1 court |

## Notes

- The scraper navigates to the specific date using the calendar date picker
- Works for any date within the next ~7 days (Eversports booking window)
- Each check takes ~10-15 seconds (launches headless browser)
- Only sends email when a court becomes **newly** available (not on first run)

## Quick Check Script

To manually check availability without setting up monitoring:

```bash
node test-flexibility.js
```

This will show availability for multiple dates/times.
