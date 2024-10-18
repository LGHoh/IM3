<?php
// DB-Verbindungsdaten aus externer Datei laden
require_once 'config.php';

// ------------------------------------------
// Abfrage aller Daten aus der Tabelle ParkhausVariabel
if (isset($_GET['userlist'])) {
  $pdo = new PDO($dsn, $username, $password, $options);

  $sql = "SELECT * FROM ParkhausVariabel";
  $stmt = $pdo->prepare($sql);
  $stmt->execute();
  $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

  echo json_encode($users);
}

// ------------------------------------------
// Die Daten aus dem POST-Request werden in der Variablen $item gespeichert.
$item = $_POST;

// Abfrage eines Datensatzes mit park_id
if (isset($item['read'])) {
  try {
    $pdo = new PDO($dsn, $username, $password, $options);

    $id = $item['park_id']; // Ändere auf park_id
    $sql = "SELECT * FROM ParkhausVariabel WHERE park_id = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$id]);
    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    echo json_encode($result);
  } catch (PDOException $e) {
    echo json_encode($e->getMessage());
  }
}

// ------------------------------------------
// Abfrage aller Datensätze, die den String in name oder address enthalten
if (isset($item['search'])) {
  try {
    $pdo = new PDO($dsn, $username, $password, $options);

    $string = $item['string'];
    $sql = "SELECT * FROM ParkhausStationär WHERE name LIKE ? OR address LIKE ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute(["%$string%", "%$string%"]);
    $searchResults = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($searchResults);
  } catch (PDOException $e) {
    echo json_encode($e->getMessage());
  }
}
?>