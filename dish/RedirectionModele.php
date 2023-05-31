<?php
include 'modele.php';

if (isset($_POST['action'])) {
    $action = $_POST['action'];
    //echo "Test";
    switch ($action) {
        case 'AjoutScore':
            $score = $_POST['score'];
            $pseudo = $_POST['pseudo'];
            $action = $_POST['NomJeux'];
            AjoutScore($score, $pseudo, $NomJeux);
            break;

        case 'AjoutUser':
            $username = $_POST['username'];
            $password = $_POST['password'];
            AjoutUser($username, $password);
            break;

        case 'VerifCO':
            $username = $_POST['username'];
            $password = $_POST['password'];
            
            header("Location: ../index.html");

            $resultat = VerifCO($username, $password);

            break;
    }
    // Retourner le résultat
    echo "Bonjour";
    //echo json_encode($resultat);
}

?>
