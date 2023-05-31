<?php
// Connexion à la base de données
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "giki";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connexion échouée: " . $conn->connect_error);
}

// Récupérer les données envoyées via AJAX
$name = $_POST['name'];
$mdp = $_POST['mdp'];
$number = $_POST['nombre'];

// Effectuer l'insertion dans la base de données
$sql = "INSERT INTO utilisateur (pseudo, mdp , NumPhoto) VALUES ('$name', '$mdp', $number)";

if ($conn->query($sql) === TRUE) {
    echo "Insertion réussie";
} else {
    echo "Erreur lors de l'insertion: " . $conn->error;
}

$conn->close();
