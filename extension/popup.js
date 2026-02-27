/**
 * EcoBrowse 2026 - Dashboard Logic
 */

function formatDomainName(domain) {
    if (!domain) return 'Unknown';
    if (domain.includes('gstatic.com')) return 'Google Resources';
    return domain.replace(/^(www\.|encrypted-tbn[0-9]\.)/, '');
}

function renderData() {
    chrome.storage.local.get(['dailyTotal', 'emitters'], (data) => {
        const total = parseFloat(data.dailyTotal) || 0;
        const emitters = data.emitters || {};
        const budget = 6800; 
        const percent = Math.min((total / budget) * 100, 100);

        // 2. PROGRESS BAR
        const bar = document.getElementById('progress-bar');
        if (bar) {
            bar.style.width = percent + "%";
            bar.classList.remove('green', 'yellow', 'red');
            if (percent > 80) bar.classList.add('red');
            else if (percent > 40) bar.classList.add('yellow');
            else bar.classList.add('green');
        }

        // 3. GRADE (Defensive check added)
        const gradeElement = document.getElementById('grade');
        if (gradeElement) {
            let grade = "A", color = "#4caf50"; 
            if (percent > 90) { grade = "F"; color = "#d32f2f"; }
            else if (percent > 70) { grade = "D"; color = "#f44336"; }
            else if (percent > 50) { grade = "C"; color = "#ff9800"; }
            else if (percent > 25) { grade = "B"; color = "#ffc107"; }
            gradeElement.innerText = grade;
            gradeElement.style.backgroundColor = color;
        }

        // 4. STATS TEXT (This is likely where your innerText error was)
        const statElement = document.getElementById('stat');
        if (statElement) {
            statElement.innerText = `${total.toFixed(2)}g / ${budget}g`;
        }

        // 5. RELATIVITY
        const relativityElement = document.getElementById('relativity');
        if (relativityElement) {
            const treeImpact = (total / 60).toFixed(1);
            const phoneCharges = Math.round(total / 5);
            relativityElement.innerHTML = `
                🌲 Used <strong>${treeImpact}</strong> trees' daily work<br>
                📱 Equivalent to <strong>${phoneCharges}</strong> phone charges
            `;
        }

        // 6. TOP EMITTERS
        const listElement = document.getElementById('top-emitters');
        if (listElement) {
            const sorted = Object.entries(emitters)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5);

            if (sorted.length === 0) {
                listElement.innerHTML = '<div class="emitter-item">Waiting for data...</div>';
            } else {
                listElement.innerHTML = sorted.map(([site, val]) => {
                    const cleanName = formatDomainName(site);
                    const safeVal = parseFloat(val) || 0;
                    return `
                        <div class="emitter-item">
                            <span title="${site}">${cleanName}</span>
                            <strong>${safeVal.toFixed(1)}g</strong>
                        </div>
                    `;
                }).join('');
            }
        }
    });
}

// 7. LISTENERS
chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'local') renderData();
});

document.addEventListener('DOMContentLoaded', () => {
    const resetBtn = document.getElementById('reset-btn');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if (confirm("Reset today's carbon data?")) {
                chrome.storage.local.set({ dailyTotal: 0, emitters: {} }, () => {
                    if (typeof chrome.action !== 'undefined' && chrome.action.setBadgeText) {
                        chrome.action.setBadgeText({ text: "0" });
                    }
                    renderData();
                });
            }
        });
    }
    renderData();
}); 