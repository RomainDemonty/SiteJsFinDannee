$(document).ready(function() {
    var form = $('#FORM_CO');

    form.submit(function(e) {
        e.preventDefault();

        var BDD = 1;
        let errPseudo = $('#erreur_pseudo').text("");
        let errMdp = $('#erreur_mdp').text("");
        $('#err-connexion').text("");

        let pseudo = $('#pseudo').val();
        let mdp = $('#mdp').val();

        /*let regexcarac = /^[a-zA-Z\s]+$/;

        if (!regexcarac.test(pseudo)) {
            BDD = 0;
    
            $('#erreur_pseudo').html("Ne doit contenir que des lettres").css('color', 'red');
            
            if (pseudo.length === 0) {
                $('#erreur_pseudo').html("Attention, le champ est vide").css('color', 'red');
            }
        }*/

        let regexPseudo = /^([a-zA-Z0-9-]{4,})$/;
        if(pseudo == "" || regexPseudo.test(pseudo) == false)
        {
            BDD = 0;
            if(pseudo == "")
                errPseudo.text("Ce champ ne peut pas être vide!");
            else
            {
                if(pseudo.length < 4)
                    errPseudo.text("Le pseudo doit contenir au moins 4 caracteres...");
                else
                    errPseudo.text("Le pseudo ne peut pas contenir de caracteres speciaux!");
            }
        }

        /*if (mdp.length < 5) {
            BDD = 0;
    
            $('#erreur_mdp').html("La taille du mot de passe doit être supérieure à 5 caractères").css('color', 'red');
    
            if (mdp.length === 0) {
                $('#erreur_mdp').html("Attention, le champ est vide").css('color', 'red');
            }
        }*/

        let regexPassword = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{8,}$/;
        if(mdp == "" || regexPassword.test(mdp) == false)
        {
            BDD = 0;
            if(mdp == "")
            {
                errMdp.text("Un mot de passe est requis!");
            }
            else
            {
                errMdp.text("Mot de passe invalide! (au moins 8 caracteres dont 1 majuscule, 1 chiffre et un caractere spécial)");
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

             if(response == 1)
             {
                console.log("Connexion au compte établie!");

                setCookie("pseudo", username, 1);
                window.location.href = "index.html";
             }
             else if(response == -1 || response == 0)
             {
                console.log("La connexion a échoué...");
                $('#err-connexion').text("Connexion impossible...Le nom d'utilisateur et/ou le mot de passe sont incorrect(s).");
             } 
        },
        error: function(xhr, status, error) {
             //showMessage('Une erreur s\'est produite lors de l\'envoi des données');
             console.log("rater");
        }
    });
}