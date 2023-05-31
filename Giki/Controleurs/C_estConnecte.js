function isLoggedIn() 
{
    var sessionCookie = getCookie("pseudo");
    return sessionCookie !== null && sessionCookie !== "";
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

// Fonction pour supprimer un cookie
function deleteCookie(name) 
{
    document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

function isUserConnected()
{
    if(isLoggedIn())
    {
        var lien = document.getElementById("Connection");
        lien.href = "index.html";
        lien.innerHTML = "Déconnexion";

        lien.addEventListener("click", function(e){
            deleteCookie("pseudo");
        });
    }
}

isUserConnected();