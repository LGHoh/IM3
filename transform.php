<?php

// Bindet das Skript extract.php für Rohdaten ein, um die Parkplatzdaten abzurufen
$data = include('extract.php');

// Beispielhafte Zuordnung von Parkplatznamen zu Standorten (dies kann angepasst werden, wenn die API diese Daten enthält)
$locationsMap = [
    'Parkplatz A' => 'Zürich Zentrum',
    'Parkplatz B' => 'Zürich West',
    'Parkplatz C' => 'Zürich Nord',
];

// Transformation der Standorte
foreach ($data as $parkplatz) {
    // Zeigt den ursprünglichen Parkplatznamen
    echo "Ursprünglicher Parkplatzname: " . $parkplatz['name'] . "<br>";

    // Umgeformter Standortname basierend auf dem Parkplatznamen
    if (isset($locationsMap[$parkplatz['name']])) {
        $location = $locationsMap[$parkplatz['name']];
    } else {
        $location = 'Unbekannt';
    }

    echo "Transformierter Standort: " . $location . "<br><br>";
}

// Funktion zur Bestimmung des Parkplatzstatus
function determineParkingStatus($status, $freiePlaetze) {
    if ($status === 'geschlossen') {
        return 'Geschlossen';
    } elseif ($freiePlaetze > 0) {
        return 'Verfügbar (' . $freiePlaetze . ' freie Plätze)';
    } else {
        return 'Belegt';
    }
}

// Transformation des Parkplatzstatus
foreach ($data as $parkplatz) {
    // Berechnet und zeigt den Status des Parkplatzes
    $status = determineParkingStatus($parkplatz['status'], $parkplatz['frei']);
    echo "Basierend auf dem Status (" . $parkplatz['status'] . ") und der Anzahl freier Plätze (" . $parkplatz['frei'] . "),<br>";
    echo "Parkplatzstatus Umgeformt: " . $status . "<br><br>";
}

?>
