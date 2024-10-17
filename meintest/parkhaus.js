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
            label: 'Auslastung Hard',
            data: [], // Hier kommen die API-Daten rein
            borderColor: 'rgba(54, 162, 235, 1)', // Blau
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            fill: false,
            parkhausId: "zuerichparkhaushardauii"
        },
        {
            label: 'Auslastung Uszsued',
            data: [], // Hier kommen die API-Daten rein
            borderColor: 'rgba(255, 99, 132, 1)', // Rot
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            fill: false,
            parkhausId: "zuerichparkplatzuszsued"
        },
        {
            label: 'Auslastung Uni Irchel',
            data: [], // Hier kommen die API-Daten rein
            borderColor: 'rgba(75, 192, 192, 1)', // Grün
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            fill: false,
            parkhausId: "zuerichparkhausuniirchel"
        },
        {
            label: 'Auslastung Haustalgarten',
            data: [], // Hier kommen die API-Daten rein
            borderColor: 'rgba(153, 102, 255, 1)', // Lila
            backgroundColor: 'rgba(153, 102, 255, 0.2)',
            fill: false,
            parkhausId: "zuerichparkhaustalgarten"
        },
        {
            label: 'Auslastung Opéra',
            data: [], // Hier kommen die API-Daten rein
            borderColor: 'rgba(255, 206, 86, 1)', // Gelb
            backgroundColor: 'rgba(255, 206, 86, 0.2)',
            fill: false,
            parkhausId: "zuerichparkhausopéra"
        },
        {
            label: 'Auslastung Urania',
            data: [], // Hier kommen die API-Daten rein
            borderColor: 'rgba(54, 162, 235, 1)', // Blau
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            fill: false,
            parkhausId: "zuerichparkhausurania"
        },
        {
            label: 'Auslastung Parkside',
            data: [], // Hier kommen die API-Daten rein
            borderColor: 'rgba(255, 159, 64, 1)', // Orange
            backgroundColor: 'rgba(255, 159, 64, 0.2)',
            fill: false,
            parkhausId: "zuerichparkhausparkside"
        },
        {
            label: 'Auslastung Helvetiaplatz',
            data: [], // Hier kommen die API-Daten rein
            borderColor: 'rgba(199, 199, 199, 1)', // Grau
            backgroundColor: 'rgba(199, 199, 199, 0.2)',
            fill: false,
            parkhausId: "zuerichparkhaushelvetiaplatz"
        },
        {
            label: 'Auslastung jelmoli',
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
        maintainAspectRatio: false, // Verhältnis nicht beibehalten, damit das Diagramm sich an den Container anpasst
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
                        const utilization = parseFloat(context.parsed.y).toFixed(1);
                        const maxPlaces = maxCapacity[dataset.parkhausId];
                        const freePlaces = maxPlaces - Math.round((utilization / 100) * maxPlaces);

                        return [
                            `Auslastung: ${utilization}%`,
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
                    color: 'white'  // Farbe des Achsentitels auf Weiß setzen
                },
                ticks: {
                    color: 'rgba(200, 200, 200, 0.8)'  // Farbe der Y-Achsen-Beschriftungen auf ein helles Grau setzen
                },
                grid: {
                    color: 'rgba(200, 200, 200, 0.3)',  // Gitternetzlinien in leichtem Grau mit reduzierter Deckkraft
                },
                beginAtZero: true,
                max: 100
            },
            x: {
                title: {
                    display: true,
                    text: 'Stunden des Tages',
                    color: 'white'  // Farbe des Achsentitels auf Weiß setzen
                },
                ticks: {
                    color: 'rgba(220, 220, 220, 1)',  // Farbe der X-Achsen-Beschriftungen auf ein etwas helleres Grau ohne Transparenz setzen
                    autoSkip: true,
                    maxTicksLimit: 12 // Begrenze die Anzahl der angezeigten Ticks, damit nur etwa alle 6 Stunden angezeigt wird
                },
                grid: {
                    color: 'rgba(200, 200, 200, 0.3)',  // Gitternetzlinien in leichtem Grau mit reduzierter Deckkraft
                }
            }
        },
        elements: {
            point: {
                radius: 5,  // Setzt die Punktgröße für die Datenpunkte
                backgroundColor: 'white',  // Hintergrundfarbe der Punkte auf Weiß setzen
                borderColor: 'white'  // Randfarbe der Punkte auf Weiß setzen
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
    console.log("Raw Response:", response);  // Zeigt die rohe Antwort, um zu verstehen, was kommt

    try {
        const data = await response.json();
        if (data.error) {
            console.error(data.error);
            return [];
        }

        // Prozentanzeige auf eine Dezimalstelle runden und das % Symbol hinzufügen
        return data.map(entry => {
            const utilization = parseFloat(entry.utilization);
            if (isNaN(utilization)) {
                console.warn(`Invalid utilization value for parkhausId ${parkhausId}:`, entry.utilization);
                return 0;  // Setze den Wert auf 0, wenn der Wert ungültig ist
            }
            return utilization.toFixed(1);  // Rundet die Nutzung auf eine Dezimalstelle
        });
    } catch (e) {
        console.error("Fehler beim Parsen der JSON-Antwort:", e);
        return [];
    }
}

// Funktion zum Aktualisieren der Chart-Labels und Daten
function updateChart(timeframe) {
    if (timeframe === 'day') {
        parkhausAuslastungChart.data.labels = dayLabels; // Jetzt enthält dayLabels die korrekten Uhrzeiten im Format "00:00", "01:00" usw.
        parkhausAuslastungChart.options.scales.x.title.text = 'Stunden des Tages';
    } else if (timeframe === '72h') {
        parkhausAuslastungChart.data.labels = generate72hLabels();
        parkhausAuslastungChart.options.scales.x.title.text = 'Datum und Uhrzeit';
    }
    parkhausAuslastungChart.update();  // Den Chart aktualisieren
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
}

// Initiale Daten laden (Tagesansicht)
loadData('day');
