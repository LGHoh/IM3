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

// Setup für die Daten (wird später mit API-Daten gefüllt)
const data = {
    labels: dayLabels, // Start mit Tagesansicht
    datasets: [
        {
            label: 'Hard',
            data: [], // Hier kommen die API-Daten rein
            borderColor: 'rgba(54, 162, 235, 1)', // Blau
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            fill: false,
            parkhausId: "zuerichparkhaushardauii"
        },
        {
            label: 'Uszsued',
            data: [], // Hier kommen die API-Daten rein
            borderColor: 'rgba(255, 99, 132, 1)', // Rot
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            fill: false,
            parkhausId: "zuerichparkplatzuszsued"
        },
        {
            label: 'Uni Irchel',
            data: [], // Hier kommen die API-Daten rein
            borderColor: 'rgba(75, 192, 192, 1)', // Grün
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            fill: false,
            parkhausId: "zuerichparkhausuniirchel"
        },
        {
            label: 'Haustalgarten',
            data: [], // Hier kommen die API-Daten rein
            borderColor: 'rgba(153, 102, 255, 1)', // Lila
            backgroundColor: 'rgba(153, 102, 255, 0.2)',
            fill: false,
            parkhausId: "zuerichparkhaustalgarten"
        },
        {
            label: 'Opéra',
            data: [], // Hier kommen die API-Daten rein
            borderColor: 'rgba(255, 206, 86, 1)', // Gelb
            backgroundColor: 'rgba(255, 206, 86, 0.2)',
            fill: false,
            parkhausId: "zuerichparkhausopéra"
        },
        {
            label: 'Urania',
            data: [], // Hier kommen die API-Daten rein
            borderColor: 'rgba(54, 162, 235, 1)', // Blau
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            fill: false,
            parkhausId: "zuerichparkhausurania"
        },
        {
            label: 'Parkside',
            data: [], // Hier kommen die API-Daten rein
            borderColor: 'rgba(255, 159, 64, 1)', // Orange
            backgroundColor: 'rgba(255, 159, 64, 0.2)',
            fill: false,
            parkhausId: "zuerichparkhausparkside"
        },
        {
            label: 'Helvetiaplatz',
            data: [], // Hier kommen die API-Daten rein
            borderColor: 'rgba(199, 199, 199, 1)', // Grau
            backgroundColor: 'rgba(199, 199, 199, 0.2)',
            fill: false,
            parkhausId: "zuerichparkhaushelvetiaplatz"
        },
        {
            label: 'Jelmoli',
            data: [], // Hier kommen die API-Daten rein
            borderColor: 'rgba(75, 192, 192, 1)', // Grün
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            fill: false,
            parkhausId: "zuerichparkhausjelmoli"
        }
    ]
};

const config = {
    type: 'line',
    data: data,
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'right',
                labels: {
                    padding: 50,  // Abstand zwischen den Legendenpunkten erhöhen
                    color: 'white',  // Farbe der Legende auf Weiß setzen
                    usePointStyle: true  // Verwende Punkte statt Rechtecke in der Legende
                }
            },
                // title: {
                //display: true,
               //text: 'Parkhaus Auslastung',
                //color: 'white'  // Farbe des Titels auf Weiß setzen
          //  },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        const dataset = context.dataset;
                        const parkhausName = dataset.label; // Holt den Namen des Parkhauses
                        const utilization = parseFloat(context.parsed.y).toFixed(1);
                        const maxPlaces = maxCapacity[dataset.parkhausId];
                        const freePlaces = maxPlaces - Math.round((utilization / 100) * maxPlaces);

                        return [
                            `Parkhaus: ${parkhausName}`,  // Fügt den Namen des Parkhauses hinzu
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
                    text: 'Stunden des Tages',
                    color: 'white'
                },
                ticks: {
                    color: 'rgba(220, 220, 220, 1)',
                    autoSkip: true,
                    maxTicksLimit: 12
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
    console.log("Raw Response:", response);

    try {
        const data = await response.json();
        if (data.error) {
            console.error(data.error);
            return [];
        }

        return data.map(entry => {
            const utilization = parseFloat(entry.utilization);
            if (isNaN(utilization)) {
                console.warn(`Invalid utilization value for parkhausId ${parkhausId}:`, entry.utilization);
                return 0;
            }
            return utilization.toFixed(1);
        });
    } catch (e) {
        console.error("Fehler beim Parsen der JSON-Antwort:", e);
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
                `- Parkhaus ${dataset.label} ist zum Zeitpunkt (${fullTime}) voll.`
            );
        }
    }));

    const interpretationContainer = document.getElementById('interpretation-container');
    interpretationContainer.innerHTML = interpretations.length > 0 ? interpretations.join('<br>') : 'Keine besonderen Hinweise für die Auslastung.';
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
