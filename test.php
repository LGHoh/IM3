<?php

// Die Konfigurationsdatei laden
require_once 'config.php';

try {
    // Versuch, eine Verbindung zur Datenbank herzustellen
    $pdo = new PDO($dsn, $username, $password, $options);
    echo "Verbindung zur Datenbank erfolgreich!";
} catch (PDOException $e) {
    // Wenn die Verbindung fehlschlägt, den Fehler anzeigen
    echo "Verbindung fehlgeschlagen: " . $e->getMessage();
}


echo '<pre>' . htmlspecialchars($response) . '</pre>';

