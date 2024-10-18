const parkhausListURL = "https://fpellegrini.com/meintest/parkhaus-api.php";

let allDataSets = [];
let maxCapacity = {
    "zuerichparkhaushardauii": 982,
    "zuerichparkplatzuszsued": 80,
    "zuerichparkhausuniirchel": 1227,
    "zuerichparkhaustalgarten": 110,
    "zuerichparkhausopéra": 299,
    "zuerichparkhausurania": 607,
    "zuerichparkhausparkside": 38,
    "zuerichparkhaushelvetiaplatz": 66,
    "zuerichparkhausjelmoli": 222,
};

// Labels für die X-Achse (Stunden des Tages von 00:00 bis 23:00)
const dayLabels = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, '0'); // Stellt sicher, dass die Stunden immer zweistellig sind
    return `${hour}:00`;
});

// Labels für die 72-Stunden Ansicht
const generate72hLabels = () => {
    const labels = [];
    const now = new Date();

    for (let i = 0; i < 72; i++) {
        const current = new Date(now);
        current.setHours(now.getHours() - (71 - i));

        // Formatierung für bessere Lesbarkeit (Tag, Monat, Stunde)
        const options = { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric' };
        labels.push(current.toLocaleDateString('de-DE', options));
    }

    return labels;
};

// Reduzierte Redundanz im Dataset-Setup
const datasetInfo = [
    { label: 'Hard', color: [54, 162, 235], parkhausId: 'zuerichparkhaushardauii' },
    { label: 'Uszsued', color: [255, 99, 132], parkhausId: 'zuerichparkplatzuszsued' },
    { label: 'Uni Irchel', color: [75, 192, 192], parkhausId: 'zuerichparkhausuniirchel' },
    { label: 'Haustalgarten', color: [153, 102, 255], parkhausId: 'zuerichparkhaustalgarten' },
    { label: 'Opéra', color: [255, 206, 86], parkhausId: 'zuerichparkhausopéra' },
    { label: 'Urania', color: [54, 162, 235], parkhausId: 'zuerichparkhausurania' },
    { label: 'Parkside', color: [255, 159, 64], parkhausId: 'zuerichparkhausparkside' },
    { label: 'Helvetiaplatz', color: [199, 199, 199], parkhausId: 'zuerichparkhaushelvetiaplatz' },
    { label: 'Jelmoli', color: [75, 192, 192], parkhausId: 'zuerichparkhausjelmoli' }
];

const datasets = datasetInfo.map(info => ({
    label: info.label,
    data: [],
    borderColor: `rgba(${info.color.join(', ')}, 1)`,
    backgroundColor: `rgba(${info.color.join(', ')}, 0.2)`,
    fill: false,
    parkhausId: info.parkhausId
}));

// Setup für die Daten
const data = {
    labels: dayLabels, // Start mit Tagesansicht
    datasets: datasets
};


const config = {
    type: 'line',
    data: data,
    options: {
        responsive: true,
        maintainAspectRatio: false, // Kein festes Seitenverhältnis mehr
        plugins: {
            legend: {
                position: window.innerWidth < 768 ? 'top' : 'right',
                labels: {
                    padding: window.innerWidth < 768 ? 5 : 15,  // Weniger Padding auf mobilen Geräten
                    color: 'white',
                    usePointStyle: true
                }
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        const dataset = context.dataset;
                        const parkhausName = dataset.label;
                        const utilization = parseFloat(context.parsed.y).toFixed(1);
                        const maxPlaces = maxCapacity[dataset.parkhausId];
                        const freePlaces = maxPlaces - Math.round((utilization / 100) * maxPlaces);

                        return [
                            `Parkhaus: ${parkhausName}`,
                            `${utilization}%`,
                            `Freie Plätze: ${freePlaces}`,
                            `Maximale Plätze: ${maxPlaces}`
                        ];
                    }
                }
            }
        },
        scales: {
            y: {
                title: {
                    display: true,
                    text: 'Auslastung (%)',
                    color: 'white',
                    font: {
                        weight: 'bold' // Make the Y-axis label bold
                    }
                },
                ticks: {
                    color: 'rgba(200, 200, 200, 0.8)',
                    font: {
                        weight: 'bold' // Make the Y-axis ticks bold
                    }
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
                    text: 'Stunden des Tages',
                    color: 'white',
                    font: {
                        weight: 'bold' // Make the X-axis label bold
                    }
                },
                ticks: {
                    color: 'rgba(220, 220, 220, 1)',
                    autoSkip: true,
                    maxTicksLimit: 6,  // Weniger Labels bei kleineren Bildschirmen
                    font: {
                        weight: 'bold' // Make the X-axis ticks bold
                    }
                },
                grid: {
                    color: 'rgba(200, 200, 200, 0.3)',
                }
            }
        },
        elements: {
            point: {
                radius: window.innerWidth < 768 ? 2 : 5, // Kleinere Punkte auf mobilen Geräten
                backgroundColor: 'white',
                borderColor: 'white'
            }
        },
        layout: {
            padding: {
                left: 10,
                right: 10,
                top: window.innerWidth < 768 ? 20 : 10, // Mehr Platz oben bei mobilen Geräten
                bottom: 10
            }
        }
    }
};


