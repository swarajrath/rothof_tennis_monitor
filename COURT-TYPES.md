# Court Type Filtering

## Court Types at Rothof

### 🏢 Halle (Indoor Courts) - 6 courts
- Platz 1 (Halle) - ID: 44656
- Platz 2 (Halle) - ID: 44657
- Platz 3 (Halle) - ID: 44658
- Platz 4 (Halle) - ID: 44920
- Platz 5 (Halle) - ID: 44921
- Platz 6 (Halle) - ID: 44922

### 🌤️  Freiplatz (Outdoor Courts) - 12 courts
- Platz 7 (Freiplatz) - ID: 44644
- Platz 8 (Freiplatz) - ID: 44645
- Platz 9 (Freiplatz) - ID: 44646
- Platz 10 (Freiplatz) - ID: 44647
- Platz 11 (Freiplatz) - ID: 44643
- Platz 12 (Freiplatz) - ID: 44648
- Platz 13 (Freiplatz) - ID: 44649
- Platz 14 (Freiplatz) - ID: 44650
- Platz 15 (Freiplatz) - ID: 44651
- Platz 16 (Freiplatz) - ID: 44652
- Platz 17 (Freiplatz) - ID: 44653
- Platz 18 (Freiplatz) - ID: 44654

## How to Filter

Edit `index-scraper.js` and set the `courtFilter` option:

### Example 1: Monitor Freiplatz (Outdoor) Only
```javascript
const monitor = new RothofMonitor({
  targetDate: '2026-06-23',
  targetTimes: ['1800'],
  courtFilter: 'freiplatz',        // 🌤️  Outdoor courts only
  checkIntervalMinutes: 5
});
```

### Example 2: Monitor Halle (Indoor) Only
```javascript
const monitor = new RothofMonitor({
  targetDate: '2026-06-23',
  targetTimes: ['1800'],
  courtFilter: 'halle',            // 🏢 Indoor courts only
  checkIntervalMinutes: 5
});
```

### Example 3: Monitor All Courts
```javascript
const monitor = new RothofMonitor({
  targetDate: '2026-06-23',
  targetTimes: ['1800'],
  courtFilter: 'all',              // 🎾 All courts (default)
  checkIntervalMinutes: 5
});
```

## Test Results

For **June 23 at 18:00**:
- **Total available**: 2 courts
- **Halle available**: 2 courts (44656, 44658)
- **Freiplatz available**: 0 courts

With `courtFilter: 'freiplatz'`, you will NOT receive notifications for June 23 at 18:00 since no outdoor courts are available.

## Testing

To see what courts are available with filters:

```bash
node test-freiplatz-filter.js
```

This shows breakdown by court type for June 23 at 18:00.
