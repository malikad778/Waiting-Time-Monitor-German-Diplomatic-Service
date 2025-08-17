// Content script for intercepting network requests and extracting waiting time data

console.log('German Diplomatic Service Waiting Time Monitor content script loaded');

// Inject script to intercept fetch requests
const script = document.createElement('script');
script.src = chrome.runtime.getURL('injected.js');
script.onload = function() {
  this.remove();
};
(document.head || document.documentElement).appendChild(script);

// Listen for messages from background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // No-op: we do not actively fetch or reload; we only listen for real network responses
  if (message.action === 'fetchWaitingTime' || message.action === 'refreshWaitingTime' || message.action === 'forceRefreshWaitingTime') {
    console.log('[Content] Ignoring active fetch/reload request per user preference.');
    sendResponse({success: true});
  }
});

// Listen for messages from injected script
window.addEventListener('message', (event) => {
  if (event.source !== window) return;
  
  if (event.data.type === 'WAITING_TIME_RESPONSE') {
    console.log('Received waiting time data:', event.data.data);
    
    // Send data to background script
    chrome.runtime.sendMessage({
      action: 'updateWaitingTime',
      data: event.data.data
    });
  }
});

// All active fetch/reload helpers removed per user preference.

// Monitor for page navigation just for logging; do not actively fetch
let lastUrl = location.href;
new MutationObserver(() => {
  const url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    
    // Check if we're on an application page
    if (url.includes('/myapplications/') && url.includes('app.digital.diplo.de')) {
      console.log('Navigated to application page:', url);
      // No active fetch here
    }
  }
}).observe(document, {subtree: true, childList: true});

// No initial active fetch; we will rely on real network interception from injected.js

