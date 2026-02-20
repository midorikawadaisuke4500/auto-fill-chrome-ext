// Content script injected into all pages

console.log('[AutoFillExt] Content script loaded on:', window.location.href);

// Basic skeleton for DOM observation
class DOMObserver {
    constructor() {
        this.observer = null;
        this.targetSelectors = [];
    }

    start(selectors) {
        this.targetSelectors = selectors;

        // Initial check
        this.checkDOM();

        // Start observing mutations for dynamic SPA content
        this.observer = new MutationObserver((mutations) => {
            // In a real implementation we throttle this
            this.checkDOM();
        });

        this.observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: false,
        });
    }

    stop() {
        if (this.observer) {
            this.observer.disconnect();
        }
    }

    checkDOM() {
        // Basic search based on selectors
        for (const data of this.targetSelectors) {
            const el = document.querySelector(data.selector);
            if (el && !el.dataset.autoFilled) {
                // Mock action
                console.log('[AutoFillExt] Found target element:', el);
                // Do fill
                // el.value = data.value;
                // el.dataset.autoFilled = 'true';
            }
        }
    }
}

// Just listening for commands
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'START_SCENARIO') {
        const observer = new DOMObserver();
        observer.start(request.targets);
        sendResponse({ status: 'started' });
    }
});
