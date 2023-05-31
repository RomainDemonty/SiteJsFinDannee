//CREATION DE LA SCENE
var config = 
{
    type: Phaser.AUTO,
    width: 1280,
    height: 704,
    //minFps: 2, // Définit une fréquence minimale de 30 FPS
    //margin:;
    
    physics: 
    {
        default: 'arcade',
        arcade: 
        {
            gravity: 
            {
                y: 0 // changer la valeur pour modifier la gravité dans une direction
            },
            debug: false //true // affiche les contours des corps
        }
    },
    
    scene: 
    {
        preload: preload,
        create: create,
        update: update
    }
};

//  DECLARATION DE VARIABLE
var game;
var username;

function demarreJeu()
{
    if(isLoggedIn())
    {
        game = new Phaser.Game(config);

        username = getCookie("pseudo");
        console.log(username);
    }
    else
    {
        console.log("Pas loggé");
        window.location.href = "/Giki/Connexion.html";
    }
}

demarreJeu();

var jerry;
var bool=0;
var randomNum=0;
var etat_jerry=0; // 0 rien, 1 carotte, 2 poivron, 3 potiron
var etat_epouv=0; //down 0, up 1
var score=3;
var objTexteScore;

var soundselect;
var soundbackground;
var soundback =false;

//initialise corbeau a null sinon erreur de ref
corbeau=null;
legume =null;

// Création d'un tableau pour stocker les sprites
this.sprite_epouv = [];
this.sprite_corbeau = [];
this.sprite_legume = [];

//tableau pour les potager
var TabPotGauche = [0,0,0,0]; //hg hd bg bd 1 ou 0
console.log(TabPotGauche);
var TabPotDroit = [0,0,0,0]; //hg hd bg bd 1 ou 0
var TabPotCentre = [0,0,0,0]; //hg hd bg bd 1 ou 0

// INIALISER LES TAB
const tableau = []; //zone
const tableau_elem = []; //personnage
cree_tab_zone();
cree_tab_placement();

//CREATION DES ZONES POTAGER
const potager_centre = new Phaser.Geom.Rectangle(tableau[102].x, tableau[102].y, 128, 128);
const potager_gauche = new Phaser.Geom.Rectangle(tableau[61].x, tableau[61].y, 128, 128);
const potager_droite = new Phaser.Geom.Rectangle(tableau[149].x, tableau[149].y, 128, 128);//14-7 832-384

//CREATION DES ZONES POUR LES GRAINES
const legume_haut = new Phaser.Geom.Rectangle(tableau[202].x, tableau[202].y+16,64,  32);
const legume_centre = new Phaser.Geom.Rectangle(tableau[203].x, tableau[203].y+16, 64,32);
const legume_bas = new Phaser.Geom.Rectangle(tableau[204].x, tableau[204].y+16, 64, 32);

//CREATION DES ZONES EPOUVENTAILLE
const epouvgauche = new Phaser.Geom.Rectangle(tableau[81].x+16, tableau[81].y+16, 32, 32);

//FONCTION POUR LES TAB
function cree_tab_zone()
{
    // Définir les dimensions du tableau
    const width = 20;
    const height = 11;

    // Boucle à travers chaque case du tableau
    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {

            // Calculer la position de la case
            const positionX = x * 64;
            const positionY = y * 64;

            const px = x;
            const py = y;

            // Ajouter les coordonnées de la case au tableau
            tableau.push({ x: positionX, y: positionY, px, py });
        }
    }

    // Afficher le tableau dans la console
    console.log(tableau);
}

function cree_tab_placement()
{
    // Définir les dimensions du tableau
    const width = 20;
    const height = 11;

    // Boucle à travers chaque case du tableau
    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {

            // Calculer la position de la case
            const positionX = x * 64+32;
            const positionY = y * 64+32;

            const px = x;
            const py = y;

            // Ajouter les coordonnées de la case au tableau
            tableau_elem.push({ x: positionX, y: positionY, px, py });
        }
    }
    // Afficher le tableau dans la console
    console.log(tableau_elem);
}

//FONCTION POUR LES CORBEAUX

