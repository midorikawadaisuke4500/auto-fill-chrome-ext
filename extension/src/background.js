// Background script (Service Worker)

import CryptoUtil from './crypto.js';

console.log('Background service worker initialized.');

let masterPassword = null;
let derivedKey = null; // AES Key object derived from master password
let activeProfile = null;

// Listen for messages from popup or content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'SET_MASTER_PASSWORD') {
        (async () => {
            masterPassword = request.password;
            if (masterPassword) {
                // Use a static salt for now (for demonstration purposes)
                const salt = new TextEncoder().encode("static-salt-123");
                derivedKey = await CryptoUtil.deriveKey(masterPassword, salt);
                sendResponse({ success: true });
            } else {
                derivedKey = null;
                sendResponse({ success: true });
            }
        })();
        return true; // async response indication
    }

    if (request.type === 'CHECK_AUTH') {
        sendResponse({ isAuthenticated: !!derivedKey, profile: activeProfile });
        return true;
    }
});

// Watch for tab URL changes to trigger potential auto-fill scenarios
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url) {
        if (tab.url.startsWith('http')) {
            console.log('Tab finished loading:', tab.url);
            // TODO: Match URL against scenarios and inject if needed
        }
    }
});
