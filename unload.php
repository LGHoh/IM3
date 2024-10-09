
<?php
// DB-Verbindungsdaten aus externer Datei laden
require_once '../config.php';

// ------------------------------------------
// Abfrage aller Daten aus der Tabelle User
// Wenn der Parameter 'userlist' in der URL vorhanden ist (...?userlist), dann ...
if (isset($_GET['userlist'])) {
  // Datenbankverbindung mit PDO herstellen
  // Mit den Variablen aus der Datei config.php wird eine Datenbankverbindung.
  // Dazu wird ein PDO-Objekt erstellt und in der Variablen $pdo gespeichert.
  $pdo = new PDO($dsn, $username, $password, $options);

  // Die SQL-Abfrage wird in der Variablen $sql gespeichert.
  // In diesem Fall wird eine Abfrage für alle Spalten und Zeilen der Tabelle User erstellt.
  $sql = "SELECT * FROM User";

  // Die Methode prepare() bereitet die SQL-Abfrage für die Ausführung vor.
  // Das Ergebnis wird in der Variablen $stmt gespeichert.
  $stmt = $pdo->prepare($sql);

  // Die PDO-Methode execute() führt die vorbereitete SQL-Abfrage aus.
  $stmt->execute();

  // Die PDO-Methode fetchAll() gibt alle Zeilen der Abfrage zurück.
  // Die Konstante PDO::FETCH_ASSOC gibt an, dass die Zeilen als assoziatives Array zurückgegeben werden sollen.
  $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

  // Die Funktion json_encode() konvertiert das assoziative Array in ein JSON-Objekt.
  echo json_encode($users);
}

// ------------------------------------------
// Die Daten aus dem POST-Request werden in der Variablen $item gespeichert.
// $_POST ist ein vordefiniertes Array in PHP, das die Daten aus einem POST-Request enthält.
$item = $_POST;


// Abfrage eines Datensatzes mit id
// Wenn der Parameter 'read' (hier: name-Parameter des Formular-Buttons) in den Daten vorhanden ist, dann ...
if (isset($item['read'])) {
  // try-catch-Block wird ausgeführt, um Fehler abzufangen.
  try {
    // Datenbankverbindung mit PDO herstellen
    $pdo = new PDO($dsn, $username, $password, $options);

    // Der Wert des 'id'-Parameters wird in die Variable $id gespeichert.
    $id = $item['id'];

    // Die SQL-Abfrage wird in der Variablen $sql gespeichert.
    // In diesem Fall wird eine Abfrage für alle Spalten und Zeilen der Tabelle User erstellt, 
    //  bei denen der Wert aus der DB-Tabellenspalte 'id' mit dem Wert des übertragennen 'id'-Parameters übereinstimmt.
    //  Der Wert des 'id'-Parameters wird in der Abfrage durch ein Fragezeichen ersetzt.
    //  Die Fragezeichen werden später durch die Werte des Arrays in der Methode execute() ersetzt.
    $sql = "SELECT * FROM User WHERE id = ?";

    // Die PDO-Methode prepare() bereitet die SQL-Abfrage für die Ausführung vor.
    $stmt = $pdo->prepare($sql);

    // Die PDO-Methode execute() führt die vorbereitete SQL-Abfrage aus.
    // Das Array in der Methode execute() enthält die Werte, die die Fragezeichen in der SQL-Abfrage ersetzen.
    // In diesem Fall wird nur ein Wert, der des 'id'-Parameters in das Array eingefügt.
    $stmt->execute([$id]);

    // Die PDO-Methode fetch() gibt die erste Zeile der Abfrage zurück.
    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    // Die Funktion json_encode() konvertiert das assoziative Array in ein JSON-Objekt.
    echo json_encode($result);
  } catch (PDOException $e) {
    // Wenn ein Fehler auftritt, wird die Fehlermeldung als JSON-Objekt zurückgegeben.
    echo json_encode($e->getMessage());
  }
}

// ------------------------------------------
// Abfrage aller Datensätze, die den String $string in firstname, lastname oder email enthalten
// Wenn der Parameter 'search' in den Daten vorhanden ist, dann ...
if (isset($item['search'])) {
  try {
    $pdo = new PDO($dsn, $username, $password, $options);

    $string = $item['string'];

    // Die SQL-Abfrage wird in der Variablen $sql gespeichert.
    // In diesem Fall wird eine Abfrage für alle Spalten und Zeilen der Tabelle User erstellt,
    //  bei denen der Wert aus der DB-Tabellenspalte 'firstname', 'lastname' oder 'email' mit dem Wert des übertragennen 'string'-Parameters übereinstimmt.
    //  Der Wert des 'string'-Parameters wird in der Abfrage durch ein Fragezeichen ersetzt.
    //  Die Fragezeichen werden später durch die Werte des Arrays in der Methode execute() ersetzt.
    $sql = "SELECT * FROM User WHERE firstname LIKE ? OR lastname LIKE ? OR email LIKE ?";

    $stmt = $pdo->prepare($sql);

    // Die PDO-Methode execute() führt die vorbereitete SQL-Abfrage aus.
    // Das Array in der Methode execute() enthält die Werte, die die Fragezeichen in der SQL-Abfrage ersetzen.
    // In diesem Fall wird der Wert des 'string'-Parameters dreimal in das Array eingefügt.
    $stmt->execute(["%$string%", "%$string%", "%$string%"]);
    $searchResults = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($searchResults);
  } catch (PDOException $e) {
    echo json_encode($e->getMessage());
  }
}
