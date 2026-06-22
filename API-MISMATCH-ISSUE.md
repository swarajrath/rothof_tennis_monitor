# Status: API Data Mismatch Issue

## Problem

The Eversports public API endpoint returns **incorrect/stale booking data**:
- **API says**: 16 courts available on June 23 at 18:00
- **Website shows**: Only 2 courts actually available

## Root Cause

The `/widget/api/slot` endpoint we're using doesn't reflect real-time bookings. The actual Eversports widget likely uses:
1. An authenticated/private API endpoint
2. Additional booking validation logic
3. Real-time WebSocket updates

## Attempted Solutions

❌ Using public `/api/slot` endpoint - returns wrong data
❌ Capturing widget network requests - same endpoint, same wrong data  
⏳ HTML scraping - complex and fragile

## Recommended Solutions

### Option 1: Change Detection (Easiest)
Monitor for **ANY change** in the API response, then send you a link to check manually:
- Detects when booking count changes
- You manually verify which courts are actually free
- Simpler and more reliable than trying to parse exact availability

### Option 2: Visual Scraping (Complex)
Use Puppeteer to:
- Load the actual widget
- Parse the visual calendar HTML/CSS
- Extract real availability from DOM
- Much slower (~10-15 seconds per check vs <1 second for API)
- Fragile (breaks if Ever sports changes their HTML)

### Option 3: Browser Extension (Most Accurate)
Build a Chrome extension that:
- Runs in your actual browser while you're browsing
- Monitors the real authenticated session
- Gets 100% accurate data
- Requires running Chrome constantly

## My Recommendation

**Go with Option 1**: Notify on ANY change, let you manually verify.

The monitor would:
1. Track the API response hash/count
2. When it changes → send email with link to booking page
3. You click through and book if actually available

This accepts that we can't get perfect data, but still alerts you to potential openings.

Want me to implement this approach?
