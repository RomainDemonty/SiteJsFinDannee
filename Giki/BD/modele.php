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
    $NomJeux = $_POST['NomJeux'];

    // Vérifier si le score doit être inséré
    $sql = "SELECT score FROM score WHERE pseudo = '$pseudo' AND NomJeux = '$NomJeux'";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $existingScore = $row['score'];

        if ($score > $existingScore) {
            // Mettre à jour le score existant
            $sqlUpdate = "UPDATE score SET score = $score WHERE pseudo = '$pseudo' AND NomJeux = '$NomJeux'";
            $conn->query($sqlUpdate);
            echo "Score mis à jour avec succès.";
        } else {
            echo "Le score existant est supérieur ou égal, pas d'insertion nécessaire.";
        }
    } else {
        // Insérer le nouveau score
        $sqlInsert = "INSERT INTO score (score, pseudo, NomJeux) VALUES ($score, '$pseudo', '$NomJeux')";
        $conn->query($sqlInsert);
        echo "Score inséré avec succès.";
    }

    $conn->close();
}

function AjoutUser($username, $password)
{
    $result = 0;
    $conn = CONNECT();

    if ($conn->connect_error) {
        die("Connexion échouée: " . $conn->connect_error);
    }

    $sql = "INSERT INTO utilisateur (pseudo,mdp) VALUES ('$username', '$password')";
    if ($conn->query($sql) == false) {
        $result = -1;
        /*$erreur = $con->error;
        if(strpos($erreur, '1062') != false){
            $result = -1;
        }*/
    } else {
        $result = 1;
    }

    $conn->close();
    return $result;
}

function VerifCO($username, $password)
{
    $res = 0;
    $conn = CONNECT();

    if ($conn->connect_error) {
        die("Connexion échouée: " . $conn->connect_error);
    }

    //envoi une requete a la bdd
    $sql = "SELECT pseudo FROM utilisateur WHERE pseudo = '$username' AND mdp = '$password'";

    //récupère le résultat
    $result = mysqli_query($conn, $sql);
    if ($result) 
    {
        //Prendre la ligne résultante de la requête 
        $row = $result->fetch_row();
        
        if ($row) 
            $res = 1;
        else 
            $res = -1;
    }

    //ferme la base de donner
    $conn->close();

    //renvoi ce que la requete a trouver donc le pseudo
    return $res;
}

function RecupereScores()
{
    $conn = CONNECT();

    // Récupération des scores depuis la table scores
    $sql = "SELECT NomJeux, pseudo, score FROM score WHERE score <> 0 ORDER BY score DESC;";
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

    return $scores;
}
