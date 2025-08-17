// Popup script for displaying waiting time data

document.addEventListener('DOMContentLoaded', function() {
  const loadingEl = document.getElementById('loading');
  const errorEl = document.getElementById('error');
  const contentEl = document.getElementById('content');
  const waitingWeeksEl = document.getElementById('waitingWeeks');
  const waitingExactEl = document.getElementById('waitingExact');
  const statusDotEl = document.getElementById('statusDot');
  const statusTextEl = document.getElementById('statusText');
  const lastUpdateEl = document.getElementById('lastUpdate');
  const toggleMonitoring = document.getElementById('toggleMonitoring');
  const toggleLabel = document.getElementById('toggleLabel');

  // Load and display waiting time data
  function loadWaitingTimeData() {
    chrome.runtime.sendMessage({action: 'getWaitingTime'}, (response) => {
      if (response && response.data) {
        displayWaitingTime(response.data, response.lastUpdate);
      } else {
        showError();
      }
    });
  }

  // Display waiting time data
  function displayWaitingTime(data, lastUpdate) {
    loadingEl.classList.add('hidden');
    errorEl.classList.add('hidden');
    contentEl.classList.remove('hidden');

    // Display waiting time
    const exactWeeks = Number(data.estimatedWaitingTime);
    const days = Math.round(exactWeeks * 7);
    waitingWeeksEl.textContent = days;
    waitingExactEl.textContent = `~${days} days (${exactWeeks.toFixed(1)} weeks)`;

    // Display status
    if (data.waitingListActive) {
      statusDotEl.className = 'status-dot status-active';
      statusTextEl.textContent = 'Waiting list active';
    } else {
      statusDotEl.className = 'status-dot status-inactive';
      statusTextEl.textContent = 'Waiting list inactive';
    }

    // Display last update time
    if (lastUpdate) {
      const updateTime = new Date(lastUpdate);
      const now = new Date();
      const diffMinutes = Math.floor((now - updateTime) / (1000 * 60));
      
      if (diffMinutes < 1) {
        lastUpdateEl.textContent = 'Just now';
      } else if (diffMinutes < 60) {
        lastUpdateEl.textContent = `${diffMinutes} min ago`;
      } else {
        const diffHours = Math.floor(diffMinutes / 60);
        if (diffHours < 24) {
          lastUpdateEl.textContent = `${diffHours}h ago`;
        } else {
          lastUpdateEl.textContent = updateTime.toLocaleDateString();
        }
      }
    } else {
      lastUpdateEl.textContent = 'Unknown';
    }
  }

  // Show error state
  function showError() {
    loadingEl.classList.add('hidden');
    contentEl.classList.add('hidden');
    errorEl.classList.remove('hidden');
  }

  // Show loading state
  function showLoading() {
    contentEl.classList.add('hidden');
    errorEl.classList.add('hidden');
    loadingEl.classList.remove('hidden');
  }

  // No action buttons in minimalist mode

  // Listen for updates from background script
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'dataUpdated') {
      loadWaitingTimeData();
    }
  });

  // Initial load
  loadWaitingTimeData();

  // Wire up monitoring toggle
  chrome.storage.local.get(['monitorEnabled'], (res) => {
    const enabled = res.monitorEnabled !== false;
    toggleMonitoring.checked = enabled;
    toggleLabel.textContent = enabled ? 'ON' : 'OFF';
  });
  toggleMonitoring.addEventListener('change', () => {
    const enabled = !!toggleMonitoring.checked;
    toggleLabel.textContent = enabled ? 'ON' : 'OFF';
    chrome.storage.local.set({ monitorEnabled: enabled });
  });
});

