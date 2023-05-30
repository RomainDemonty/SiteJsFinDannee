let form = document.getElementById('inscript-form');

form.addEventListener('submit', function(e) {

    let errUsername = document.getElementById('err-username');
    let errMail = document.getElementById('err-mail-adress');
    let errPassword = document.getElementById('err-password');
    let errAvatar = document.getElementById('err-avatar');

    errUsername.innerHTML = "";
    errMail.innerHTML = "";
    errPassword.innerHTML = "";
    errAvatar = "";

    /*
    let mail = document.getElementById('mail-adress');
    let regexMail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(mail.value == "" || regexMail.test(mail.value) == false)
    {
        e.preventDefault();
        if(mail.value == "")
            errMail.innerHTML = "Veuillez renseigner votre adresse mail!";
        else
            errMail.innerHTML = "Adresse mail invalide!";
    }
    */

    let password = document.getElementById('password');
    let regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})$/;
    if(password.value == "" || regexPassword.test(password.value) == false)
    {
        e.preventDefault();
        if(password.value == "")
            errPassword.innerHTML = "Un mot de passe est requis!";
        else
            errPassword.innerHTML = "Format invalide! (au moins 8 caracteres dont 1 minuscule, 1 majuscule, 1 chiffre et un caractere spécial)";
    }

    let username = document.getElementById('username');
    let regexUsername = /^([a-zA-Z0-9-]{4,})$/;
    if(username.value == "" || regexUsername.test(username.value) == false)
    {
        e.preventDefault();
        if(username.value == "")
            errUsername.innerHTML = "Veuillez choisir un pseudo!";
        else
        {
            if(username.value.length < 4)
                errUsername.innerHTML = "Votre pseudo doit contenir au moins 4 caracteres...";
            else
                errUsername.innerHTML = "Votre pseudo ne peut pas contenir de caracteres speciaux!";
        }
            
    }

    let avatars = document.getElementsByName('avatar');
    let avatarIsSelected = false;
    for(let i=0; i < avatars.length && avatarIsSelected == false; i++)
    {
        if(avatars[i].checked)
            avatarIsSelected = true;
    }

    if(avatarIsSelected == false)
    {
        console.log("salut");
        e.preventDefault();
        errAvatar.innerHTML = "Choisissez une photo de profil...";  
    }
});