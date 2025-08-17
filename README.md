# German Diplomatic Service Waiting Time Monitor

A Chrome extension that monitors waiting times for German diplomatic service applications and displays them in the browser toolbar.

Precise Day Calculation: Shows exact remaining days in your waiting period
Portal Integration: Works seamlessly with the official German Diplomatic Service portal
Instant Access: Quick one-click access to waiting time information
User-Friendly Interface: Clean, simple display of remaining days
Secure: Only activates when logged into the official portal

Benefits:

Eliminates uncertainty about application timelines
Helps candidates plan their schedule more effectively
Reduces anxiety by providing clear, concrete information
No need to manually calculate waiting periods


Installation & Usage Instructions
Step 1: Load the Extension

Open your browser (Chrome, Firefox, or Edge)
Press F12 or right-click and select "Inspect Element" to open Developer Tools
Navigate to the Extensions tab in Developer Tools
Click "Load unpacked" or "Load temporary extension"
Select the Waiting Time Monitor extension folder
The extension should now appear in your browser's extension bar

Step 2: Access the Portal

Navigate to the German Diplomatic Service portal
Log in with your candidate credentials
Ensure you are fully logged in and can see your application dashboard

Step 3: Reload and Activate

Reload the portal page (press F5 or Ctrl+R)
Wait for the page to fully load
Look for the Waiting Time Monitor icon in your browser's extension bar
Click on the extension icon

Step 4: View Your Waiting Time

The extension will automatically calculate and display your exact remaining days
The information will appear in a clear, easy-to-read format
Numbers are updated in real-time based on your application status


Important Notes
Requirements:

Must be logged into the German Diplomatic Service portal
Extension needs to be loaded in each browser session (for unpacked extensions)
Internet connection required for real-time calculations

Troubleshooting:

Not showing days? Ensure you're logged in and reload the page
Extension not working? Reload the extension in Developer Tools
Incorrect information? Clear browser cache and try again
Portal updates? The extension may need updates if the portal changes

Privacy & Security:

Extension only accesses data when you're logged into the official portal
No personal information is stored or transmitted externally
All calculations are performed locally in your browser

Support:
If you encounter any issues or if the portal interface changes, the extension may need to be updated to maintain compatibility with the latest portal version.

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

