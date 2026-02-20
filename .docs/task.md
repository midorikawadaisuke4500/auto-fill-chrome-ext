# Auto-Input Completion Chrome Extension Project

## 1. Project Initialization & Setup
- [x] Extract system specification from Gemini
- [x] Create project directory structure
- [x] Initialize Node.js for Chrome extension development
- [ ] Initialize Git repository
- [ ] Create `features/auto_fill_spec.md` with system requirements
- [ ] Create `implementation_plan.md`

## 2. Core Chrome Extension Development (Tier 1)
- [ ] Setup `manifest.json` (V3)
- [ ] Implement background script (Service Worker)
- [ ] Implement content script for DOM observation & manipulation
- [ ] Implement Popup UI (Master password, Profile selection)
- [ ] Sub-feature: Password Encryption/Decryption logic (AES-256-GCM)
- [ ] Sub-feature: MutationObserver for dynamic DOM handling

## 3. Data Relay API (Tier 2 - GAS)
- [ ] Setup Google Apps Script project
- [ ] Implement GET/POST endpoints for JSON configuration and SMS codes
- [ ] Setup Google Sheets as database structure

## 4. Mobile Automation (Tier 3 - iOS)
- [ ] Create iOS Shortcut for fetching latest SMS
- [ ] Implement webhook trigger script

## 5. Testing & Verification
- [ ] Unit tests for encryption module
- [ ] Local testing of extension in Chrome
- [ ] E2E testing with mock API and sample forms
- [ ] Real-world site testing (Booking.com, Mercari, etc.)
