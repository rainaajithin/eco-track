/**
 * EcoBrowse 2026 — FINAL DASHBOARD ENGINE
 * CO₂ + TIME DASHBOARD (Fully Fixed)
 */

let dailyChart = null;
let weeklyChart = null;
let co2BarChart = null;
let co2LineChart = null;

document.addEventListener("DOMContentLoaded", () => {

    const btnCO2 = document.getElementById("btnCO2");
    const btnTime = document.getElementById("btnTime");
    const co2View = document.getElementById("co2View");
    const timeView = document.getElementById("timeView");

    btnCO2.addEventListener("click", () => toggle(true));
    btnTime.addEventListener("click", () => toggle(false));

    function toggle(showCO2) {
        co2View.style.display = showCO2 ? "block" : "none";
        timeView.style.display = showCO2 ? "none" : "block";

        btnCO2.className = showCO2 ? "active" : "btn";
        btnTime.className = showCO2 ? "btn" : "active";

        loadCharts();   // 🔥 IMPORTANT FIX
    }

    loadCharts();
});

/* ---------------- LOAD ALL DATA ---------------- */

function loadCharts() {
    chrome.storage.local.get(
        ['emitters', 'weeklyHistory', 'dailyTime', 'weeklyTime'],
        (data) => {

            /* ---------------- CO₂ DATA ---------------- */

            renderBarChart(data.emitters || {});
            renderLineChart(data.weeklyHistory || {});

            /* ---------------- TIME DATA ---------------- */

            const dailyTime = data.dailyTime || {};
            const weeklyTime = data.weeklyTime || {};

            renderDailyTimeChart(dailyTime);
            renderWeeklyTimeChart(weeklyTime);
            renderCategoryTimeChart(dailyTime);   // ✅ REQUIRED
        }
    );
}
/* ---------------- CO₂ CHARTS ---------------- */

function renderBarChart(emitters) {
    const ctx = document.getElementById('dailyEmitterChart');
    if (!ctx) return;

    if (co2BarChart) co2BarChart.destroy();

    const sorted = Object.entries(emitters)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 7);

    co2BarChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: sorted.map(i => i[0]),
            datasets: [{ label: 'CO₂ (g)', data: sorted.map(i => i[1].toFixed(2)) }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true } }
        }
    });
}

function renderLineChart(history) {
    const ctx = document.getElementById('dailyTrendChart');
    if (!ctx) return;

    if (co2LineChart) co2LineChart.destroy();

    const entries = Object.entries(history)
        .sort((a, b) => new Date(a[0]) - new Date(b[0]))
        .slice(-7);

    if (!entries.length) return;

    co2LineChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: entries.map(i => i[0]),
            datasets: [{ label: 'Weekly CO₂ (g)', data: entries.map(i => i[1]), tension: 0.3 }]
        },
        options: {
            responsive: true,
            scales: { y: { beginAtZero: true } }
        }
    });
}

/* ---------------- TIME CHARTS ---------------- */

function renderDailyTimeChart(dailyTime) {
    const ctx = document.getElementById('dailyTimeChart');
    if (!ctx) return;

    if (dailyChart) dailyChart.destroy();

    const sorted = Object.entries(dailyTime)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 7);

    if (!sorted.length) {
        ctx.parentElement.innerHTML = "<p>No time data yet.</p>";
        return;
    }

    dailyChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: sorted.map(i => i[0]),
            datasets: [{ label: "Minutes", data: sorted.map(i => Math.round(i[1] / 60)) }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true } }
        }
    });
}

function renderWeeklyTimeChart(weeklyTime) {
    const ctx = document.getElementById('weeklyTimeChart');
    if (!ctx) return;

    if (weeklyChart) weeklyChart.destroy();

    const entries = Object.entries(weeklyTime)
        .sort((a, b) => new Date(a[0]) - new Date(b[0]))
        .slice(-7);

    if (!entries.length) {
        ctx.parentElement.innerHTML = "<p>No weekly data yet.</p>";
        return;
    }

    weeklyChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: entries.map(i => i[0]),
            datasets: [{ label: "Minutes", data: entries.map(i => Math.round(i[1] / 60)), tension: 0.3 }]
        },
        options: {
            responsive: true,
            scales: { y: { beginAtZero: true } }
        }
    });
}

/**************** CATEGORY TIME DISTRIBUTION ****************/



const SITE_CATEGORIES = {

    Social: ["youtube.com", "instagram.com", "facebook.com", "twitter.com", "reddit.com"],

    Entertainment: ["netflix.com", "primevideo.com", "hotstar.com"],

    Work: ["github.com", "stackoverflow.com", "google.com", "docs.google.com"],

    Study: ["udemy.com", "coursera.org", "khanacademy.org"]

};



function renderCategoryTimeChart(dailyTime) {

    const ctx = document.getElementById("categoryTimeChart");

    if (!ctx) return;



    if (!dailyTime || Object.keys(dailyTime).length === 0) {

        ctx.parentElement.innerHTML += "<p>No category data yet.</p>";

        return;

    }



    const SITE_CATEGORIES = {

        Social: ["youtube.com", "instagram.com", "facebook.com", "twitter.com", "reddit.com"],

        Entertainment: ["netflix.com", "primevideo.com", "hotstar.com"],

        Work: ["github.com", "stackoverflow.com", "docs.google.com"],

        Study: ["udemy.com", "coursera.org", "khanacademy.org"]

    };



    const categoryTotals = {

        Social: 0,

        Entertainment: 0,

        Work: 0,

        Study: 0,

        Other: 0

    };



    for (const [domain, seconds] of Object.entries(dailyTime)) {



        if (!domain || domain.length < 4) continue;

        if (domain.includes("chrome-extension")) continue;



        let assigned = false;



        for (const [category, sites] of Object.entries(SITE_CATEGORIES)) {

            if (sites.some(site => domain.includes(site))) {

                categoryTotals[category] += seconds;

                assigned = true;

                break;

            }

        }



        if (!assigned) categoryTotals.Other += seconds;

    }



    const labels = [];

    const values = [];



    for (const [cat, val] of Object.entries(categoryTotals)) {

        if (val > 60) {   // show only if >1 min

            labels.push(cat);

            values.push(Math.round(val / 60));

        }

    }



    if (!values.length) {

        ctx.parentElement.innerHTML += "<p>Browse distracting sites to generate data.</p>";

        return;

    }



    new Chart(ctx, {

        type: "doughnut",

        data: {

            labels,

            datasets: [{ data: values }]

        },

        options: {

            responsive: true,

            plugins: {

                legend: { position: "bottom" },

                tooltip: {

                    callbacks: {

                        label: ctx => `${ctx.label}: ${ctx.raw} min`

                    }

                }

            }

        }

    });

}