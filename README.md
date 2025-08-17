# German Diplomatic Service Waiting Time Monitor

A Chrome extension that monitors waiting times for German diplomatic service applications and displays them in the browser toolbar.

## Features

- **Automatic Detection**: Automatically detects when you visit your application page on app.digital.diplo.de
- **Real-time Monitoring**: Intercepts API calls to extract waiting time data from the network tab
- **Toolbar Display**: Shows waiting time in weeks directly in the browser toolbar badge
- **Detailed Popup**: Click the extension icon to see detailed information including:
  - Exact waiting time in weeks
  - Waiting list status (active/inactive)
  - Last update time
  - Quick refresh and navigation options
- **Auto-refresh**: Automatically refreshes data every 5 minutes
- **Persistent Storage**: Remembers your data between browser sessions

## Installation

1. Download the extension files
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the extension folder
5. The extension icon should appear in your toolbar

## Usage

1. Visit your application page on https://app.digital.diplo.de/myapplications/[your-application-id]
2. The extension will automatically detect and extract waiting time data
3. The waiting time will be displayed as a badge on the extension icon (e.g., "7w" for 7 weeks)
4. Click the extension icon to see detailed information
5. Use the "Refresh Now" button to manually update the data
6. Use the "Open Page" button to quickly navigate to your application page

## How It Works

The extension uses multiple techniques to capture waiting time data:

1. **Network Request Monitoring**: Listens for API calls to the `/limits` endpoint
2. **Content Script Injection**: Injects scripts into the diplomatic service website
3. **Fetch Interception**: Intercepts fetch requests to capture response data
4. **Automatic Refresh**: Periodically checks for updated data

## Data Privacy

- All data is stored locally in your browser
- No data is sent to external servers
- The extension only works on app.digital.diplo.de
- Uses your existing browser session and authentication

## Troubleshooting

**No data showing?**
- Make sure you're logged into app.digital.diplo.de
- Visit your specific application page (not just the main page)
- Try clicking "Refresh Now" in the popup
- Check that the extension has permission to access the website

**Data not updating?**
- The extension refreshes automatically every 5 minutes
- You can manually refresh using the "Refresh Now" button
- Try reloading the application page in your browser

**Extension not working?**
- Make sure you're on the correct website (app.digital.diplo.de)
- Check that the extension is enabled in chrome://extensions/
- Try disabling and re-enabling the extension

## Technical Details

- **Manifest Version**: 3 (latest Chrome extension standard)
- **Permissions**: activeTab, storage, webRequest, tabs
- **Host Permissions**: https://app.digital.diplo.de/*
- **Architecture**: Background service worker + Content scripts + Popup interface

## Files Structure

```
chrome_extension/
├── manifest.json          # Extension configuration
├── background.js          # Background service worker
├── content.js            # Content script for page interaction
├── injected.js           # Script injected into page context
├── popup.html            # Popup interface HTML
├── popup.js              # Popup interface JavaScript
├── icon16.png            # 16x16 icon
├── icon48.png            # 48x48 icon
├── icon128.png           # 128x128 icon
└── README.md             # This file
```

## Version History

- **v1.0**: Initial release with basic waiting time monitoring and display features

