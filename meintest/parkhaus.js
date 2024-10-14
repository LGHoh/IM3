const parkhausListURL = "https://fpellegrini.com/meintest/parkhaus-all.php";

let allDataSets = [];

// getAllParkhausData();
async function getAllParkhausData() {
    fetch(parkhausListURL)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            data.forEach(parkhaus => {
                let parkhausId = parkhaus.id;
                let parkhausName = parkhaus.name;
                let parkhausData = getOneParkhausData(parkhausId)
                allDataSets.push({parkhausId: parkhausId, parkhausName: parkhausName, parkhausData: parkhausData});

                console.log(allDataSets);
            });
        })
}


 // Labels für die X-Achse (1 bis 24 Stunden)
 const labels = Array.from({length: 24}, (_, i) => i + 1);

 // Setup für die Daten (wird später mit API-Daten gefüllt)
 const data = {
   labels: labels,
   datasets: [
    {
        label: 'Auslastung Hard (%)',
        data: [], // Hier kommen die API-Daten rein
        borderColor: 'rgba(54, 162, 235, 1)', // Blau
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        fill: true
      },{
        label: 'Auslastung Messe (%)',
        data: [], // Hier kommen die API-Daten rein
        borderColor: 'rgba(54, 162, 235, 1)', // Blau
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        fill: true
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


new Promise(async (resolve, reject) => {
    const p_hard = await getOneParkhausData("zuerichparkhaushardauii")
    parkhausAuslastungChart.data.datasets[0].data = p_hard;

    const p_messe = await getOneParkhausData("zuerichparkhausmessezuerichag")
    parkhausAuslastungChart.data.datasets[1].data = p_messe;

    parkhausAuslastungChart.update();
    resolve(true);
})

 async function getOneParkhausData(parkhausId) {
    let url= "https://fpellegrini.com/meintest/parkhaus-api.php?park_id=" + parkhausId;

    // API-Daten abrufen und Chart aktualisieren
    const response = await fetch(url)

    const data = await response.json();
    if (data.error) {
        console.error(data.error);
        return;
    }

    let utilizationData = data.map(entry => {
        return parseFloat(entry.avg_utilization);
    });

    return utilizationData;
}