// Background script (Service Worker)

console.log('Background service worker initialized.');

// Temporary memory store for the master password (cleared on browser restart)
let masterPassword = null;
let activeProfile = null;

// Listen for messages from popup or content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'SET_MASTER_PASSWORD') {
    masterPassword = request.password;
    sendResponse({ success: true });
    return true; // async response indication
  }
  
  if (request.type === 'CHECK_AUTH') {
    sendResponse({ isAuthenticated: !!masterPassword, profile: activeProfile });
    return true;
  }
  
  // More message handling later...
});

// Watch for tab URL changes to trigger potential auto-fill scenarios
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    if (tab.url.startsWith('http')) {
      // Logic to check URL against scenarios will go here
      console.log('Tab finished loading:', tab.url);
    }
  }
});
