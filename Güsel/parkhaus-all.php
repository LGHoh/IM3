
<?php

// Datenbankkonfiguration einbinden
require_once '/config.php';

// Header setzen, um JSON-Inhaltstyp zurückzugeben
header('Content-Type: application/json');


try {
    // Erstellt eine neue PDO-Instanz mit der Konfiguration aus config.php
    $pdo = new PDO($dsn, $username, $password, $options);

    // SQL-Query, um die durchschnittliche Auslastung pro Stunde zu berechnen
    // Wir führen eine JOIN-Abfrage mit der Tabelle ParkhausStationär durch, um die Gesamtkapazität zu erhalten
    $sql = "SELECT * FROM ParkhausStationaer ORDER BY `ParkhausStationaer`.`total` DESC LIMIT 9";

    // Bereitet die SQL-Anweisung vor
    $stmt = $pdo->prepare($sql);

    // Führt die Abfrage mit der Parkhaus-ID aus
    $stmt->execute();

    // Holt alle passenden Einträge
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Überprüfen, ob Ergebnisse gefunden wurden
    if ($results) {
        // Gibt die Ergebnisse im JSON-Format zurück
        echo json_encode($results);
    } else {
        // Keine Daten gefunden
        echo json_encode(['error' => 'Keine Daten für das angegebene Parkhaus gefunden.']);
    }

} catch (PDOException $e) {
    // Gibt eine Fehlermeldung zurück, wenn etwas schiefgeht
    echo json_encode(['error' => $e->getMessage()]);
}
?>