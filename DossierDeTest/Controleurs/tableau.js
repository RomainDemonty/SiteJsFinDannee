//Test---------------------------------------------------------------//
function getScoresVector(callback) {
    // Crée une requête AJAX
    var xhr = new XMLHttpRequest();
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
    xhr.send();
  }


//Test---------------------------------------------------------------//

/*
const scores = [
    { nom: 'Alice', jeu1: 100, Overcook: 75, LePotagerDeJerry: 90},
    { nom: 'Bob', jeu1: 120, Overcook: 85, LePotagerDeJerry: 110, PacMan : 500 },
    { nom: 'Charlie', jeu1: 95, Overcook: 80, LePotagerDeJerry: 105, PacMan: 800 },
    { nom: 'Adrien', jeu1: 1000, Overcook: 25, LePotagerDeJerry: 69, PacMan : 888 },
    { nom: 'Noa', jeu1: 1000, Overcook: 250, LePotagerDeJerry: 420, PacMan : 8880 },
    { nom: 'Maxime', jeu1: 69, Overcook: 420, LePotagerDeJerry: 1000, PacMan : 888 },
    { nom: 'Romdem', jeu1: 1000, Overcook: 25, LePotagerDeJerry: 69, PacMan : 888 }
  
  ];
*/
//Test//

function afficherScores() {
    const scoresTable = document.getElementById('scoresTable');
    scoresTable.innerHTML = ''; // Efface le contenu précédent
  
    // Définissez votre vecteur de scores ici
    var scores = [];
  
    getScoresVector(function (result) {
      scores = result || []; // Assurez-vous que scores est un tableau valide
      // Utilisez le vecteur de valeurs (scores) ici
      console.log(scores);
  
      // Crée les en-têtes des colonnes pour les jeux
      const jeux = ['jeu1', 'Overcook', 'LePotagerDeJerry', 'PacMan'];
      const headerRow = scoresTable.insertRow();
  
      jeux.forEach(jeu => {
        const jeuHeader = headerRow.insertCell();
        jeuHeader.textContent = jeu.toUpperCase();
      });
  
      for (let i = 0; i < scores.length; i++) {
        const row = scoresTable.insertRow();
  
        jeux.forEach(jeu => {
          const scoreCell = row.insertCell();
          const score = scores[i];
  
          if (score.jeu === jeu) {
            scoreCell.textContent = score.nom + ' : ' + score.score;
          }
        });
      }
    });
  }
  
  afficherScores();