function spawnCorbeauBas(x,y)
{
    corbeau = this.physics.add.sprite(x, y, 'corbeau');

    for(let i=0; i < sprite_legume.length ; i++)
    {
        //ajout dune collison
        this.physics.add.collider(sprite_legume[i], corbeau,fcttemp.bind(this));
    }

    //ajout du corbeau dans un tableau
    sprite_corbeau.push(corbeau);

    corbeau.anims.play('corb');
    corbeau.setDepth(5);
    console.log('apparition corbeau bas');
    //faire deplacer le corbeau en ligne droite
    corbeau.body.velocity.y = -32;
    randomNum=0;
}

function spawnCorbeauGauche(x,y)
{   
    //rotation du sprite
    angle = 80;
    corbeau = this.physics.add.sprite(x, y, 'corbeau');

    for(let i=0; i < sprite_legume.length ; i++)
    {
        
        //ajout dune collison
        this.physics.add.collider(sprite_legume[i],corbeau ,fcttemp.bind(this));
    }

    //ajout du corbeau dans un tableau
    sprite_corbeau.push(corbeau);

    corbeau.rotation = (angle * Math.PI) / 180;
    corbeau.anims.play('corb');
    corbeau.setDepth(5);
    console.log('apparition corbeau gauche');
    //faire deplacer le corbeau en ligne droite
    corbeau.body.velocity.x = +32;
    randomNum=0;
}

function fcttemp(obj,obj1)
{
    console.log('detecte');
    //destroy le legume
    obj.destroy();
    obj1.setVelocityX(32);
    
    //scene de fin et redémarre le jeux

    Envoie();

    this.scene.pause();

    //fait apparaitre fentre de fin
    afficherFenetre();
}

function afficherFenetre() {
        var fenetre = document.createElement("div");
    fenetre.style.position = "fixed";
    fenetre.style.width = "300px";
    fenetre.style.height = "200px";
    fenetre.style.backgroundColor = "green";
    fenetre.style.border = "3px solid black";
    fenetre.style.borderRadius = "5px";
    fenetre.style.top = "30%";
    fenetre.style.left = "50%";
    fenetre.style.transform = "translate(-50%, -50%)";

    var contenu = document.createElement("div");
    contenu.innerHTML = "Score: " + score;
    contenu.style.textAlign = "center";
    contenu.style.marginTop = "30%";

    var boutonJouer = document.createElement("button");
    boutonJouer.innerHTML = "Jouer";
    boutonJouer.style.position = "absolute";
    boutonJouer.style.left = "25%";
    boutonJouer.style.top = "70%";
    boutonJouer.style.transform = "translate(-50%, -50%)";
    boutonJouer.style.backgroundColor = "white";
    boutonJouer.style.color = "black";
    boutonJouer.style.border = "2px solid black";
    boutonJouer.style.borderRadius = "5px";
    boutonJouer.onclick = function() {
    location.reload(); // Actualiser la page
    // Code pour démarrer le jeu Phaser
    // Cela peut inclure la création du jeu, la configuration des scènes, etc.
    };

    var boutonQuitter = document.createElement("button");
    boutonQuitter.innerHTML = "Quitter";
    boutonQuitter.style.position = "absolute";
    boutonQuitter.style.left = "75%";
    boutonQuitter.style.top = "70%";
    boutonQuitter.style.transform = "translate(-50%, -50%)";
    boutonQuitter.style.backgroundColor = "white";
    boutonQuitter.style.color = "black";
    boutonQuitter.style.border = "2px solid black";
    boutonQuitter.style.borderRadius = "5px";
    boutonQuitter.onclick = function() {
    window.location.href = "../index.html"; // Redirection vers une autre page
    };

    fenetre.appendChild(contenu);
    fenetre.appendChild(boutonJouer);
    fenetre.appendChild(boutonQuitter);

    document.body.appendChild(fenetre);
}

//fonciton pour ajouter le score a la bd

function Envoie(){
    var jeu = "LePotagerDeJerry";
    $.ajax({
      url: "RedirectionModele.php",
      method: "POST",
      data: { action:'AjoutScore', score: score, pseudo: username, NomJeux: jeu },
      success: function(response) {
        console.log(response); // Affiche la réponse du script PHP dans la console
        console.log('Reussite');
      },
      error: function(xhr, status, error) {
        console.error(error); // Affiche l'erreur en cas d'échec de la requête AJAX
        console.log('Rate');
    }
  });
}

