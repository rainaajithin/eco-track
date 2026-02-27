const CO2_PER_MB = 0.81;
const BUDGET_G = 6800;

function cleanDomain(domain) {
    if (domain.includes("googlevideo.com") || domain.includes("youtube.com")) return "YouTube";
    if (domain.includes("fbcdn.net") || domain.includes("facebook.com")) return "Facebook";
    if (domain.includes("instagram.com")) return "Instagram";
    if (domain.includes("netflix.com")) return "Netflix";
    if (domain.includes("google") && !domain.includes("youtube")) return "Google Services";
    if (domain.includes("gstatic.com") || domain.includes("googleapis.com")) {
        return "Google Infrastructure"; }
    return domain;
}

chrome.webRequest.onResponseStarted.addListener(
  (details) => {
    if (details.tabId === -1 || details.fromCache) return;

    const domain = cleanDomain(new URL(details.url).hostname);
    const header = details.responseHeaders.find(h => h.name.toLowerCase() === 'content-length');
    let sizeInMB = header ? parseInt(header.value) / 1024 / 1024 : 0.05;

    chrome.storage.local.get(['dailyTotal', 'emitters'], (result) => {
        let total = (parseFloat(result.dailyTotal) || 0) + (sizeInMB * CO2_PER_MB);
        let emitters = result.emitters || {};
        emitters[domain] = (emitters[domain] || 0) + (sizeInMB * CO2_PER_MB);

        chrome.storage.local.set({ dailyTotal: total, emitters: emitters }, () => {
            // UI Feedback: Change badge color based on 6800g
            chrome.action.setBadgeText({ text: Math.round(total).toString() });
            let color = total > BUDGET_G ? "#f44336" : "#4caf50"; 
            chrome.action.setBadgeBackgroundColor({ color: color });
        });
    });
  },
  { urls: ["<all_urls>"] },
  ["responseHeaders"]
);