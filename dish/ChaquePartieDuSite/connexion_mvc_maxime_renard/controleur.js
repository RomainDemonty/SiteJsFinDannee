// Récupération des champs du formulaire
const pseudo = document.getElementById('pseudo');
const mdp = document.getElementById('mdp');

let form = document.getElementById('FORM_CO');
let BDD = 1;

form.addEventListener('submit',function(e){

    //vérification du pseudo
    let regexcarac = /^[a-zA-Z\s]+$/;

    if (regexcarac.test(pseudo.value) == false) 
    {
        BDD = 0;

        e.preventDefault();
        document.getElementById('erreur').innerHTML ="ne doit contenir que des lettres";
        document.getElementById('erreur').style.color ='red' ;
        if(pseudo.value.length == 0)
        {
            document.getElementById('erreur').innerHTML ="attention le champs est vide";
            document.getElementById('erreur').style.color ='red' ; 
        }
    }

    //vérification du password
    if (mdp.value.length < 5) 
    {
        BDD = 0;

        e.preventDefault();
        document.getElementById('erreur_prenom').innerHTML ="la taille du mdp doit etre supérieur a 5 caracteres";
        document.getElementById('erreur_prenom').style.color ='red' ;    
        
        if(mdp.value.length == 0)
        {
            document.getElementById('erreur_prenom').innerHTML ="attention le champs est vide";
            document.getElementById('erreur_prenom').style.color ='red' ; 
        }
    }
    
    //ajout dans la base de donner
    if(BDD == 0)
    {
        //import { Vérification } from 'modele.js';
        //Vérification(pseudo, mdp);
    }



});

