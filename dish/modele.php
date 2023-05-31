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
    $jeu = $_POST['jeu'];

    // Vérifier si le score doit être inséré
    $sql = "SELECT score FROM table_scores WHERE pseudo = '$pseudo' AND jeu = '$jeu'";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $existingScore = $row['score'];

        if ($score > $existingScore) {
            // Mettre à jour le score existant
            $sqlUpdate = "UPDATE table_scores SET score = $score WHERE pseudo = '$pseudo' AND jeu = '$jeu'";
            $conn->query($sqlUpdate);
            echo "Score mis à jour avec succès.";
        } else {
            echo "Le score existant est supérieur ou égal, pas d'insertion nécessaire.";
        }
    } else {
        // Insérer le nouveau score
        $sqlInsert = "INSERT INTO table_scores (score, pseudo, jeu) VALUES ($score, '$pseudo', '$jeu')";
        $conn->query($sqlInsert);
        echo "Score inséré avec succès.";
    }

    $conn->close();
}

function AjoutUser($username, $password)
{
    echo 'Testttttttttttttttttttttttttt';
    $conn = CONNECT();

    if ($conn->connect_error) {
        die("Connexion échouée: " . $conn->connect_error);
    }

    // Récupérer les données envoyées via AJAX
    $username = $_POST['username'];
    $password = $_POST['password'];

    // Effectuer l'insertion dans la base de données
    $sql = "INSERT INTO utilisateur (pseudo,mdp) VALUES ('$username', '$password')";

    if ($conn->query($sql) === TRUE) {
        echo "Insertion réussie";
    } else {
        echo "Erreur lors de l'insertion: " . $conn->error;
    }

    $conn->close();
}

function VerifCO($username, $password)
{
    $conn = CONNECT();

    if ($conn->connect_error) {
        die("Connexion échouée: " . $conn->connect_error);
    }

    $sql = "SELECT pseudo FROM utilisateur WHERE pseudo = '$username' AND mdp = '$password'";
    $result = $con->query($sql);

    if($result)
    {
        //Prendre la ligne résultante de la requête 
        $row = $result -> fetch_row();
        if($row)
        {
            echo "Les identifiants sont correctes";
            //$_SESSION['connexion'] = true;
        }
        else
        {
            echo "Les identifiants sont faux";
        }
    }

    //ferme la base de donner
    $conn->close();
    //renvoi ce que la requete a trouver donc le pseudo
    return $row;
}
