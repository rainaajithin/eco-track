
// This variable lives in the Service Worker's memory
let totalBytes = 0;

// 1. The Sensor: Listening to every data response
chrome.webRequest.onResponseStarted.addListener(
    (details) => {
        // Find the 'content-length' (the weight of the data)
        const header = details.responseHeaders.find(
            (h) => h.name.toLowerCase() === 'content-length'
        );

        if (header) {
            const bytes = parseInt(header.value);
            totalBytes += bytes; // Adding it to our running total

            // Convert to Megabytes for humans
            const mb = (totalBytes / (1024 * 1024)).toFixed(2);
            console.log(`Current Session Usage: ${mb} MB`);
            
            // 2. Save it to Chrome's local storage so it's 'Permanent-ish'
            chrome.storage.local.set({ "totalUsage": mb });
        }
    },
    { urls: ["<all_urls>"] }, // Watch every website
    ["responseHeaders"]        // We need the 'shipping labels'
);