<?php
include 'modele.php';

if (isset($_POST['action'])) 
{
    $action = $_POST['action'];
    switch ($action) 
    {
        case 'AjoutScore':
            $score = $_POST['score'];
            $pseudo = $_POST['pseudo'];
            $nomJeu = $_POST['NomJeux'];
            AjoutScore($score, $pseudo, $nomJeu);
            break;
        case 'AjoutUser':
            $username = $_POST['username'];
            $password = $_POST['password'];
            $resultat = AjoutUser($username, $password);
            break;

        case 'VerifCO':
            $username = $_POST['username'];
            $password = $_POST['password'];
            $resultat = VerifCO($username, $password);
            break;

        case 'recupereScore':
            $resultat = RecupereScores();
    }

    // Retourner le résultat
    echo json_encode($resultat);
}
