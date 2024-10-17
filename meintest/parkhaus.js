const parkhausListURL = "https://fpellegrini.com/meintest/parkhaus-api.php";

let allDataSets = [];

// Labels für die X-Achse (1 bis 24 Stunden für Tag und dynamisch für Woche)
const dayLabels = Array.from({ length: 24 }, (_, i) => i + 1);  // 1 bis 24 für die Tagesansicht
const weekLabels = [];  // Dynamische Labels für die Wochenansicht

// Funktion, um die Labels für die 72-Stunden-Ansicht zu generieren
const generate72hLabels = () => {
    const labels = [];
    const now = new Date();

    for (let i = 0; i < 72; i++) {
        const current = new Date(now);
        current.setHours(now.getHours() - (71 - i));

        // Formatierung für bessere Lesbarkeit
        const options = { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' };
        labels.push(current.toLocaleDateString('de-DE', options));
    }

    return labels;
};

// Setup für die Daten (wird später mit API-Daten gefüllt)
const data = {
    labels: dayLabels, // Start mit Tagesansicht
    datasets: [
        {
            label: 'Auslastung Hard',
            data: [], // Hier kommen die API-Daten rein
            borderColor: 'rgba(54, 162, 235, 1)', // Blau
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            fill: false
        },
        {
            label: 'Auslastung Uszsued',
            data: [], // Hier kommen die API-Daten rein
            borderColor: 'rgba(255, 99, 132, 1)', // Rot
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            fill: false
        },
        {
            label: 'Auslastung Uni Irchel',
            data: [], // Hier kommen die API-Daten rein
            borderColor: 'rgba(75, 192, 192, 1)', // Grün
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            fill: false
        },
        {
            label: 'Auslastung Haustalgarten',
            data: [], // Hier kommen die API-Daten rein
            borderColor: 'rgba(153, 102, 255, 1)', // Lila
            backgroundColor: 'rgba(153, 102, 255, 0.2)',
            fill: false
        },
        {
            label: 'Auslastung Opéra',
            data: [], // Hier kommen die API-Daten rein
            borderColor: 'rgba(255, 206, 86, 1)', // Gelb
            backgroundColor: 'rgba(255, 206, 86, 0.2)',
            fill: false
        },
        {
            label: 'Auslastung Urania',
            data: [], // Hier kommen die API-Daten rein
            borderColor: 'rgba(54, 162, 235, 1)', // Blau
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            fill: false
        },
        {
            label: 'Auslastung Parkside',
            data: [], // Hier kommen die API-Daten rein
            borderColor: 'rgba(255, 159, 64, 1)', // Orange
            backgroundColor: 'rgba(255, 159, 64, 0.2)',
            fill: false
        },
        {
            label: 'Auslastung Helvetiaplatz',
            data: [], // Hier kommen die API-Daten rein
            borderColor: 'rgba(199, 199, 199, 1)', // Grau
            backgroundColor: 'rgba(199, 199, 199, 0.2)',
            fill: false
        },
        {
            label: 'Auslastung jelmoli',
            data: [], // Hier kommen die API-Daten rein
            borderColor: 'rgba(75, 192, 192, 1)', // Grün
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            fill: false
        }
    ]
};

// Chart Konfiguration
const config = {
    type: 'line',
    data: data,
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: 'white',
                    usePointStyle: true
                }
            },
            title: {
                display: true,
                text: 'Stündliche Auslastung für das Parkhaus',
                color: 'white'
            }
        },
        scales: {
            y: {
                title: {
                    display: true,
                    text: 'Auslastung (%)',
                    color: 'white'
                },
                ticks: {
                    color: 'rgba(200, 200, 200, 0.8)'
                },
                grid: {
                    color: 'rgba(200, 200, 200, 0.3)',
                },
                beginAtZero: true,
                max: 100
            },
            x: {
                title: {
                    display: true,
                    text: 'Zeit',
                    color: 'white'
                },
                ticks: {
                    color: 'rgba(220, 220, 220, 1)',
                    maxRotation: 0, // Keine Neigung der Labels
                    callback: function (value, index, values) {
                        // Bei 72-Stunden-Ansicht: Labels besser formatieren
                        if (values.length > 24 && index % 12 === 0) {
                            return this.getLabelForValue(value); // Nur jede 12. Stunde zeigen (für 3-Tages-Ansicht)
                        }
                        return index % 24 === 0 ? this.getLabelForValue(value) : '';
                    }
                },
                grid: {
                    color: 'rgba(200, 200, 200, 0.3)',
                }
            }
        },
        elements: {
            point: {
                radius: 5,
                backgroundColor: 'white',
                borderColor: 'white'
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
        return data.map(entry => parseFloat(entry.utilization));
    }

    // Für 72-Stunden-Ansicht
    if (timeframe === '72h') {
        return data.map(entry => parseFloat(entry.utilization));
    }
}

// Funktion zum Aktualisieren der Chart-Labels und Daten
function updateChart(timeframe) {
    if (timeframe === 'day') {
        parkhausAuslastungChart.data.labels = dayLabels;
        parkhausAuslastungChart.options.scales.x.title.text = 'Stunden des Tages (1-24)';
    } else if (timeframe === '72h') {
        const labels = generate72hLabels();
        parkhausAuslastungChart.data.labels = labels;
        parkhausAuslastungChart.options.scales.x.title.text = 'Letzte 72 Stunden';
    }
    parkhausAuslastungChart.update();
}

// Event-Listener für die Buttons
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('btnDay').addEventListener('click', async function () {
        await loadData('day');
        updateChart('day');
    });

    document.getElementById('btnWeek').addEventListener('click', async function () {
        await loadData('72h');
        updateChart('72h');
    });
});

// Daten laden und Chart aktualisieren
async function loadData(timeframe) {
    const p_hard = await getOneParkhausData("zuerichparkhaushardauii", timeframe);
    parkhausAuslastungChart.data.datasets[0].data = p_hard;

    const p_uszsued = await getOneParkhausData("zuerichparkplatzuszsued", timeframe);
    parkhausAuslastungChart.data.datasets[1].data = p_uszsued;

    const p_uniirchel = await getOneParkhausData("zuerichparkhausuniirchel", timeframe);
    parkhausAuslastungChart.data.datasets[2].data = p_uniirchel;

    const p_haustalgarten = await getOneParkhausData("zuerichparkhaustalgarten", timeframe);
    parkhausAuslastungChart.data.datasets[3].data = p_haustalgarten;

    const p_opéra = await getOneParkhausData("zuerichparkhausopéra", timeframe);
    parkhausAuslastungChart.data.datasets[4].data = p_opéra;

    const p_urania = await getOneParkhausData("zuerichparkhausurania", timeframe);
    parkhausAuslastungChart.data.datasets[5].data = p_urania;

    const p_parkside = await getOneParkhausData("zuerichparkhausparkside", timeframe);
    parkhausAuslastungChart.data.datasets[6].data = p_parkside;

    const p_helvetiaplatz = await getOneParkhausData("zuerichparkhaushelvetiaplatz", timeframe);
    parkhausAuslastungChart.data.datasets[7].data = p_helvetiaplatz;

    const p_jelmoli = await getOneParkhausData("zuerichparkhausjelmoli", timeframe);
    parkhausAuslastungChart.data.datasets[8].data = p_jelmoli;

    parkhausAuslastungChart.update();
}

// Initiale Daten laden (Tagesansicht)
loadData('day');
