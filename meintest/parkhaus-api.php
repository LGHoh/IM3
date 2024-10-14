
<?php

// Datenbankkonfiguration einbinden
require_once '../config.php';

// Header setzen, um JSON-Inhaltstyp zurückzugeben
header('Content-Type: application/json');

// Den Standortparameter aus der URL holen
if (isset($_GET['park_id'])) {
    $park_id = $_GET['park_id'];
} else {
    $park_id = 'zuerichparkhausjelmoli'; // Standard-Parkhaus-ID
}

// Überprüfen, ob der Parkhaus-ID-Parameter angegeben wurde
if (empty($park_id)) {
    echo json_encode(['error' => 'Parkhaus-ID wird benötigt.']);
    exit;
}

try {
    // Erstellt eine neue PDO-Instanz mit der Konfiguration aus config.php
    $pdo = new PDO($dsn, $username, $password, $options);

    // SQL-Query, um die durchschnittliche Auslastung pro Stunde zu berechnen
    // Wir führen eine JOIN-Abfrage mit der Tabelle ParkhausStationaer durch, um die Gesamtkapazität zu erhalten
    $sql = "
        SELECT 
            HOUR(pv.timestamp) AS hour,
            AVG(pv.free) AS avg_free,
            ps.total AS total_capacity,
            (ps.total - AVG(pv.free)) AS avg_occupied,
            ((ps.total - AVG(pv.free)) / ps.total) * 100 AS avg_utilization
        FROM ParkhausVariabel pv
        JOIN ParkhausStationaer ps ON pv.park_id = ps.id  -- Verknüpfe die beiden Tabellen anhand der Parkhaus-ID
        WHERE pv.park_id = ?   -- Filtert nach der Parkhaus-ID
        GROUP BY HOUR(pv.timestamp), ps.total
        ORDER BY hour ASC
    ";

    // Bereitet die SQL-Anweisung vor
    $stmt = $pdo->prepare($sql);

    // Führt die Abfrage mit der Parkhaus-ID aus
    $stmt->execute([$park_id]);

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