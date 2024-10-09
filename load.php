<?php
// DB-Verbindungsdaten aus externer Datei laden
require_once '../config.php';

// ------------------------------------------
// Die Daten aus dem POST-Request werden in der Variablen $item gespeichert.
// $_POST ist ein vordefiniertes Array in PHP, das die Daten aus einem POST-Request enthält.
$item = $_POST;

// Einfügen eines neuen Datensatzes in die Tabelle ParkhausVariabel
if (isset($item['insert'])) {

  try {
    // Datenbankverbindung mit PDO herstellen
    $pdo = new PDO($dsn, $username, $password, $options);

    // SQL-Abfrage für das Einfügen eines neuen Datensatzes in die Tabelle ParkhausVariabel
    // Die Fragezeichen werden später durch die Werte des Arrays in der Methode execute() ersetzt.
    $sql = "INSERT INTO ParkhausVariabel (park_id, state, free) VALUES (?, ?, ?)";

    // Die PDO-Methode prepare() bereitet die SQL-Abfrage für die Ausführung vor.
    $stmt = $pdo->prepare($sql);

    // Die PDO-Methode execute() führt die vorbereitete SQL-Abfrage aus.
    // Die Werte der Parameter werden in einem Array übergeben.
    $result = $stmt->execute([
      $item['park_id'],   // ID des Parkhauses (alphanumerisch)
      $item['state'],     // Aktueller Zustand des Parkhauses (z.B. open, closed)
      $item['free']       // Anzahl der freien Parkplätze
    ]);

    // Wenn die Abfrage erfolgreich war, wird ein JSON-Objekt mit dem Wert 'true' zurückgegeben.
    if ($result) {
      echo json_encode($result); // Erfolgsmeldung (true)
    } else { 
      // Wenn die Abfrage nicht erfolgreich war, wird ein JSON-Objekt mit einer Fehlermeldung zurückgegeben.
      echo json_encode(['error' => "Daten konnten nicht eingefügt werden."]);
    }
  } catch (PDOException $e) {
    // Wenn ein Fehler auftritt, wird die Fehlermeldung als JSON-Objekt zurückgegeben.
    echo json_encode(['error' => $e->getMessage()]);
  }
}
?>
