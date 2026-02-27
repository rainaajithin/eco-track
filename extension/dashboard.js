/**
 * EcoBrowse 2026 - Dashboard Charts
 */

document.addEventListener("DOMContentLoaded", () => {
    loadCharts();
});

function loadCharts() {
    chrome.storage.local.get(
        ['emitters', 'dailyHistory'],
        (data) => {

            const emitters = data.emitters || {};
            const history = data.dailyHistory || {};

            renderBarChart(emitters);
            renderLineChart(history);
        }
    );
}

function renderBarChart(emitters) {

    const ctx = document.getElementById('dailyEmitterChart');

    if (!ctx) return;

    const sorted = Object.entries(emitters)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 7);

    const labels = sorted.map(item => item[0]);
    const values = sorted.map(item => parseFloat(item[1]).toFixed(2));

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'CO₂ Emissions (g)',
                data: values
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function renderLineChart(history) {

    const ctx = document.getElementById('dailyTrendChart');

    if (!ctx) return;

    const dates = Object.keys(history).sort();
    const values = dates.map(date => history[date]);

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: 'Daily CO₂ (g)',
                data: values,
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: true }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}