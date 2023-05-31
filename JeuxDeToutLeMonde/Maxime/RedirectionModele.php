<?php
include './modele.php';

if (isset($_POST['action'])) {
    $action = $_POST['action'];

    switch ($action) {
        case 'AjoutScore':
            $score = $_POST['score'];
            $pseudo = $_POST['pseudo'];
            $NomJeux = $_POST['NomJeux'];
            $resultat = AjoutScore($score, $pseudo, $NomJeux);
            break;
    }
    // Retourner le résultat
    echo json_encode($resultat);
}
