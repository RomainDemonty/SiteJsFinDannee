<?php

include './modele.php';

$conn = CONNECT();

// Récupération des données du formulaire
$nom = $_POST['nom'];
$avatar = $_POST['avatar'];
$motdepasse = $_POST['motdepasse'];
// Effectuez les vérifications supplémentaires si nécessaire

// Insérez les données dans la base de données
$sql = "INSERT INTO utilisateurs (pseudo, mdp, NumPhoto) VALUES ('$nom', '$motdepasse', '$avatar')";

/*
if ($conn->query($sql) === TRUE) {
    echo "Inscription réussie !";
} else {
    echo "Erreur lors de l'inscription : " . $conn->error;
}
*/

$conn->close();

header("Location: ../DossierDeTest/index.html");
exit;
