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

// Zeitrahmen (Tag oder Woche) aus der URL holen
$timeframe = isset($_GET['timeframe']) ? $_GET['timeframe'] : 'day'; // Standard: Tagesansicht

try {
    $pdo = new PDO($dsn, $username, $password, $options);

    // SQL-Query für Tagesansicht (letzte 24 Stunden ohne Aggregation)
    if ($timeframe == 'day') {
        $sql = "
            SELECT 
                HOUR(pv.timestamp) AS hour,
                pv.free,
                ps.total AS total_capacity,
                (ps.total - pv.free) AS occupied,
                ((ps.total - pv.free) / ps.total) * 100 AS utilization,
                pv.timestamp
            FROM ParkhausVariabel pv
            JOIN ParkhausStationaer ps ON pv.park_id = ps.id
            WHERE pv.park_id = ?
              AND pv.timestamp >= NOW() - INTERVAL 24 HOUR
            ORDER BY pv.timestamp ASC
        ";
    } 
    
    
    // SQL-Query für Wochenansicht (letzte 7 Tage ohne Aggregation)
    else if ($timeframe == '72h') {
        $sql = "
            SELECT 
                DATE_FORMAT(pv.timestamp, '%Y-%m-%d %H:00:00') AS dayhour,
                pv.free,
                ps.total AS total_capacity,
                (ps.total - pv.free) AS occupied,
                ((ps.total - pv.free) / ps.total) * 100 AS utilization,
                pv.timestamp
            FROM ParkhausVariabel pv
            JOIN ParkhausStationaer ps ON pv.park_id = ps.id
            WHERE pv.park_id = ?
              AND pv.timestamp >= NOW() - INTERVAL 3 DAY
            ORDER BY pv.timestamp ASC
        ";
    }
    

    // Bereitet die SQL-Anweisung vor
    $stmt = $pdo->prepare($sql);

    // Führt die Abfrage mit der Parkhaus-ID aus
    $stmt->execute([$park_id]);

    // Holt alle passenden Einträge
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Überprüfen, ob Ergebnisse gefunden wurden
    if ($results) {
        echo json_encode($results);
    } else {
        echo json_encode(['error' => 'Keine Daten für das angegebene Parkhaus gefunden.']);
    }

} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>
