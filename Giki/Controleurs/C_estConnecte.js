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