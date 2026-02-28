/**
 * EcoBrowse 2026 — Final Stable Time Tracking Engine
 * Tracks ONLY distracting websites
 */

const DISTRACTING_SITES = [
    "youtube.com",
    "instagram.com",
    "facebook.com",
    "twitter.com",
    "reddit.com",
    "netflix.com",
    "primevideo.com"
];

let activeDomain = null;
let startTime = null;

/* ---------------- TAB EVENTS ---------------- */

chrome.tabs.onActivated.addListener(info => {
    handleTab(info.tabId);
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete") handleTab(tabId);
});

chrome.windows.onFocusChanged.addListener(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        if (tabs.length) handleTab(tabs[0].id);
    });
});

/* ---------------- CORE ---------------- */

function handleTab(tabId) {
    stopTracking();

    chrome.tabs.get(tabId, tab => {
        if (!tab || !tab.url) return;

        if (
            tab.url.startsWith("chrome://") ||
            tab.url.startsWith("chrome-extension://")
        ) return;

        const domain = extractDomain(tab.url);
        if (!domain) return;

        if (isDistracting(domain)) {
            activeDomain = domain;
            startTime = Date.now();
        }
    });
}

function stopTracking() {
    if (!activeDomain || !startTime) return;

    const seconds = Math.floor((Date.now() - startTime) / 1000);

    if (seconds > 2) {
        saveTime(activeDomain, seconds);
    }

    activeDomain = null;
    startTime = null;
}

/* ---------------- STORAGE ---------------- */

function saveTime(domain, seconds) {
    const today = new Date().toISOString().slice(0, 10);
    const week = getWeekStart();

    chrome.storage.local.get(['dailyTime', 'weeklyTime'], data => {
        const daily = data.dailyTime || {};
        const weekly = data.weeklyTime || {};

        daily[domain] = (daily[domain] || 0) + seconds;
        weekly[week] = (weekly[week] || 0) + seconds;

        chrome.storage.local.set({
            dailyTime: daily,
            weeklyTime: weekly
        });
    });
}

/* ---------------- HELPERS ---------------- */

function extractDomain(url) {
    try {
        return new URL(url).hostname.replace(/^www\./, '');
    } catch {
        return null;
    }
}

function isDistracting(domain) {
    return DISTRACTING_SITES.some(site => domain.includes(site));
}

function getWeekStart() {
    const now = new Date();
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(now.setDate(diff)).toISOString().slice(0, 10);
}

chrome.runtime.onSuspend.addListener(stopTracking);