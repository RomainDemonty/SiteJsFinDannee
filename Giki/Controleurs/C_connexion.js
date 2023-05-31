$(document).ready(function() {
    var form = $('#FORM_CO');

    form.submit(function(e) {
        e.preventDefault();

        var BDD = 1;
        $('#erreur_pseudo').html("");
        $('#erreur_mdp').html("");

        let pseudo = $('#pseudo').val();
        let mdp = $('#mdp').val();

        let regexcarac = /^[a-zA-Z\s]+$/;

        if (!regexcarac.test(pseudo)) {
            BDD = 0;
    
            $('#erreur_pseudo').html("Ne doit contenir que des lettres").css('color', 'red');
            
            if (pseudo.length === 0) {
                $('#erreur_pseudo').html("Attention, le champ est vide").css('color', 'red');
            }
        }

        if (mdp.length < 5) {
            BDD = 0;
    
            $('#erreur_mdp').html("La taille du mot de passe doit être supérieure à 5 caractères").css('color', 'red');
    
            if (mdp.length === 0) {
                $('#erreur_mdp').html("Attention, le champ est vide").css('color', 'red');
            }
        }
        
        if (BDD === 1) {
            dataRedirection(pseudo, mdp);
            console.log("Accès à la base de données autorisé");
        }
        else
        {
            console.log("Accès à la base de données refusé suite aux erreurs de saisie des données.");
        }

    });
});

function dataRedirection(username, password) 
{
    $.ajax({
        type: 'POST',
        url: './BD/RedirectionModele.php',
        data: { action: 'VerifCO', username: username, password: password },
        success: function(response) {
             //showMessage('Données envoyées avec succès');
             //Réinitialiser le formulaire ici si nécessaire
             console.log(response);
             setCookie("pseudo", username, 1);
             window.location.href = "index.html";
        },
        error: function(xhr, status, error) {
             //showMessage('Une erreur s\'est produite lors de l\'envoi des données');
             console.log("rater");
        }
    });
}

//Fonction pour définir un cookie
function setCookie(name, value, days)
{
    var expires = "";
    if (days) 
    {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}


// Fonction pour récupérer la valeur d'un cookie
function getCookie(name) 
{
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1, c.length);
      }
      if (c.indexOf(nameEQ) == 0) {
        return c.substring(nameEQ.length, c.length);
      }
    }
    return null;
}