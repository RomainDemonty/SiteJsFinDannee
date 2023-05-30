<?php
include './Controleurs/modele.php';

if (isset($_POST['action'])) {
    $action = $_POST['action'];

    switch ($action) {
        case 'AjoutScore':
            $score = $_POST['score'];
            $pseudo = $_POST['pseudo'];
            $action = $_POST['NomJeux'];
            AjoutScore($score, $pseudo, $NomJeux);
            break;
    }
    // Retourner le résultat
    echo json_encode($resultat);
}
