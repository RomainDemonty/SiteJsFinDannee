<?php
include './modele.php';

$conn = CONNECT();

// Récupération des scores depuis la table scores
$sql = "SELECT NomJeux,pseudo,score FROM score ORDER BY score DESC";
$result = $conn->query($sql);

$scores = array();

// Parcours des résultats de la requête
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $scores[] = $row;
    }
}

// Fermeture de la connexion à la base de données
$conn->close();

// Envoie des données au format JSON
header('Content-Type: application/json');
echo json_encode($scores);
