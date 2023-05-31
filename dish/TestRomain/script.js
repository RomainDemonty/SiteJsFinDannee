$(document).ready(function() {
    $('#myForm').submit(function(event) {
      event.preventDefault();
      
      var name = $('#name').val();
      var email = $('#email').val();
      
      if (validateForm(name, email)) {
        sendData(name, email);
      }
    });
  });
  
  function validateForm(name, email) {
    // Ajoutez ici vos propres validations de données
    
    if (name === '') {
      showMessage('Veuillez entrer un nom');
      return false;
    }
    
    if (email === '') {
      showMessage('Veuillez entrer une adresse email');
      return false;
    }
    
    if (!isValidEmail(email)) {
      showMessage('Veuillez entrer une adresse email valide');
      return false;
    }
    
    return true;
  }
  
  function isValidEmail(email) {
    // Validation basique de l'adresse email
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
  }
  
  function showMessage(message) {
    $('#message').text(message);
  }
  
  function sendData(name, email) {
    var nb = 2;
    var formData = {
      name: name,
      mdp: email,
      nombre : nb
    };
    
    $.ajax({
      type: 'POST',
      url: 'insert.php',
      data: formData,
      success: function(response) {
        showMessage('Données envoyées avec succès');
        // Réinitialiser le formulaire ici si nécessaire
      },
      error: function(xhr, status, error) {
        showMessage('Une erreur s\'est produite lors de l\'envoi des données');
      }
    });
  }