//s'excute apres une attente
function attente()
{
    //les corbeau peuvent revenir
    if(sprite_epouv[1])
    {
        sprite_epouv[1].setVisible(false);
        console.log(sprite_epouv);
        etat_epouv=0;
    }
    //je crée un épouventaille et stock sa ref
    sprite_epouv[0].setVisible(true);
}

//fonction qui add des point quand plante morte
function recolte(ind,indicesup)
{
    score++;
    sprite_legume[ind].destroy();

    for(var i=0 ; i < sprite_legume.length-1 ; i++)
    {
        sprite_legume[i] = sprite_legume[i+1];
    }

    objTexteScore.setText("Score : " + score);
}

function son()
{
    soundback=false;
}

//permet de planter un legume et reconnaitre quel legume a planter
function planter(x,y,numLegume,indicesup)
{
    var ind;

    console.log('démarre l\'ajout grace a l\'etat de jerry')
    console.log(numLegume);
    switch(numLegume)
    {
        case 1:

            console.log('plante carote');
            legume = this.physics.add.sprite(x, y, 'carotte');
            sprite_legume.push(legume);
            ind = sprite_legume.length - 1;
            console.log(sprite_legume);

            setTimeout(function() {
                recolte(ind,indicesup);
            }, 20000);

            for(i=0; i < sprite_corbeau.length ; i++)
            {
                //ajout dune collison
                this.physics.add.collider(legume, sprite_corbeau[i],fcttemp.bind(this));
            }

            legume.anims.play('carotteAnim');
            legume.setDepth(3);

        break;

        case 2:

            console.log('plante tomate');
            legume = this.physics.add.sprite(x, y, 'tomateAnim');
            sprite_legume.push(legume);
            ind = sprite_legume.length - 1;
            setTimeout(function() {
                recolte(ind,indicesup);
            }, 20000);             
            

            for(i=0; i < sprite_corbeau.length ; i++)
            {
                //ajout dune collison
                this.physics.add.collider(legume, sprite_corbeau[i],fcttemp.bind(this));
            }
            legume.anims.play('tomateAnim');
            legume.setDepth(3);

        break;

        case 3:

            console.log('plante potiron');
            legume = this.physics.add.sprite(x, y, 'potironAnim');
            sprite_legume.push(legume);

            //récupération indice pour refactor tableau
            ind = sprite_legume.length - 1;

            //envoi d'une focntion de suppression du legume dans 20 seconde
            setTimeout(function() {
               recolte(ind,indicesup);
            }, 20000);
           

            for(i=0; i < sprite_corbeau.length ; i++)
            {
                //ajout dune collison
                this.physics.add.collider(legume, sprite_corbeau[i],fcttemp.bind(this));
            }
            
            legume.anims.play('potironAnim');
            legume.setDepth(3);

        break;
    }
}
  
/************************************************************************************************************************************************** */

//////////////////////////////////////////////////////////////////////PRELOAD/////////////////////////////////////////////////////////////////////////

/************************************************************************************************************************************************** */

function preload ()
{
    // Charger les ressources nécessaires, y compris l'image du personnage et la carte
    this.load.image('map', 'projetv.1.png');

   //preload de mes seed
    this.load.image('seedC', './image/seedC.png');
    this.load.image('seedP', './image/seedP.png');
    this.load.image('seedT', './image/seedT.png');

    // des sons

    this.load.audio('selected', './son/select.mp3');
    this.load.audio('back', './son/sonfond.wav');
    
    //chargement des sprites
    this.load.spritesheet(
        'jerry', 
        './image/jerry.png',
        { frameWidth: 64, frameHeight: 64 } 
    );

    this.load.spritesheet(
        'epouv', 
        './image/epouventaille.png',
        { frameWidth: 64, frameHeight: 64 } 
    );
    
    this.load.spritesheet(
        'carotte', 
        './image/carote.png',
        { frameWidth: 64, frameHeight: 64 } 
    );

    this.load.spritesheet(
        'tomate', 
        './image/tomate.png',
        { frameWidth: 64, frameHeight: 64 } 
    );

    this.load.spritesheet(
        'potiron', 
        './image/potiron.png',
        { frameWidth: 64, frameHeight: 64 } 
    );

    this.load.spritesheet(
        'corbeau', 
        './image/corbeau.png',
        { frameWidth: 64, frameHeight: 64 } 
    );
}

