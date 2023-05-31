<?php

function CONNECT()
{
    $base = mysqli_connect('localhost', 'root', '', 'giki');
    return $base;
}

function AjoutScore($score, $pseudo, $NomJeux)
{
    $conn = CONNECT();

    // Récupérer les données envoyées depuis JavaScript
    $score = $_POST['score'];
    $pseudo = $_POST['pseudo'];
    $jeu = $_POST['NomJeux'];

    // Vérifier si le score doit être inséré
    $sql = "SELECT score FROM score WHERE pseudo = '$pseudo' AND NomJeux = '$jeu'";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $existingScore = $row['score'];

        if ($score > $existingScore) {
            // Mettre à jour le score existant
            $sqlUpdate = "UPDATE score SET score = $score WHERE pseudo = '$pseudo' AND NomJeux = '$jeu'";
            $conn->query($sqlUpdate);
            echo "Score mis à jour avec succès.";
        } else {
            echo "Le score existant est supérieur ou égal, pas d'insertion nécessaire.";
        }
    } else {
        // Insérer le nouveau score
        $sqlInsert = "INSERT INTO score (NomJeux,pseudo,score) VALUES ('$jeu','$pseudo',$score )";
        $conn->query($sqlInsert);
        echo "Score inséré avec succès.";
    }

    $conn->close();
}
