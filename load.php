<?php
// DB-Verbindungsdaten aus externer Datei laden
require_once 'config.php';

$loadData = include('transform.php');

// Debugging-Ausgabe zur Überprüfung der transformierten Daten
echo '<pre>';
print_r($loadData);
echo '</pre>';

// Beispiel-Daten, die eingefügt werden sollen (ersetze sie durch die transformierten Daten aus der API)
$item = [
    'park_id' => 'zuerichparkhausalbisriederplatz',
    'state' => 'open',
    'free' => 65
];

// Debugging-Ausgabe zur Überprüfung der Daten
echo '<pre>';
print_r($item);
echo '</pre>';

try {
    // Datenbankverbindung mit PDO herstellen
    $pdo = new PDO($dsn, $username, $password, $options);

    // SQL-Abfrage für das Einfügen eines neuen Datensatzes in die Tabelle ParkhausVariabel
    $sql = "INSERT INTO ParkhausVariabel (park_id, state, free) VALUES (?, ?, ?)";

    // Die PDO-Methode prepare() bereitet die SQL-Abfrage für die Ausführung vor.
    $stmt = $pdo->prepare($sql);

    // Debugging-Ausgabe vor dem Ausführen der Abfrage
    echo "Daten, die eingefügt werden sollen: " . json_encode([$item['park_id'], $item['state'], $item['free']]) . "<br>";

    // Die PDO-Methode execute() führt die vorbereitete SQL-Abfrage aus.
    foreach ($loadData as $item) {
        $result = $stmt->execute([
            $item['park_id'],   // ID des Parkhauses
            $item['state'],     // Aktueller Zustand des Parkhauses (z.B. open, closed)
            $item['free']       // Anzahl der freien Parkplätze
        ]);
    }

    // Wenn die Abfrage erfolgreich war, wird ein JSON-Objekt mit dem Wert 'true' zurückgegeben.
    if ($result) {
        echo json_encode($result); // Erfolgsmeldung (true)
    } else { 
        echo json_encode(['error' => "Daten konnten nicht eingefügt werden."]);
    }
} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>
