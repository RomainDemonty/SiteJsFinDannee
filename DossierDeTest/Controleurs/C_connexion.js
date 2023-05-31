$(document).ready(function() {
    let form = $('#FORM_CO');
    let BDD = 1;

    form.submit(function(e) {
        e.preventDefault();
        
        let pseudo = $('#pseudo').val();
        let mdp = $('#mdp').val();

        console.log(pseudo);
        console.log(mdp);

        let regexcarac = /^[a-zA-Z\s]+$/;

        if (!regexcarac.test(pseudo)) {
            BDD = 0;
    
            $('#erreur').html("Ne doit contenir que des lettres").css('color', 'red');
            
            if (pseudo.length === 0) {
                $('#erreur').html("Attention, le champ est vide").css('color', 'red');
            }
        }

        if (mdp.length < 5) {
            BDD = 0;
    
            $('#erreur_prenom').html("La taille du mot de passe doit être supérieure à 5 caractères").css('color', 'red');
    
            if (mdp.length === 0) {
                $('#erreur_prenom').html("Attention, le champ est vide").css('color', 'red');
            }
        }

        console.log('avant bd');
        
        if (BDD === 1) {
            dataRedirection(pseudo, mdp);
            console.log("Accès à la base de données autorisé");
        }
    });

    function dataRedirection(username, password) {
        $.ajax({
            type: 'POST',
            url: 'RedirectionModele.php',
            data: { action: 'Verif', username: username, password: password },
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
});