/************************************************************************************************************************************************** */

///////////////////////////////////////////////////////////////////////CREATE/////////////////////////////////////////////////////////////////////////

/************************************************************************************************************************************************** */

function create ()
{
    //son
    soundselect = this.sound.add('selected');
    soundbackground = this.sound.add('back');

    //la map
    this.add.image(0, 0, 'map').setOrigin(0);

    //ajout des seed
    this.add.image(1152, 255, 'seedC').setOrigin(0);
    this.add.image(1152, 320, 'seedT').setOrigin(0);
    this.add.image(1152, 390, 'seedP').setOrigin(0);

    //le personnages + ajout des bordures du monde
    jerry = this.physics.add.sprite(1200, 150, 'jerry');
    jerry.setDepth(4);
    jerry.body.collideWorldBounds = true;

    //evenement du clavier
    evt = this.input.keyboard.createCursorKeys();

    //pour afficher le score
    objTexteScore = this.add.text(80, 80, "Score : 0");

    //je crée un épouventaille et stock sa ref
    var sprite1 = this.add.sprite(tableau_elem[81].x, tableau_elem[81].y, 'epouv',1);
    sprite_epouv.push(sprite1);

    //crée l'épouv debout puis le rend invisible
    var sprite2 = this.add.sprite(tableau_elem[81].x, tableau_elem[81].y, 'epouv',0);
    sprite_epouv.push(sprite2); //stock a l'index 1 de sprite_epouv
    sprite_epouv[1].setVisible(false);

    console.log(sprite_epouv);

    //creation des animation et leur clef
    this.anims.create({
        key: 'up1',
        frames: [ { key: 'jerry', frame: 1 } ],
        frameRate: 1,
        repeat: 1
    });

    this.anims.create({
        key: 'left1',
        frames: [ { key: 'jerry', frame: 3 } ],
        frameRate: 0,
        repeat: 1
    });

    this.anims.create({
        key: 'face1',
        frames: [ { key: 'jerry', frame: 0 } ],
        frameRate: 0,
        repeat: 1
    });

    this.anims.create({
        key: 'right1',
        frames: [ { key: 'jerry', frame: 5 } ],
        frameRate: 0,
        repeat: 1
    });

    this.anims.create({
        key: 'corb',
        frames: this.anims.generateFrameNumbers('corbeau', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    //animation plante potager

    this.anims.create({
        key: 'carotteAnim',
        frames: this.anims.generateFrameNumbers('carotte', { start: 0, end: 5 }),
        frameRate: 1,
        repeat: 0
    });
    
    this.anims.create({
        key: 'tomateAnim',
        frames: this.anims.generateFrameNumbers('tomate', { start: 0, end:  6}),
        frameRate: 1,
        repeat: 0
    });

    this.anims.create({
        key: 'potironAnim',
        frames: this.anims.generateFrameNumbers('potiron', { start: 0, end: 7 }),
        frameRate: 1,
        repeat: 0
    });

    //creation des animations pour prendre les graines

    //carote
    this.anims.create({
        key: 'graineHautC',
        frames: [ { key: 'jerry', frame: 9 } ],
        frameRate: 0,
        repeat: 1
    });

    //poivron
    this.anims.create({
        key: 'grainemilieuP',
        frames: [ { key: 'jerry', frame: 7 } ],
        frameRate: 0,
        repeat: 1
    });

    //potiron
    this.anims.create({
        key: 'graineBasPOT',
        frames: [ { key: 'jerry', frame: 8 } ],
        frameRate: 0,
        repeat: 1
    });

    /*//mise en  courleur des zones TEST
    const graphics = this.add.graphics();
    graphics.fillStyle(0xff0000);
    graphics.fillRectShape(potager_centre);
    //mise en  courleur de la zone gauche
    const graphics1 = this.add.graphics();
    graphics.fillStyle(0xff0000);
    graphics.fillRectShape(potager_gauche);
    //mise en  courleur de la zone droite
    const graphics2 = this.add.graphics();
    graphics.fillStyle(0xff0000);
    graphics.fillRectShape(potager_droite);

    //affichage zone test légume
    const graphic3 = this.add.graphics();
    graphics.fillStyle(0xff0000);
    graphics.fillRectShape(legume_haut);
    //mise en  courleur de la zone gauche
    const graphics4 = this.add.graphics();
    graphics.fillStyle(0xff0000);
    graphics.fillRectShape(legume_centre);
    //mise en  courleur de la zone droite
    const graphics5 = this.add.graphics();
    graphics.fillStyle(0xff0000);
    graphics.fillRectShape(legume_bas);

    //mise en  courleur de la zone epouv
    const graphics6 = this.add.graphics();
    graphics.fillStyle(0xff0000);
    graphics.fillRectShape(epouvgauche);*/
}

/************************************************************************************************************************************************** */

///////////////////////////////////////////////////////////////////////UPDATE/////////////////////////////////////////////////////////////////////////

/************************************************************************************************************************************************** */
function update ()
{
    if(soundback == false)
    {
        soundbackground.play();
        soundback=true;

        setTimeout(son, 89000);
    }

    ///////////////////////////POTAGER//////////////////////////////////////////////////////////
    //gere les intéraction pour les zones de potager
    ////////////////////////////////////////////////////////////////////////////////////////////

    ///////////////////////////potager centre///////////////////////////////////////////////////

    if(Phaser.Geom.Intersects.RectangleToRectangle(jerry.getBounds(), potager_centre))
    {
        console.log('rentre dans potager centrale');

        var i;
        var indice=0;
        var bool = false;

        //si j'ai une graine en main
        if(etat_jerry != 0)
        {
            console.log(TabPotCentre);
            for ( i = 0; i < TabPotCentre.length && bool == false; i++)
            {
                console.log('boucle '+ i);
                
                if (TabPotCentre[i] === 0) 
                {
                  indice = i; // Renvoie l'indice de l'élément trouvé
                  bool = true;
                }
            }
            console.log('avant le if');
            
            etat = etat_jerry;

            if(indice<=4)
            {   etat_jerry = 0;
                console.log('rentre dans le if');
                console.log('indice' + indice);
                //lespace est mtn occuper
                TabPotCentre[indice] = 1;
                var indicesup=indice;
                //je plante 
                switch(indice)
                {
                    case 0:
                        console.log('plante en haut a gauche');
                        planter.call(this, tableau_elem[102].x,tableau_elem[102].y,etat,indicesup)
                    break;

                    case 1:
                        console.log('plante en haut a droite');
                        planter.call(this, tableau_elem[113].x,tableau_elem[113].y,etat,indicesup)
                    break;

                    case 2:
                        console.log('plante en bas a gauche');
                        planter.call(this, tableau_elem[103].x,tableau_elem[103].y,etat,indicesup)
                        
                    break;

                    case 3:
                        console.log('plante en bas a droite');
                        planter.call(this, tableau_elem[114].x,tableau_elem[114].y,etat,indicesup)
                    break;
                }  
            }
        }
    }

    ///////////////////////////potager gauche///////////////////////////////////////////////////

    if(Phaser.Geom.Intersects.RectangleToRectangle(jerry.getBounds(), potager_gauche))
    {
        console.log('rentre dans potager gauche');
        
        var i;
        var indice
        var bool = false;

        //si j'ai une graine en main
        if(etat_jerry != 0)
        {
            console.log(TabPotGauche);
            for ( i = 0; i < TabPotGauche.length && bool == false ; i++) 
            {
                console.log('boucle '+ i);
                

                if (TabPotGauche[i] === 0) 
                {
                  indice = i; // Renvoie l'indice de l'élément trouvé
                  bool=true;
                }
            }
            console.log('avant le if');
            
            etat = etat_jerry;
            
            if(indice<=4)
            {
                etat_jerry = 0;
                console.log('rentre dans le if');
                console.log('indice' + indice);
                //lespace est mtn occuper
                TabPotGauche[indice] = 1;
                //je plante 
                switch(indice)
                {
                    case 0:
                        console.log('plante en haut a gauche');
                        planter.call(this, tableau_elem[61].x,tableau_elem[61].y,etat)
                    break;

                    case 1:
                        console.log('plante en haut a droite');
                        planter.call(this, tableau_elem[72].x,tableau_elem[72].y,etat)
                    break;

                    case 2:
                        console.log('plante en bas a gauche');
                        planter.call(this, tableau_elem[62].x,tableau_elem[62].y,etat)
                        
                    break;

                    case 3:
                        console.log('plante en bas a droite');
                        planter.call(this, tableau_elem[73].x,tableau_elem[73].y,etat)
                        
                    break;         
                }  
            }
        }
    }

    ///////////////////////////potager droit////////////////////////////////////////////////////

    if(Phaser.Geom.Intersects.RectangleToRectangle(jerry.getBounds(), potager_droite))
    {
        console.log('rentre dans potager droit');
        
        var i;
        var indice;
        var bool = false

        //si j'ai une graine en main
        if(etat_jerry != 0)
        {
            console.log(TabPotDroit);
            for ( i = 0; i < TabPotDroit.length && bool == false; i++) 
            {
                console.log('boucle '+ i);
                

                if (TabPotDroit[i] === 0) 
                {
                  indice = i; // Renvoie l'indice de l'élément trouvé
                  bool = true;
                }
            }
            console.log('avant le if');
            
            etat = etat_jerry;
            
            if(indice<=4)
            {
                etat_jerry = 0;
                console.log('rentre dans le if');
                console.log('indice' + indice);
                //lespace est mtn occuper
                TabPotDroit[indice] = 1;
                //je plante 
                switch(indice)
                {
                    case 0:
                        console.log('plante en haut a gauche');
                        planter.call(this, tableau_elem[149].x,tableau_elem[149].y,etat)
                    break;

                    case 1:
                        console.log('plante en haut a droite');
                        planter.call(this, tableau_elem[160].x,tableau_elem[160].y,etat)
                    break;

                    case 2:
                        console.log('plante en bas a gauche');
                        planter.call(this, tableau_elem[150].x,tableau_elem[150].y,etat)
                        
                    break;

                    case 3:
                        console.log('plante en bas a droite');
                        planter.call(this, tableau_elem[161].x,tableau_elem[161].y,etat)                     
                    break;         
                }  
            }
        }
    }
    
    ////////////////////////////////////////////LES GRAINES///////////////////////////////////////////////
    //gere les intéraction pour les zones de prise de graine
    //////////////////////////////////////////////////////////////////////////////////////////////////////
    
    if(Phaser.Geom.Intersects.RectangleToRectangle(jerry.getBounds(), legume_haut))
    {
        //met jerry en animation légume haut
        console.log('prend légume haut');
        soundselect.play();
        etat_jerry = 1;

        //joue anims //lanime va juste ce jouer une fois je dois donc bloquer le mecanisme d'animation dans le déplacement normale
        jerry.anims.play('graineHautC', true);
    }

    if(Phaser.Geom.Intersects.RectangleToRectangle(jerry.getBounds(), legume_centre)) 
    {
        //met jerry en animation légume centre
        console.log('prend légume centre');
        soundselect.play();
        etat_jerry = 2;

        //joue anime
        jerry.anims.play('grainemilieuP', true);
    }

    if(Phaser.Geom.Intersects.RectangleToRectangle(jerry.getBounds(), legume_bas)) 
    {
        //met jerry en animation légume bas
        console.log('prend légume bas');
        soundselect.play();
        etat_jerry = 3;

        //joue anime
        jerry.anims.play('graineBasPOT', true);
    }

    /////////////////////////////////////////////////////////EPOUVABLE////////////////////////////////////////////////////////
    //quand jerry va dans la zone de l'épouventaille
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    if(Phaser.Geom.Intersects.RectangleToRectangle(jerry.getBounds(), epouvgauche)) 
    {
        //met jerry en animation légume bas
        console.log('active epouventaille');
        etat_epouv = 1;

        //tue les corbeaux en vole
        if(corbeau)
        {
            // Supprimer chaque sprite corbeau du tableau
            sprite_corbeau.forEach(function(corbeau) 
            {
                corbeau.destroy();
            });

            // Vider le tableau après la suppression
            sprite_corbeau = [];
        }
        
        //va remettre la variable etat a false apres 5 secondes via fonction attente
        setTimeout(attente, 5000);

        //efface l'ancien épouventaille*
        if(sprite_epouv[0])
        {
            sprite_epouv[0].setVisible(false);
            console.log(sprite_epouv);
        }

        //affiche l'épouventaille 
        if(sprite_epouv[1])
        {
            sprite_epouv[1].setVisible(true);
        }
        
    }

    /////////////////////////////////////////////////////////CORBEAU//////////////////////////////////////////////////////////
    //SI MON EPOUVANTAILLE EST LEVER ALORS ETAT EPOUV EST A 1 ET IL N4APPARAISSE PAS
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////  

    if(etat_epouv == 0)
    {
        if(randomNum != 45)randomNum = Phaser.Math.Between(1, 4000);
        else spawnCorbeauBas.call(this, tableau_elem[65].x,tableau_elem[65].y);
        
        if(randomNum != 45)randomNum = Phaser.Math.Between(1, 4000);
        else spawnCorbeauBas.call(this, tableau_elem[120].x,tableau_elem[120].y);

        if(randomNum != 45)randomNum = Phaser.Math.Between(1, 4000);
        else spawnCorbeauGauche.call(this, tableau_elem[6].x,tableau_elem[6].y)
    }
    
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    if (evt.left.isDown) 
    {
        jerry.anims.play('left1');
        bool = 1;
        jerry.x -= 2.5;
    }
    else if (evt.right.isDown) 
    {
        jerry.anims.play('right1');
        bool = 1;
        jerry.x += 2.5;
    }
    if (evt.up.isDown) 
    {   
        jerry.anims.play('up1');
        bool = 1;
        jerry.y -= 2.5;
    }
    else if (evt.down.isDown) 
    {
        jerry.anims.play('face1');
        bool = 1;
        jerry.y += 2.5;
    }    
}















    /*const legume = this.physics.add.sprite(pointAccroche.x, pointAccroche.y, 'carotteAnim');
    sprite_legume.push(legume);
    legume.anims.play('carotteAnim');

    etat_jerry = 0;

    const legume1 = this.physics.add.sprite(pointAccroche.x, pointAccroche.y, 'tomateAnim');
    sprite_legume.push(legume1);
    legume1.anims.play('tomateAnim');

    etat_jerry = 0;

    const legume2 = this.physics.add.sprite(pointAccroche.x, pointAccroche.y, 'potironAnim');
    sprite_legume.push(legume2);
    legume2.anims.play('potironAnim');

    etat_jerry = 0;*/


    /*function trouverPointAccrocheProche(joueurX, joueurY) {
    // Définir une variable pour stocker la distance minimale
    let distanceMin = Infinity;
  
    // Définir des variables pour stocker les coordonnées du point d'accroche le plus proche
    let pointAccrocheX, pointAccrocheY;
  
    // Parcourir les éléments du tableau des emplacements
    for (let i = 0; i < tableau_elem.length; i++) {
      const elem = tableau_elem[i];
      
      // Calculer la distance entre les coordonnées du joueur et l'emplacement actuel
      const distance = Phaser.Math.Distance.Between(joueurX, joueurY, elem.x, elem.y);
  
      // Vérifier si la distance est inférieure à la distance minimale actuelle
      if (distance < distanceMin) {
        // Mettre à jour la distance minimale et les coordonnées du point d'accroche le plus proche
        distanceMin = distance;
        pointAccrocheX = elem.x;
        pointAccrocheY = elem.y;
      }
    }
  
    // Retourner les coordonnées du point d'accroche le plus proche
    return { x: pointAccrocheX, y: pointAccrocheY };
  }*/