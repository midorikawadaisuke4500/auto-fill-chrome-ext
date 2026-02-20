// Popup logic

document.addEventListener('DOMContentLoaded', () => {
    const authSection = document.getElementById('auth-section');
    const mainSection = document.getElementById('main-section');
    const passwordInput = document.getElementById('master-password');
    const unlockBtn = document.getElementById('unlock-btn');
    const lockBtn = document.getElementById('lock-btn');
    const statusEl = document.getElementById('status');

    // Custom minimal logic to check auth state via background
    chrome.runtime.sendMessage({ type: 'CHECK_AUTH' }, (response) => {
        if (response && response.isAuthenticated) {
            showMain();
        } else {
            showAuth();
        }
    });

    unlockBtn.addEventListener('click', () => {
        const pwd = passwordInput.value.trim();
        if (!pwd) return;

        // In actual implementation, we'd verify the hash of the password here
        chrome.runtime.sendMessage({ type: 'SET_MASTER_PASSWORD', password: pwd }, (response) => {
            if (response && response.success) {
                showMain();
                passwordInput.value = '';
                statusEl.textContent = 'Unlocked successfully.';
            }
        });
    });

    lockBtn.addEventListener('click', () => {
        chrome.runtime.sendMessage({ type: 'SET_MASTER_PASSWORD', password: null }, (response) => {
            showAuth();
            statusEl.textContent = 'Session locked.';
        });
    });

    function showMain() {
        authSection.classList.add('hidden');
        mainSection.classList.remove('hidden');
    }

    function showAuth() {
        authSection.classList.remove('hidden');
        mainSection.classList.add('hidden');
    }
});
