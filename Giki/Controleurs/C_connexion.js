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
             
        },
        error: function(xhr, status, error) {
             //showMessage('Une erreur s\'est produite lors de l\'envoi des données');
             console.log("rater");
        }
    });
}

