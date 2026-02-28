/**
 * EcoBrowse 2026 - Popup Logic
 */

/* ---------------- HELPERS ---------------- */

function formatDomainName(domain) {
    if (!domain) return 'Unknown';
    if (domain.includes('gstatic.com')) return 'Google Resources';
    return domain.replace(/^(www\.|encrypted-tbn[0-9]\.)/, '');
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const hrs = Math.floor(mins / 60);
    const remMins = mins % 60;

    if (hrs > 0) return `${hrs}h ${remMins}m`;
    return `${mins} min`;
}

/* ---------------- CO₂ RENDER ---------------- */

function renderCO2Data() {
    chrome.storage.local.get(['dailyTotal', 'emitters'], (data) => {
        const total = parseFloat(data.dailyTotal) || 0;
        const emitters = data.emitters || {};
        const budget = 6800;
        const percent = Math.min((total / budget) * 100, 100);

        const bar = document.getElementById('progress-bar');
        if (bar) {
            bar.style.width = percent + "%";
            bar.classList.remove('green', 'yellow', 'red');
            if (percent > 80) bar.classList.add('red');
            else if (percent > 40) bar.classList.add('yellow');
            else bar.classList.add('green');
        }

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

        const statElement = document.getElementById('stat');
        if (statElement) {
            statElement.innerText = `${total.toFixed(2)}g / ${budget}g`;
        }

        const relativityElement = document.getElementById('relativity');
        if (relativityElement) {
            const treeImpact = (total / 60).toFixed(1);
            const phoneCharges = Math.round(total / 5);
            relativityElement.innerHTML = `
                🌲 Used <strong>${treeImpact}</strong> trees' daily work<br>
                📱 Equivalent to <strong>${phoneCharges}</strong> phone charges
            `;
        }

        const listElement = document.getElementById('top-emitters');
        if (listElement) {
            const sorted = Object.entries(emitters)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5);

            if (!sorted.length) {
                listElement.innerHTML = '<div class="emitter-item">Waiting for data...</div>';
            } else {
                listElement.innerHTML = sorted.map(([site, val]) => `
                    <div class="emitter-item">
                        <span>${formatDomainName(site)}</span>
                        <strong>${val.toFixed(1)}g</strong>
                    </div>
                `).join('');
            }
        }
    });
}

/* ---------------- TIME RENDER ---------------- */

function renderTimeData() {
    chrome.storage.local.get(['dailyTime'], (data) => {
        const dailyTime = data.dailyTime || {};
        const totalSeconds = Object.values(dailyTime).reduce((a, b) => a + b, 0);

        const totalEl = document.getElementById('totalTime');
        if (totalEl) totalEl.innerText = formatTime(totalSeconds);

        const list = document.getElementById('time-sites');
        if (!list) return;

        const sorted = Object.entries(dailyTime)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);

        if (!sorted.length) {
            list.innerHTML = '<div class="emitter-item">Waiting for data...</div>';
        } else {
            list.innerHTML = sorted.map(([site, sec]) => `
                <div class="emitter-item">
                    <span>${formatDomainName(site)}</span>
                    <strong>${formatTime(sec)}</strong>
                </div>
            `).join('');
        }
    });
}

/* ---------------- TOGGLE LOGIC ---------------- */

function setupToggle() {
    const btnCO2 = document.getElementById("btnCO2");
    const btnTime = document.getElementById("btnTime");
    const co2View = document.getElementById("co2View");
    const timeView = document.getElementById("timeView");

    if (!btnCO2 || !btnTime) return;

    btnCO2.onclick = () => toggle(true);
    btnTime.onclick = () => toggle(false);

    function toggle(showCO2) {
        co2View.style.display = showCO2 ? "block" : "none";
        timeView.style.display = showCO2 ? "none" : "block";

        btnCO2.className = showCO2 ? "active" : "btn";
        btnTime.className = showCO2 ? "btn" : "active";
    }
}

/* ---------------- EVENTS ---------------- */

chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'local') {
        renderCO2Data();
        renderTimeData();
    }
});

document.addEventListener('DOMContentLoaded', () => {

    setupToggle();

    const resetBtn = document.getElementById('reset-btn');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if (confirm("Reset today's carbon data?")) {
                chrome.storage.local.set({ dailyTotal: 0, emitters: {} }, () => {
                    chrome.action.setBadgeText({ text: "0" });
                    renderCO2Data();
                });
            }
        });
    }

    const dashboardBtn = document.getElementById('open-dashboard');
    if (dashboardBtn) {
        dashboardBtn.addEventListener('click', () => {
            chrome.tabs.create({
                url: chrome.runtime.getURL("dashboard.html")
            });
        });
    }

    renderCO2Data();
    renderTimeData();
});