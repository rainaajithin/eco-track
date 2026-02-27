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

    // Convert history object to sorted array
    const entries = Object.entries(history)
        .sort((a, b) => new Date(a[0]) - new Date(b[0]));

    // Get last 7 days only
    const last7 = entries.slice(-7);

    if (last7.length === 0) {
        ctx.parentElement.innerHTML += "<p>No weekly data yet.</p>";
        return;
    }

    const labels = last7.map(item => {
        const date = new Date(item[0]);
        return date.toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric'
        });
    });

    const values = last7.map(item => item[1]);

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Weekly CO₂ (g)',
                data: values,
                tension: 0.3,
                fill: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: true }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Date'
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'CO₂ (grams)'
                    }
                }
            }
        }
    });
}