$(document).ready(function() 
{
    $('#inscript-form').submit(function(event)
    {
      event.preventDefault();
      
      var username = $('#username').val();
      var password = $('#password').val();
      
      if (validateForm(username, password))
      {
        sendData(username, password);
      }
      else
      {
        console.log("Erreur dans la saisie des champs!");
      }
    });
});
  
function validateForm(username, password) 
{  
  var isOk = true;
  var errUsername = $('#err-username');
  var errPassword = $('#err-password');

  errUsername.text("");
  errPassword.text("");

  let regexUsername = /^([a-zA-Z0-9-]{4,})$/;
  if(username == "" || regexUsername.test(username) == false)
  {
      isOk = false;
      if(username == "")
          errUsername.text("Veuillez choisir un pseudo!");
      else
      {
          if(username.length < 4)
              errUsername.text("Votre pseudo doit contenir au moins 4 caracteres...");
          else
              errUsername.text("Votre pseudo ne peut pas contenir de caracteres speciaux!");
      }
  }
  
  let regexPassword = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{8,}$/;
  if(password == "" || regexPassword.test(password) == false)
  {
      isOk = false;
      if(password == "")
      {
        errPassword.text("Un mot de passe est requis!");
      }
      else
      {
        errPassword.text("Format invalide! (au moins 8 caracteres dont 1 majuscule, 1 chiffre et un caractere spécial)");
      }
  }

  return isOk;
}
  
function sendData(username, password)
{
  $.ajax({
    type: 'POST',
    url: './BD/RedirectionModele.php',
    data: {
      action:'AjoutUser', 
      username: username, 
      password: password
    },
    success: function(response) {
      console.log('Données envoyées avec succès');

      console.log(response);
      if(response != 1)
      {
        var pErreur = $("#err-inscription");
        pErreur.text("Impossible de créer le compte! L'utilisateur existe déjà...");
      }
      else
      {
        afficherFenetre();
      }
      
    },
    error: function(xhr, status, error) {
      console.log('Une erreur s\'est produite lors de l\'envoi des données');
    }
  });
  console.log("Envoi des données vers Modele.php");
}


function afficherFenetre() {
  var fenetre = document.createElement("div");

  fenetre.classList.add("fenetreValidation");

  fenetre.style.position = "fixed";
  fenetre.style.width = "500px";
  fenetre.style.height = "500px";
  fenetre.style.backgroundColor = "white";
  fenetre.style.border = "3px solid lightgray";
  fenetre.style.borderRadius = "20px";
  fenetre.style.top = "50%";
  fenetre.style.left = "50%";
  fenetre.style.transform = "translate(-50%, -50%)";

  var message = document.createElement("p");
  message.innerHTML = "Votre compte a été crée avec succès!";
  message.style.left = "50%";
  message.style.top = "10%";

  var image = document.createElement("img");
  image.src = "./Image/validationImage.png";
  image.style.display = "block";
  image.style.margin = "30px auto 0";
  image.style.width = "80%";

  var boutonOK = document.createElement("button");
  boutonOK.innerHTML = "Suivant";
  boutonOK.style.position = "absolute";
  boutonOK.style.left = "50%";
  boutonOK.style.top = "95%";
  boutonOK.style.transform = "translate(-50%, -50%)";
  boutonOK.onclick = function() {
    window.location.href = "Connexion.html"; // Redirection vers une autre page
  };

  fenetre.appendChild(message);
  fenetre.appendChild(image);
  fenetre.appendChild(boutonOK);
  document.body.appendChild(fenetre);
}