// Initialisiere den Chart
const parkhausAuslastungChart = new Chart(
    document.getElementById('parkhausAuslastungChart'),
    config
);


// Event-Listener zur Anpassung der Legende und Größenänderung des Charts
window.addEventListener('resize', () => {
    parkhausAuslastungChart.options.plugins.legend.position = window.innerWidth < 768 ? 'top' : 'right';
    parkhausAuslastungChart.options.elements.point.radius = window.innerWidth < 768 ? 2 : 5;
    parkhausAuslastungChart.options.plugins.legend.labels.padding = window.innerWidth < 768 ? 5 : 15;
    parkhausAuslastungChart.update();
});



// Funktion zum Abrufen der Parkhausdaten
async function getOneParkhausData(parkhausId, timeframe = 'day') {
    let url = parkhausListURL + "?park_id=" + parkhausId + "&timeframe=" + timeframe;

    const response = await fetch(url);

    try {
        const data = await response.json();
        if (data.error) {
            return [];
        }

        return data.map(entry => {
            const utilization = parseFloat(entry.utilization);
            if (isNaN(utilization)) {
                return 0;
            }
            return utilization.toFixed(1);
        });
    } catch (e) {
        return [];
    }
}



// Funktion zum Aktualisieren der Chart-Labels und Daten
function updateChart(timeframe) {
    if (timeframe === 'day') {
        parkhausAuslastungChart.data.labels = dayLabels; 
        parkhausAuslastungChart.options.scales.x.title.text = 'Stunden des Tages';
    } else if (timeframe === '72h') {
        parkhausAuslastungChart.data.labels = generate72hLabels();
        parkhausAuslastungChart.options.scales.x.title.text = 'Datum und Uhrzeit';
    }
    parkhausAuslastungChart.update();
    generateInterpretations(); // Interpretationen basierend auf den letzten 24 Stunden generieren
}

// Funktion zum Erzeugen der Interpretationen basierend auf den letzten 24 Stunden
async function generateInterpretations() {
    const timeframe = 'day'; // Immer nur die letzten 24 Stunden berücksichtigen
    const labels = dayLabels;
    const interpretations = [];

    await Promise.all(data.datasets.map(async (dataset) => {
        const datasetData = await getOneParkhausData(dataset.parkhausId, timeframe);
        let isFull = false;
        let fullTime = '';

        for (let i = 0; i < datasetData.length; i++) {
            if (datasetData[i] >= 90) {
                isFull = true;
                fullTime = labels[i];
                break;
            }
        }

        if (isFull) {
            interpretations.push(
                `<b>Parkhaus ${dataset.label}</b> war zuletzt zum Zeitpunkt <b>${fullTime}</b> voll.`
            );
        }
    }));

    const interpretationContainer = document.getElementById('interpretation-container');
    let interpretationsHTML = interpretations.length > 0 ? interpretations.join('<br>') : 'Keine besonderen Hinweise für die Auslastung.';
    interpretationContainer.innerHTML = `<p class='auflistungpp'>${interpretationsHTML}</p>`;
}


// Event-Listener für die Buttons
document.getElementById('btnDay').addEventListener('click', async function () {
    await loadData('day');
    updateChart('day');
});

document.getElementById('btnWeek').addEventListener('click', async function () {
    await loadData('72h');
    updateChart('72h');
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
    generateInterpretations();  // Generiere Interpretationen nachdem die Daten vollständig geladen sind (für 24 Stunden)
}

// Initiale Daten laden (Tagesansicht)
loadData('day');
