function getScoresVector(callback) 
{
    // Crée une requête AJAX
    /*var xhr = new XMLHttpRequest();
    xhr.open('GET', './Controleurs/tableau.php', true);
  
    // Définit la fonction de rappel pour la réponse de la requête AJAX
    xhr.onreadystatechange = function() {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          // Parse la réponse JSON
          var scores = JSON.parse(xhr.responseText);
          
          // Appelle la fonction de rappel avec le vecteur de valeurs
          callback(scores);
        } else {
          // Gère les erreurs de la requête AJAX
          console.error('Erreur lors de la récupération des scores : ' + xhr.status);
        }
      }
    };
  
    // Envoie la requête AJAX
    xhr.send();*/


    $.ajax({
      url: './BD/RedirectionModele.php',
      type: 'POST',
      dataType: 'json',
      data: {
          action: 'recupereScore',
      },
      success: function(scores) {
          // Traitement des scores
          callback(scores);
      },
      error: function(xhr, status, error) {
          console.error('Erreur lors de la récupération des scores : ' + error);
      }
  });
}

function afficherScores() 
{
    const scoresTable = document.getElementById('scoresTable');
    scoresTable.innerHTML = ''; // Efface le contenu précédent
  
    // Définissez votre vecteur de scores ici
    var scores = [];
  
    getScoresVector(function (result) {
      scores = result || []; // Assurez-vous que scores est un tableau valide
      // Utilisez le vecteur de valeurs (scores) ici
      console.log(scores);
  
      // Crée les en-têtes des colonnes pour les jeux
      const jeux = ['BallJumping', 'Overcook', 'LePotagerDeJerry', 'PacMan'];
      const headerRow = scoresTable.insertRow();
  
      jeux.forEach(jeu => {
        const jeuHeader = headerRow.insertCell();
        jeuHeader.textContent = jeu.toUpperCase();
      });
  
      // Obtient le nombre maximum de scores pour un jeu donné donc si 5 scores pour un jeux 5 lignes
      let maxScores = 0;
      jeux.forEach(jeu => {
        const jeuScores = scores.filter(score => score.NomJeux === jeu);
        if (jeuScores.length > maxScores) {
          maxScores = jeuScores.length;
        }
      });
  
      for (let i = 0; i < maxScores; i++) {
        const row = scoresTable.insertRow();
  
        jeux.forEach(jeu => {
          const scoreCell = row.insertCell();
          const jeuScores = scores.filter(score => score.NomJeux === jeu);
  
          if (jeuScores[i]) {
            scoreCell.textContent = jeuScores[i].pseudo + ' : ' + jeuScores[i].score;
          }
        });
      }
    });
}
  
afficherScores();