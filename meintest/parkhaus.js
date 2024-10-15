const parkhausListURL = "https://fpellegrini.com/meintest/parkhaus-api.php";

let allDataSets = [];

// Labels für die X-Achse (1 bis 24 Stunden für Tag und dynamisch für Woche)
const dayLabels = Array.from({ length: 24 }, (_, i) => i + 1);  // 1 bis 24 für die Tagesansicht
const weekLabels = [];  // Dynamische Labels für die Wochenansicht

// Setup für die Daten (wird später mit API-Daten gefüllt)
const data = {
    labels: dayLabels, // Start mit Tagesansicht
    datasets: [
        {
            label: 'Auslastung Hard (%)',
            data: [], // Hier kommen die API-Daten rein
            borderColor: 'rgba(54, 162, 235, 1)', // Blau
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            fill: false
        },
        {
            label: 'Auslastung Centereleven (%)',
            data: [], // Hier kommen die API-Daten rein
            borderColor: 'rgba(255, 99, 132, 1)', // Rot
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            fill: false
        },
        {
            label: 'Auslastung Uni Irchel (%)',
            data: [], // Hier kommen die API-Daten rein
            borderColor: 'rgba(75, 192, 192, 1)', // Grün
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            fill: false
        },
        {
            label: 'Auslastung West (%)',
            data: [], // Hier kommen die API-Daten rein
            borderColor: 'rgba(153, 102, 255, 1)', // Lila
            backgroundColor: 'rgba(153, 102, 255, 0.2)',
            fill: false
        },
        {
            label: 'Auslastung City Parking (%)',
            data: [], // Hier kommen die API-Daten rein
            borderColor: 'rgba(255, 206, 86, 1)', // Gelb
            backgroundColor: 'rgba(255, 206, 86, 0.2)',
            fill: false
        },
        {
            label: 'Auslastung Urania (%)',
            data: [], // Hier kommen die API-Daten rein
            borderColor: 'rgba(54, 162, 235, 1)', // Blau
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            fill: false
        },
        {
            label: 'Auslastung Hohe Promenade (%)',
            data: [], // Hier kommen die API-Daten rein
            borderColor: 'rgba(255, 159, 64, 1)', // Orange
            backgroundColor: 'rgba(255, 159, 64, 0.2)',
            fill: false
        },
        {
            label: 'Auslastung Crowne Plaza (%)',
            data: [], // Hier kommen die API-Daten rein
            borderColor: 'rgba(199, 199, 199, 1)', // Grau
            backgroundColor: 'rgba(199, 199, 199, 0.2)',
            fill: false
        },
        {
            label: 'Auslastung Haus Feldegg (%)',
            data: [], // Hier kommen die API-Daten rein
            borderColor: 'rgba(75, 192, 192, 1)', // Grün
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            fill: false
        }
    ]
};

// Konfiguration des Charts
const config = {
    type: 'line',
    data: data,
    options: {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Stündliche Auslastung für das Parkhaus'
            }
        },
        scales: {
            y: {
                title: {
                    display: true,
                    text: 'Auslastung (%)'
                },
                beginAtZero: true,
                max: 100
            },
            x: {
                title: {
                    display: true,
                    text: 'Stunden des Tages (1-24)'
                }
            }
        }
    }
};

// Initialisiere den Chart
const parkhausAuslastungChart = new Chart(
    document.getElementById('parkhausAuslastungChart'),
    config
);

// Funktion zum Abrufen der Parkhausdaten
async function getOneParkhausData(parkhausId, timeframe = 'day') {
    let url = parkhausListURL + "?park_id=" + parkhausId + "&timeframe=" + timeframe;

    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
        console.error(data.error);
        return [];
    }

    // Für Tagesansicht (Stunden)
    if (timeframe === 'day') {
        return data.map(entry => {
            let utilization = parseFloat(entry.utilization);
            return utilization >= 90 ? 100 : utilization;  // Setze auf 100% bei >= 90%
        });
    }

    // Für Wochenansicht (stündlich über 7 Tage)
    if (timeframe === 'week') {
        weekLabels.length = 0;  // Vorherige Labels löschen
        data.forEach(entry => {
            weekLabels.push(entry.dayhour);  // Stündliche Labels für 7 Tage
        });

        console.log('Week Labels:', weekLabels);  // Debugging: Ausgabe der Labels
        console.log('Week Data:', data);  // Debugging: Ausgabe der Daten

        return data.map(entry => {
            let utilization = parseFloat(entry.utilization);
            return utilization >= 90 ? 100 : utilization;  // Setze auf 100% bei >= 90%
        });
    }
}

// Funktion zum Aktualisieren der Chart-Labels und Daten
function updateChart(timeframe) {
    if (timeframe === 'day') {
        parkhausAuslastungChart.data.labels = dayLabels;
        parkhausAuslastungChart.options.scales.x.title.text = 'Stunden des Tages (1-24)';
    } else if (timeframe === 'week') {
        parkhausAuslastungChart.data.labels = weekLabels;
        parkhausAuslastungChart.options.scales.x.title.text = 'Tage und Stunden der Woche';
    }
    parkhausAuslastungChart.update();  // Den Chart aktualisieren
}

// Event-Listener für die Buttons
document.getElementById('btnDay').addEventListener('click', async function () {
    await loadData('day');
    updateChart('day');
});

document.getElementById('btnWeek').addEventListener('click', async function () {
    await loadData('week');
    updateChart('week');
});

// Daten laden und Chart aktualisieren
async function loadData(timeframe) {
    const p_hard = await getOneParkhausData("zuerichparkhaushardauii", timeframe);
    parkhausAuslastungChart.data.datasets[0].data = p_hard;

    const p_centereleven = await getOneParkhausData("zuerichparkhauscentereleven", timeframe);
    parkhausAuslastungChart.data.datasets[1].data = p_centereleven;

    const p_uniirchel = await getOneParkhausData("zuerichparkhausuniirchel", timeframe);
    parkhausAuslastungChart.data.datasets[2].data = p_uniirchel;

    const p_west = await getOneParkhausData("zuerichparkhauspwest", timeframe);
    parkhausAuslastungChart.data.datasets[3].data = p_west;

    const p_cityparking = await getOneParkhausData("zuerichparkhauscityparking", timeframe);
    parkhausAuslastungChart.data.datasets[4].data = p_cityparking;

    const p_urania = await getOneParkhausData("zuerichparkhausurania", timeframe);
    parkhausAuslastungChart.data.datasets[5].data = p_urania;

    const p_hohepromenade = await getOneParkhausData("zuerichparkhaushohepromenade", timeframe);
    parkhausAuslastungChart.data.datasets[6].data = p_hohepromenade;

    const p_crowneplaza = await getOneParkhausData("zuerichparkhauscrowneplaza", timeframe);
    parkhausAuslastungChart.data.datasets[7].data = p_crowneplaza;

    const p_hausfeldegg = await getOneParkhausData("zuerichparkhausfeldegg", timeframe);
    parkhausAuslastungChart.data.datasets[8].data = p_hausfeldegg;

    parkhausAuslastungChart.update();
}

// Initiale Daten laden (Tagesansicht)
loadData('day');
