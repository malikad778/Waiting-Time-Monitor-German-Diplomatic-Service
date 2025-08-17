// Background script for monitoring network requests and managing extension state

let waitingTimeData = null;
let lastUpdateTime = null;

// Keep a cached toggle for quick checks
let monitorEnabledFlag = true;

// Listen for web requests to the diplomatic service API
chrome.webRequest.onCompleted.addListener(
  function(details) {
    if (!monitorEnabledFlag) return; // Respect OFF toggle
    if (details.url.includes('/application-service/v1/application/') && 
        details.url.includes('/limits') && 
        details.statusCode === 200) {
      
      console.log('Detected API call to limits endpoint:', details.url);
      
      // Extract application ID from URL
      const urlParts = details.url.split('/');
      const applicationIndex = urlParts.findIndex(part => part === 'application');
      const applicationId = applicationIndex !== -1 ? urlParts[applicationIndex + 1] : null;
      
      if (applicationId) {
        // Store the application ID and URL for later use
        chrome.storage.local.set({
          'lastApplicationId': applicationId,
          'lastApiUrl': details.url,
          'lastRequestTime': Date.now()
        });
        
        // Notify content script to fetch the data
        chrome.tabs.sendMessage(details.tabId, {
          action: 'fetchWaitingTime',
          url: details.url,
          applicationId: applicationId
        });
      }
    }
  },
  {
    urls: ["https://app.digital.diplo.de/rkh/application-service/v1/application/*/limits"]
  }
);

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'updateWaitingTime') {
    // Only process if monitoring is enabled
    chrome.storage.local.get(['monitorEnabled'], (cfg) => {
      const enabled = cfg.monitorEnabled !== false; // default true
      if (!enabled) {
        // If disabled, ensure badge reflects OFF state
        chrome.action.setBadgeText({ text: '' });
        chrome.action.setTitle({ title: 'Waiting Time Monitor (OFF)' });
        sendResponse({ success: true });
        return;
      }

      waitingTimeData = message.data;
      lastUpdateTime = Date.now();
      
      // Store in chrome storage
      chrome.storage.local.set({
        'waitingTimeData': waitingTimeData,
        'lastUpdateTime': lastUpdateTime
      });
      
      // Update badge with waiting time
      updateBadge(waitingTimeData);
      
      // Notify any listeners (e.g., popup) that data has been updated
      try {
        chrome.runtime.sendMessage({ action: 'dataUpdated' });
      } catch (e) {
        // ignore if no listeners
      }
      
      sendResponse({success: true});
    });
  } else if (message.action === 'getWaitingTime') {
    sendResponse({
      data: waitingTimeData,
      lastUpdate: lastUpdateTime
    });
  }
});

// Function to update the extension badge
function updateBadge(data) {
  if (data && data.estimatedWaitingTime) {
    const exactWeeks = Number(data.estimatedWaitingTime);
    const days = Math.round(exactWeeks * 7);
    const badgeText = days > 99 ? '99+' : days.toString();
    
    chrome.action.setBadgeText({
      text: badgeText + 'd'
    });
    
    chrome.action.setBadgeBackgroundColor({
      color: data.waitingListActive ? '#FF6B6B' : '#4ECDC4'
    });
    
    chrome.action.setTitle({
      title: `Waiting Time: ~${days} days (${exactWeeks.toFixed(1)} weeks)`
    });
  } else {
    chrome.action.setBadgeText({text: ''});
    chrome.action.setTitle({title: 'Waiting Time Monitor'});
  }
}

// Initialize extension
chrome.runtime.onInstalled.addListener(() => {
  console.log('German Diplomatic Service Waiting Time Monitor installed');
  
  // Load stored data
  chrome.storage.local.get(['waitingTimeData', 'lastUpdateTime', 'monitorEnabled'], (result) => {
    // Default monitorEnabled to true on first install
    if (typeof result.monitorEnabled === 'undefined') {
      chrome.storage.local.set({ monitorEnabled: true });
    }
    monitorEnabledFlag = result.monitorEnabled !== false;
    if (result.waitingTimeData) {
      waitingTimeData = result.waitingTimeData;
      lastUpdateTime = result.lastUpdateTime;
      // Only show badge if enabled
      if (result.monitorEnabled !== false) {
        updateBadge(waitingTimeData);
      } else {
        chrome.action.setBadgeText({ text: '' });
        chrome.action.setTitle({ title: 'Waiting Time Monitor (OFF)' });
      }
    }
  });
});

// Auto refresh removed per user request

// React to toggle changes immediately
chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== 'local') return;
  if (changes.monitorEnabled) {
    const enabled = changes.monitorEnabled.newValue !== false;
    monitorEnabledFlag = enabled;
    if (!enabled) {
      chrome.action.setBadgeText({ text: '' });
      chrome.action.setTitle({ title: 'Waiting Time Monitor (OFF)' });
    } else {
      updateBadge(waitingTimeData);
    }
  }
});

