<?php
include 'modele.php';

if (isset($_POST['action'])) {
    $action = $_POST['action'];
    echo "Test";
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
    }
    // Retourner le résultat
    echo json_encode($resultat);
}
