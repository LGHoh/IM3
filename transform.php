<?php

// Bindet das Skript extract.php für Rohdaten ein, um die Parkplatzdaten abzurufen
$data = include('extract.php');

// Debugging: Überprüfe, was $data tatsächlich enthält
echo '<pre>';
print_r($data["lots"]); // Gibt den Inhalt von $data aus, um die Struktur zu überprüfen
echo '</pre>';
//die(); // Stoppt die Ausführung hier, um die Ausgabe zu überprüfen

// Beispielhafte Zuordnung von Parkplatznamen zu Standorten (dies kann angepasst werden, wenn die API diese Daten enthält)
$locationsMap = [
    'Parkplatz A' => 'Zürich Zentrum',
    'Parkplatz B' => 'Zürich West',
    'Parkplatz C' => 'Zürich Nord',
];

// Überprüfe, ob $data ein Array ist und die Struktur korrekt ist
if (is_array($data) && isset($data['lots'])) {
    // Transformation der Standorte
    $loadData = [];
    foreach ($data['lots'] as $parkplatz) {
        // Zeigt den ursprünglichen Parkplatznamen

        $state = $parkplatz['state'];
        $free = $parkplatz['free'];
        $id = $parkplatz['id'];

        $loadData[] = [
            'park_id' => $id,
            'state' => $state,
            'free' => $free
        ];

        echo "Ursprünglicher Parkplatzname: " . $parkplatz['name'] . "<br>";

        // Umgeformter Standortname basierend auf dem Parkplatznamen
        if (isset($locationsMap[$parkplatz['name']])) {
            $location = $locationsMap[$parkplatz['name']];
        } else {
            $location = 'Unbekannt';
        }

        echo "Transformierter Standort: " . $location . "<br><br>";
    }
    return $loadData;
} else {
    echo 'Die Datenstruktur ist nicht wie erwartet. Überprüfe die API-Antwort.';
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

// Überprüfe, ob $data ein Array ist und die Struktur korrekt ist
if (is_array($data) && isset($data['lots'])) {
    // Transformation des Parkplatzstatus
    foreach ($data['lots'] as $parkplatz) {
        // Berechnet und zeigt den Status des Parkplatzes
        $status = determineParkingStatus($parkplatz['status'], $parkplatz['frei']);
        echo "Basierend auf dem Status (" . $parkplatz['status'] . ") und der Anzahl freier Plätze (" . $parkplatz['frei'] . "),<br>";
        echo "Parkplatzstatus Umgeformt: " . $status . "<br><br>";
    }
} else {
    echo 'Die Datenstruktur ist nicht wie erwartet. Überprüfe die API-Antwort.';
}

?>
