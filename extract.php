<?php

function fetchParkingData() {
    // Die URL der API, von der wir die Daten abrufen möchten
    $url = "https://api.parkendd.de/Zuerich";

    // Initialisiert eine cURL-Sitzung
    $ch = curl_init($url);

    // Setzt Optionen für die cURL-Sitzung
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true); // Gibt die Antwort als String zurück, anstatt sie direkt auszugeben
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); // Deaktiviert die SSL-Zertifikatsprüfung (falls nötig)

    // Führt die cURL-Sitzung aus und speichert den Inhalt der Antwort
    $response = curl_exec($ch);

    // Überprüft, ob die cURL-Anfrage erfolgreich war
    if (curl_errno($ch)) {
        echo 'Fehler bei der API-Abfrage: ' . curl_error($ch);
        return null;
    }

    // Schließt die cURL-Sitzung
    curl_close($ch);

    // Dekodiert die JSON-Antwort in ein PHP-Array und überprüft, ob es gültig ist
    $data = json_decode($response, true);

    if (json_last_error() !== JSON_ERROR_NONE) {
        echo 'Fehler beim Dekodieren der JSON-Antwort: ' . json_last_error_msg();
        return null;
    }

    return $data; // Gibt das dekodierte Array zurück
}

// Ruft die Parkdaten ab und gibt sie aus, wenn dieses Skript ausgeführt wird
$data = fetchParkingData();


/*if ($data) {
    echo '<pre>';
    print_r($data); // Ausgabe der Daten zu Testzwecken, um die Struktur zu sehen
    echo '</pre>';
} else {
    echo 'Es wurden keine gültigen Daten von der API erhalten.';
}*/

return $data; // Gibt die Parkdaten zurück

?>
