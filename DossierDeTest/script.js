$(document).ready(function() {
    $('#myForm').submit(function(event) {
      event.preventDefault();
      
      var username = $('#username').val();
      var password = $('#password').val();
      
      if (validateForm(username, password)) {
        sendData(username, password);
      }
      console.log("user name:" + username);
      console.log("Password:" + username);
    });
  });
  
  function validateForm(username, password) {
    // Ajoutez ici vos propres validations de données
    
    if (username === '') {
      showMessage('Veuillez entrer un nom');
      return false;
    }
    
    if (password === '') {
      showMessage('Veuillez entrer un mot de passe');
      return false;
    }
    
    /*
    if (!isValidEmail(password)) {
      showMessage('Veuillez entrer une adresse email valide');
      return false;
    }
    */

    return true;
  }
  
  /*
  function isValidEmail(email) {
    // Validation basique de l'adresse email
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
  }
  */
  
  function showMessage(message) {
    $('#message').text(message);
  }
  
  function sendData(username, password) {
    /*
    var formData = {
        password: password,
        username: username,
        action:'AjoutUser'
    };
    */
    
    $.ajax({
      type: 'POST',
      url: 'RedirectionModele.php',
      data: {action:'AjoutUser', username: username, password: password},
      success: function(response) {
        showMessage('Données envoyées avec succès');
        // Réinitialiser le formulaire ici si nécessaire
      },
      error: function(xhr, status, error) {
        showMessage('Une erreur s\'est produite lors de l\'envoi des données');
      }
    });
    console.log("envoie");
  }