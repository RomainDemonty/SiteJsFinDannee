var config = {
  type: Phaser.AUTO,
  width: 670,
  height: 640,
  scene: 
  {
    preload: preload,
    create: create,
    update: update,
  },
  physics: 
  {
    default: "arcade",
    arcade: 
    {
      gravity: { y: 0 },
      debug: false,
    },
  }
};

var player;
var Poele;//Afficher les sprites de la poele
var Cuiss1;//Poele de cuisson 1
var assi;

//état de l'assiette
var AE = 0;
//Si assiette déposée
var A1 = false;

var choix =0;

//L'état de la poele
var C1 = 0;

//Si la cuisson est en cours
brule = false;
avancement = 0; //Cuisson de l'élément de départ

var cursors;
var game = new Phaser.Game(config);

var Etat;//Savoir le bonhomme est comment

//angle de rotation personnage
var angle;

//Bordure de la map
var bounds;

var FrigoAliment = 0;

//Savoir si le joueur peut se déplacer
Dep = true;

//Timer
var timerText;
var timer = 3;

//Score
var ScoreText;
var Score = 0;

//Si je maintient la touche appuyée éviter que l'évenement se fasse en boucle       
var curDown = true;

//Slider du frigo
//Image actuelle
var image;
//Vecteur d'image
var images;
//Si changement
var sliderOn = true;

var square;

//----------Les zones où les interactions sont possible-------------------------------//
const Assietes = new Phaser.Geom.Rectangle(90, 550, 15, 15);
const Evier = new Phaser.Geom.Rectangle(100, 375, 5, 1);
const Poubelle = new Phaser.Geom.Rectangle(100, 290, 5, 1);
const Frigo = new Phaser.Geom.Rectangle(290, 100, 70, 20);
const Plats1 = new Phaser.Geom.Rectangle(450, 350, 5, 1);
const Poele1 = new Phaser.Geom.Rectangle(235, 550, 5, 1);
/*-----------------------------------------------------------------------------------*/


/*-----------------------------------------------------------------------------------*/
/*-----------------------------------------------------------------------------------*/ 
/*-----------------------------------------------------------------------------------*/ 

function preload() {
  this.load.image("Fond", "./Image/Cuisine2.jpg");

  this.load.image("FlecheDroite", "./Image/FlecheDroite.png");
  this.load.image("FlecheGauche", "./Image/FlecheGauche.png");

  this.load.image("Steak", "./Image/Steak.png");
  this.load.image("Poulet", "./Image/Poulet.png");
  this.load.image("Oeuf", "./Image/Oeuf.png");
  this.load.image("Salade", "./Image/Salade.png");
  this.load.image("Pain", "./Image/Pain.png");

  this.load.image("AssietteVide", "./Image/AssietteVide.png");

  this.load.image("AssietteOeufCru", "./Image/AssietteOeufCru.png");
  this.load.image("AssietteOeufCuit", "./Image/AssietteOeufCuit.png");
  this.load.image("AssietteOeufCrame", "./Image/AssietteOeufCrame.png");

  this.load.image("AssiettePain", "./Image/AssiettePain.png");
  
  this.load.image("AssiettePainSteakCru", "./Image/AssiettePainSteakCru.png");
  this.load.image("BurgerCru", "./Image/BurgerCru.png");

  this.load.image("AssiettePainSteakCuit", "./Image/AssiettePainSteakCuit.png");
  this.load.image("BurgerCuit", "./Image/BurgerCuit.png");

  this.load.image("AssiettePainSteakCrame", "./Image/AssiettePainSteakCrame.png");
  this.load.image("BurgerCrame", "./Image/BurgerCrame.png");

  this.load.image("AssiettePouletCru", "./Image/AssiettePouletCru.png");
  this.load.image("AssiettePouletCruSalade", "./Image/AssiettePouletCruSalade.png");

  this.load.image("AssiettePouletCuit", "./Image/AssiettePouletCuit.png");
  this.load.image("AssiettePouletCuitSalade", "./Image/AssiettePouletCuitSalade.png");

  this.load.image("AssiettePouletCrame", "./Image/AssiettePouletCrame.png");
  this.load.image("AssiettePouletCrameSalade", "./Image/AssiettePouletCrameSalade.png");

  this.load.spritesheet("Poele", "./Image/ImagePoeleAssiettes1.png", 
  {
    frameWidth: 80, //Taille de l'image 
    frameHeight: 80,
  });

  
  this.load.spritesheet("PoeleCuiss", "./Image/ImagePoeleAssiettes1.png", 
  {
    frameWidth: 80, //Taille de l'image 
    frameHeight: 80,
  });

  this.load.spritesheet("mec", "./Image/SpriteBonhomme.png", 
  {
    frameWidth: 96, //Taille de l'image 
    frameHeight: 96,
  });
}

/*-----------------------------------------------------------------------------------*/
/*-----------------------------------------------------------------------------------*/ 
/*-----------------------------------------------------------------------------------*/ 

function create() {
  //état de cuisson
  square = this.add.rectangle(290, 580, 30, 30,0xFFFFFF);
  square.setDepth(1);

  // Création du texte du timer
  let Min = Math.floor(timer/60);
  timerText = this.add.text(30, 30, 'Temps restant : ' + Min  + 'min' + timer%60 +'sec', { font: '15px bold arial', fill: '#000000' });
  timerText.setDepth(1);

  // Définition de l'événement qui se produit chaque seconde
  this.time.addEvent({ delay: 1000, callback: onTimerTick, callbackScope: this, loop: true });

  //Score
  ScoreText = this.add.text(30, 50, 'Score :' + Score, { font: '15px bold arial', fill: '#000000' });
  ScoreText.setDepth(1);
  //Ajoute le fond
  this.add.image(340, 320, "Fond");

  //Recette Burger
  this.add.image(490, 90, "Pain");
  this.add.image(490, 155, "Steak");
  this.add.image(490, 225, "Salade");
  this.add.image(485, 285, "BurgerCuit");

  //Recette Oeuf
  this.add.image(565, 90, "Oeuf");
  this.add.image(560, 155, "AssietteOeufCuit");

  //Recette Poulet Salade
  this.add.image(640, 90, "Poulet");
  this.add.image(640, 155, "Salade");
  this.add.image(635, 215, "AssiettePouletCuitSalade");

  //Slider //
  var FlecheDroite = this.add.image(380, 50, "FlecheDroite");
  FlecheDroite.setInteractive();
  FlecheDroite.on('pointerdown', function () 
  {
    console.log("L'utilisateur a cliqué sur FlecheDroite !");
    if(FrigoAliment == 4)
    {
      FrigoAliment = 0;
    }
    else
    {
      FrigoAliment++;
    }

    console.log(FrigoAliment);
    sliderOn = true;
  });
  
  var FlecheGauche = this.add.image(275, 50, "FlecheGauche");
  FlecheGauche.setInteractive();
  FlecheGauche.on('pointerdown', function () 
  {
    console.log("L'utilisateur a cliqué sur FlecheGauche !");
    if(FrigoAliment == 0)
    {
      FrigoAliment = 4;
    }
    else
    {
      FrigoAliment--;
    }

    console.log(FrigoAliment);
    sliderOn = true;
  });

  //Ajoute le mec au millieu
  player = this.physics.add.sprite(290, 320, "mec");

  //Ajout des poeles
  Cuiss1 = this.physics.add.sprite(235, 575, "PoeleCuiss");

  player.setOrigin(0.39, 0.5);
  player.setSize(61, 61);
  var radius = 31;
  player.body.setCircle(radius, 7, 16);

  player.setBounce(0); //Rebondissement
  player.setCollideWorldBounds(true);

  //Les différentes annimations
  /*------------------------------Lavage-----------------------------------------------*/
  /*-----------------------------------------------------------------------------------*/
  /*-----------------------------------------------------------------------------------*/
  let anim = this.anims.create({
    key: 'LavagePoele',
    frames: this.anims.generateFrameNumbers('Poele', { start: 10, end: 20 }),
    frameRate: 2,
    repeat: 0
  });
  /*-----------------------------------------------------------------------------------*/
  /*-----------------------------------------------------------------------------------*/
  /*-----------------------------------------------------------------------------------*/

  player.anims.create({
    key: "Vide",
    frames: [{ key: "mec", frame: 0 }],
    frameRate: 1,
  });

  player.anims.create({
    key: "Poulet",
    frames: [{ key: "mec", frame: 1 }],
    frameRate: 1,
  });

  player.anims.create({
    key: "Oeuf",
    frames: [{ key: "mec", frame: 2 }],
    frameRate: 1,
  });

  player.anims.create({
    key: "Salade",
    frames: [{ key: "mec", frame: 3 }],
    frameRate: 1,
  });

  player.anims.create({
    key: "SaladeCoupe",
    frames: [{ key: "mec", frame: 4 }],
    frameRate: 1,
  });

  player.anims.create({
    key: "Steack",
    frames: [{ key: "mec", frame: 5 }],
    frameRate: 1,
  });

  player.anims.create({
    key: "Pain",
    frames: [{ key: "mec", frame: 6 }],
    frameRate: 1,
  });

  player.anims.create({
    key: "PoeleVide",
    frames: [{ key: "mec", frame: 7 }],
    frameRate: 1,
  });

  player.anims.create({
    key: "PoelePouletCru",
    frames: [{ key: "mec", frame: 8 }],
    frameRate: 1,
  });

  player.anims.create({
    key: "PoelePouletCuit",
    frames: [{ key: "mec", frame: 9 }],
    frameRate: 1,
  });

  player.anims.create({
    key: "PoelePouletCrame",
    frames: [{ key: "mec", frame: 10 }],
    frameRate: 1,
  });

  player.anims.create({
    key: "PoeleOeufcru",
    frames: [{ key: "mec", frame: 11 }],
    frameRate: 1,
  });

  player.anims.create({
    key: "PoeleOeufcuit",
    frames: [{ key: "mec", frame: 12 }],
    frameRate: 1,
  });

  player.anims.create({
    key: "PoeleOeufCrame",
    frames: [{ key: "mec", frame: 13 }],
    frameRate: 1,
  });

  player.anims.create({
    key: "PoeleSteackCru",
    frames: [{ key: "mec", frame: 14 }],
    frameRate: 1,
  });

  player.anims.create({
    key: "PoeleSteackCuit",
    frames: [{ key: "mec", frame: 15 }],
    frameRate: 1,
  });

  player.anims.create({
    key: "PoeleSteackCrame",
    frames: [{ key: "mec", frame: 16 }],
    frameRate: 1,
  });

  player.anims.create({
    key: "PoeleSale",
    frames: [{ key: "mec", frame: 17 }],
    frameRate: 1,
  });

  player.anims.create({
    key: "MecCoca",
    frames: [{ key: "mec", frame: 18 }],
    frameRate: 1,
  });

  player.anims.create({
    key: "MecFanta",
    frames: [{ key: "mec", frame: 19 }],
    frameRate: 1,
  });

  player.anims.create({
    key: "MecEau",
    frames: [{ key: "mec", frame: 20 }],
    frameRate: 1,
  });

  player.anims.create({
    key: "AssieteVide",
    frames: [{ key: "mec", frame: 21 }],
    frameRate: 1,
  });

  player.anims.create({
    key: "AssieteOeufCru",
    frames: [{ key: "mec", frame: 22 }],
    frameRate: 1,
  });

  player.anims.create({
    key: "AssieteOeufCuit",
    frames: [{ key: "mec", frame: 23 }],
    frameRate: 1,
  });

  player.anims.create({
    key: "AssieteOeufCrame",
    frames: [{ key: "mec", frame: 24 }],
    frameRate: 1,
  });

  player.anims.create({
    key: "AssietePain",
    frames: [{ key: "mec", frame: 25 }],
    frameRate: 1,
  });

  player.anims.create({
    key: "AssietePainSteakCru",
    frames: [{ key: "mec", frame: 26 }],
    frameRate: 1,
  });

  player.anims.create({
    key: "AssietePainSteakCruSalade",
    frames: [{ key: "mec", frame: 27 }],
    frameRate: 1,
  });

  player.anims.create({
    key: "AssietePainSteakCuit",
    frames: [{ key: "mec", frame: 28 }],
    frameRate: 1,
  });

  player.anims.create({
    key: "AssietePainSteakCuitSalade",
    frames: [{ key: "mec", frame: 29 }],
    frameRate: 1,
  });

  player.anims.create({
    key: "AssietePainSteakCrame",
    frames: [{ key: "mec", frame: 30 }],
    frameRate: 1,
  });

  player.anims.create({
    key: "AssietePainSteakCrameSalade",
    frames: [{ key: "mec", frame: 31 }],
    frameRate: 1,
  });

  player.anims.create({
    key: "AssietePouletCru",
    frames: [{ key: "mec", frame: 32 }],
    frameRate: 1,
  });

  player.anims.create({
    key: "AssietePouletCruSalade",
    frames: [{ key: "mec", frame: 33 }],
    frameRate: 1,
  });

  player.anims.create({
    key: "AssietePouletCuit",
    frames: [{ key: "mec", frame: 34 }],
    frameRate: 1,
  });

  player.anims.create({
    key: "AssietePouletCuitSalade",
    frames: [{ key: "mec", frame: 35 }],
    frameRate: 1,
  });

  player.anims.create({
    key: "AssietePouletCrame",
    frames: [{ key: "mec", frame: 36 }],
    frameRate: 1,
  });

  player.anims.create({
    key: "AssietePouletCrameSalade",
    frames: [{ key: "mec", frame: 37 }],
    frameRate: 1,
  });

  //Permet d'avoir une intéraction avec le clavier
  cursors = this.input.keyboard.createCursorKeys();

  keyEnter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
  //permet de creer l'environement de jeux
  bounds = new Phaser.Geom.Rectangle(98, 98, 362, 460);
  //player.body.setSize(36, 36);
  player.body.setBoundsRectangle(bounds);

  //Définir l'état de base
  Etat = 0;

  //Choix du plat voulu à 0
  choix =0;

  //Créer un objet Graphics
  //const graphics = this.add.graphics();
   //Définir la couleur de remplissage à rouge
  //graphics.fillStyle(0xff0000);
  // Dessiner un rectangle rempli de couleur dans la zone atteignable
  
  /*
  graphics.fillRectShape(Assietes);
  graphics.fillRectShape(Evier);
  graphics.fillRectShape(Poubelle);
  graphics.fillRectShape(Frigo);
  graphics.fillRectShape(Poele1);
  graphics.fillRectShape(Plats1);
  */

  //graphics.fillRectShape(player);
  images = ['Steak','Poulet','Oeuf','Pain','Salade'];
  image = this.add.image(330, 50, images[FrigoAliment]);

}

/*-----------------------------------------------------------------------------------*/
/*-----------------------------------------------------------------------------------*/ 
/*-----------------------------------------------------------------------------------*/ 

/*-------------Timer de 5 minutes pour le temps de jeux---------------------------------*/
function onTimerTick() {
  // Décrémentation du timer
  timer--;
  // Mise à jour du texte du timer
  let Min = Math.floor(timer/60);
  timerText.setText('Temps restant : ' + Min + 'min' + timer%60 +'sec');

  // Si le timer atteint 0, arrêt du jeu
  if (timer === 0) {
      afficherFenetre(Score);
      this.scene.pause();
  }
  console.log(timer);

  if (brule == true) {
      avancement++;
      console.log("Avancement incrémentée :", avancement);
  }
}
/*-------------------------------------------------------------------------------------*/
/*TEst*/
/*
window.addEventListener('load', function() {
  start = false;
  afficherFenetre(0); // Affiche la fenêtre modale avec un score initial de 0
});
*/


function afficherFenetre(Score) {
  var fenetre = document.createElement("div");
  fenetre.style.position = "fixed";
  fenetre.style.width = "500px";
  fenetre.style.height = "500px";
  fenetre.style.backgroundColor = "white";
  fenetre.style.border = "3px solid lightgray";
  fenetre.style.borderRadius = "20px";
  fenetre.style.top = "50%";
  fenetre.style.left = "50%";
  fenetre.style.transform = "translate(-50%, -50%)";

  var contenu = document.createElement("div");
  contenu.innerHTML = "Score: " + Score;

  var boutonJouer = document.createElement("button");
  boutonJouer.innerHTML = "Jouer";
  boutonJouer.style.position = "absolute";
  boutonJouer.style.left = "50%";
  boutonJouer.style.top = "90%";
  boutonJouer.style.transform = "translate(-50%, -50%)";
  boutonJouer.onclick = function() {
    location.reload(); // Actualiser la page
    // Code pour démarrer le jeu Phaser
    // Cela peut inclure la création du jeu, la configuration des scènes, etc.
  };

  var image = document.createElement("img");
  image.src = "./Image/Didact.png";
  image.style.display = "block";
  image.style.margin = "30px auto 0";
  image.style.width = "80%";

  var boutonQuitter = document.createElement("button");
  boutonQuitter.innerHTML = "Quitter";
  boutonQuitter.style.position = "absolute";
  boutonQuitter.style.left = "50%";
  boutonQuitter.style.top = "95%";
  boutonQuitter.style.transform = "translate(-50%, -50%)";
  boutonQuitter.onclick = function() {
    window.location.href = "#"; // Redirection vers une autre page
  };

  fenetre.appendChild(contenu);
  fenetre.appendChild(image);
  fenetre.appendChild(boutonJouer);
  fenetre.appendChild(boutonQuitter);

  document.body.appendChild(fenetre);
}
/*Fin test*/
/*-------------Permet de pas bouger quand on netoie la poele----------------------------*/
function Deplacement() {
  console.log("Cinq secondes se sont écoulées !");
  Dep = true;
  Poele.destroy();
  player.anims.play("PoeleVide", true);
  Etat = 7;
  C1 = 0;
}
/*-------------------------------------------------------------------------------------*/

/*---------------------------------Upgrade---------------------------------------------*/
//Ne marche pas car add en fonction ne fonctionne pas//
/*function up() {
  if(brule == true)
  {
    if(avancement == 3)
    {
      switch(C1)
      {
        case 7://Poulet
          Cuiss1.destroy();
          Cuiss1 = this.physics.add.sprite(235, 575, "PoeleCuiss",8);
          C1 = 8;
        break;
      }
    }
    else
    {
      if(avancement == 7)
      {
        switch(C1)
        {
          case 8:
            Cuiss1.destroy();
            Cuiss1 = this.physics.add.sprite(235, 575, "PoeleCuiss",9);
            C1 = 9;
          break;
        }
      }
    }
  }
}
*/
/*-------------------------------------------------------------------------------------*/

/*Permet de pas avoir 20 événements quand on reste trop longtepms sur la touche appuyer*/
function cursor() {
  console.log("une seconde c'est écoulées !");
  curDown = true;
}
/*-------------------------------------------------------------------------------------*/

// Fonction de génération du nombre aléatoire
function getRandomNumber(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function update() {

  if(choix == 0)
  {
    choix = getRandomNumber(1, 3);
    console.log("Choix: " +  choix);
    if(choix == 1)
    {
      ChoixImage = this.physics.add.sprite(638, 360, "PoeleCuiss",29);
    }
    if(choix == 2)
    {
      ChoixImage = this.physics.add.sprite(638, 360, "PoeleCuiss",23);
    }
    if(choix == 3)
    {
      ChoixImage = this.physics.add.sprite(638, 360, "PoeleCuiss",35);
    }
  }

  //caré de cuisson
  if(avancement == 0)
  {
    square.setFillStyle(0xFFFFFF);
  }

  //Changement d'état de la poele pour la cuisson
  if(brule == true)
  {
    if(avancement == 6)
    {
      square.setFillStyle(0x00FF00);
      
      switch(C1)
      {
        case 1://oeuf
          Cuiss1.destroy();
          Cuiss1 = this.physics.add.sprite(235, 575, "PoeleCuiss",2);
          C1 = 2;
        break;
        case 4://oeuf
          Cuiss1.destroy();
          Cuiss1 = this.physics.add.sprite(235, 575, "PoeleCuiss",5);
          C1 = 5;
        break;
        case 7://Poulet
          Cuiss1.destroy();
          Cuiss1 = this.physics.add.sprite(235, 575, "PoeleCuiss",8);
          C1 = 8;
      break;
      }
    }
    else
    {
      if(avancement == 12)
      {
        square.setFillStyle(0xFF0000);
        switch(C1)
        {
          case 2:
            Cuiss1.destroy();
            Cuiss1 = this.physics.add.sprite(235, 575, "PoeleCuiss",3);
            C1 = 3;
            brule = false;
          break;
          case 5:
            Cuiss1.destroy();
            Cuiss1 = this.physics.add.sprite(235, 575, "PoeleCuiss",6);
            C1 = 6;
            brule = false;
          break;
          case 8:
            Cuiss1.destroy();
            Cuiss1 = this.physics.add.sprite(235, 575, "PoeleCuiss",9);
            C1 = 9;
            brule = false;
          break;
        }
      }
    }
  }

  if(sliderOn == true)
  {
    image.destroy();
    image = this.add.sprite(330, 50, images[FrigoAliment]);
    sliderOn = false;
  }

  //Calcul des zones
  if(curDown == true)
  {
    if (Phaser.Geom.Intersects.RectangleToRectangle(player.getBounds(), Evier)) 
    {
      if(cursors.space.isDown && Etat == 17)
      {
          Poele = this.physics.add.sprite(60, 360, "Poele");
          Poele.anims.play("LavagePoele", true);
          angle = 270;
          Poele.rotation = (angle * Math.PI) / 180;

          player.anims.play("Vide", true);
          Etat = 0;
          Dep = false;
          player.setVelocityX(0);
          player.setVelocityY(0);
          setTimeout(Deplacement, 5000);
          avancement = 0;
      }
    }
    else 
    {
      if (Phaser.Geom.Intersects.RectangleToRectangle(player.getBounds(), Assietes)) 
      {
        if(cursors.space.isDown && Etat == 0 && AE == 0)
        {
          player.anims.play("AssieteVide", true);
          Etat = 21;
          AE =21;
        }
      } 
      else 
      {
          if (Phaser.Geom.Intersects.RectangleToRectangle(player.getBounds(),Poubelle)) 
          {
            if(cursors.space.isDown && Etat != 0 && Etat != 7)
            {
              //console.log(Etat)
              if(Etat >=21 && Etat <=37)
              {
                AE = 0;
              }

              if(Etat > 7 && Etat < 18)
              {
                player.anims.play("PoeleSale", true);
                Etat = 17;
              }
              else{
                player.anims.play("Vide", true);
                Etat = 0;
              }
            }
          } 
          else 
          {
            if (Phaser.Geom.Intersects.RectangleToRectangle(player.getBounds(),Frigo)) 
            {
              if(cursors.space.isDown && ((Etat >= 0 ||Etat <= 6) && Etat != 4 ))
              {
                switch (FrigoAliment) {
                  case 0:
                      if(Etat == 5)
                      {
                        player.anims.play("Vide", true);
                        Etat = 0;
                      }
                      else
                      {
                        player.anims.play("Steack", true);
                        Etat = 5;
                      }
                      break;
                  case 1:
                      if(Etat == 1)
                      {
                        player.anims.play("Vide", true);
                        Etat = 0;
                      }
                      else
                      {
                        player.anims.play("Poulet", true);
                        Etat = 1;
                      }
                      break;
                  case 2:
                      if(Etat == 2)
                      {
                        player.anims.play("Vide", true);
                        Etat = 0;
                      }
                      else
                      {
                        player.anims.play("Oeuf", true);
                        Etat = 2;
                      }
                      break;
                  case 3:
                      if(Etat == 6)
                      {
                        player.anims.play("Vide", true);
                        Etat = 0;
                      }
                      else
                      {
                        player.anims.play("Pain", true);
                        Etat = 6;
                      }
                      break;
                  case 4:
                      if(Etat == 3)
                      {
                        player.anims.play("Vide", true);
                        Etat = 0;
                      }
                      else
                      {
                        player.anims.play("Salade", true);
                        Etat = 3;
                      }
                      break;
                }
                curDown = false;
                setTimeout(cursor, 500);
              }
            } 
            else 
            {
              if (Phaser.Geom.Intersects.RectangleToRectangle(player.getBounds(),Plats1)) 
              {
                  if(cursors.space.isDown)
                  {
                    /*
                    console.log("Etat:" + Etat);
                    console.log("AE:" + AE);
                    */
                    //Si l'assiette est sur la table
                    if(A1 == true)
                    {
                      //si le mec est vide prendre l'assiette
                      if(Etat == 0)
                      {
                        switch(AE)
                        {
                          case 21:
                            player.anims.play("AssieteVide", true);
                          break;
                          case 22:
                            player.anims.play("AssieteOeufCru", true);
                          break;
                          case 23:
                            player.anims.play("AssieteOeufCuit", true);
                          break;
                          case 24:
                            player.anims.play("AssieteOeufCrame", true);
                          break;
                          case 25:
                            player.anims.play("AssietePain", true);
                          break;
                          case 26:
                            player.anims.play("AssietePainSteakCru", true);
                          break;
                          case 27:
                            player.anims.play("AssietePainSteakCruSalade", true);
                          break;
                          case 28:
                            player.anims.play("AssietePainSteakCuit", true);
                          break;
                          case 29:
                            player.anims.play("AssietePainSteakCuitSalade", true);
                          break;
                          case 30:
                            player.anims.play("AssietePainSteakCrame", true);
                          break;
                          case 31:
                            player.anims.play("AssietePainSteakCrameSalade", true);
                          break;
                          case 32:
                            player.anims.play("AssietePouletCru", true);
                          break;
                          case 33:
                            player.anims.play("AssietePouletCruSalade", true);
                          break;
                          case 34:
                            player.anims.play("AssietePouletCuit", true);
                          break;
                          case 35:
                            player.anims.play("AssietePouletCuitSalade", true);
                          break;
                          case 36:
                            player.anims.play("AssietePouletCrame", true);
                          break;
                          case 37:
                            player.anims.play("AssietePouletCrameSalade", true);
                          break;
                        }
                        assi.destroy();
                        A1 = false;
                        Etat = AE;
                      }
                      else//Sinon déposer l'aliment dans l'assiette
                      {
                        if(Etat == 1 || Etat == 2 || Etat == 3 || Etat == 5 || Etat == 6)//si avec aliment normal
                        {
                          if(AE == 21 && (Etat == 1 || Etat == 2 || Etat == 6))//Si l'assiette est vide
                          {
                            switch(Etat)
                            {
                              case 1:
                                AE = 32;
                              break;
                              case 2:
                                AE = 22;
                              break;
                              case 6:
                                AE = 25;
                              break;
                            }
                            assi.destroy();
                            assi = this.physics.add.sprite(485, 355, "PoeleCuiss",AE);
                            player.anims.play("Vide", true);
                            Etat = 0;
                          }

                          if(Etat == 3 && (AE == 26 || AE == 28 || AE == 30 || AE == 32 || AE == 34 || AE == 36))
                          {
                            switch(AE)
                            {
                              case 26: //Burger
                               AE = 27;
                              break;
                              case 28: 
                                AE = 29;
                              break;
                              case 30: 
                                AE = 31;
                              break;
                              case 32: //Poulet
                                AE = 33;
                              break;
                              case 34: 
                                AE = 35;
                              break;
                              case 36: 
                                AE = 37;
                              break;
                            }
                            assi.destroy();
                            assi = this.physics.add.sprite(485, 355, "PoeleCuiss",AE);
                            player.anims.play("Vide", true);
                            Etat = 0;
                          }
                      }

                        if(Etat >=8 && Etat <=16)//Poele
                        {
                          if(AE == 21)//Si l'asssiette est vide
                          {
                            switch(Etat)
                            {
                              case 8://poulet
                                AE = 32;
                              break;
                              case 9:
                                AE = 34;
                              break;
                              case 10:
                                AE = 36;
                              break;
                              case 11://oeuf
                                AE = 22;
                              break;
                              case 12:
                                AE = 23;
                              break;
                              case 13:
                                AE = 24;
                              break;
                            }
                          }

                          if(AE == 25)//Pain seul
                          {
                            switch(Etat)
                            {
                              case 14://poulet
                                AE = 26;
                              break;
                              case 15:
                                AE = 28;
                              break;
                              case 16:
                                AE = 30;
                              break;
                            }
                          }
                          assi.destroy();
                          assi = this.physics.add.sprite(485, 355, "PoeleCuiss",AE);
                          player.anims.play("PoeleSale", true);
                          Etat = 17;
                          C1 = 10;
                        }
                      }
                    }
                    else//déposer l'assiette en fonction du type
                    {
                      if(AE >= 21)
                      {
                        assi = this.physics.add.sprite(485, 355, "PoeleCuiss",AE);
                        player.anims.play("Vide", true);
                        AE = Etat;
                        Etat = 0;
                        A1 = true;
                      }
                    }
                    curDown = false;
                    setTimeout(cursor, 500);
                    
                    console.log("After");
                    console.log("Etat:" + Etat);
                    console.log("AE:" + AE);
                    
                  }
                  else
                  {
                    if(keyEnter.isDown)
                    {
                      /*
                      console.log("Enter");
                      console.log("A1:" + A1);
                      console.log("AE:" + AE);
                      */

                      let verif;//Sert à ne pas rendre le mauvais plat voulu
                      if(AE >= 22 && AE <=24)
                      {
                        verif = 2;
                      }
                      else
                      {
                        if(AE >= 25 && AE <=31)
                        {
                          verif = 1;
                        }
                        else
                        {
                          verif = 3;
                        }
                      }


                      if(AE >= 22 && AE <= 37 && A1 == true && verif == choix)
                      {
                        switch(AE)
                        {
                          case 24:
                          case 25:
                            Score += 1;
                          break;
                          case 22: 
                          case 32: 
                          case 36: 
                            Score += 2;
                          break;
                          case 30:
                          case 37: 
                            Score += 3;
                          break;
                          case 26:
                          case 33:
                          case 34: 
                            Score += 4;
                          break;
                          case 23:
                          case 27:
                          case 28:
                          case 31: 
                            Score += 6;
                          break;
                          case 35: 
                            Score += 8;
                          break;
                          case 28: 
                            Score += 8;
                        break;
                        }
                        assi.destroy();
                        AE = 0;
                        A1 = false;
                        choix = 0;
                        ChoixImage.destroy();
                        ScoreText.setText('Score : ' + Score);
                      }
                      curDown = false;
                      setTimeout(cursor, 500);
                    }                  
 
                  }                   
              } 
              else 
              {
                if (Phaser.Geom.Intersects.RectangleToRectangle(player.getBounds(),Poele1)) 
                {
                  //prendre mettre la poele
                  if(cursors.space.isDown)
                  {
                    switch(Etat){
                      //Mec Vide
                      case 0:
                        switch(C1){
                          case 0:
                            player.anims.play("PoeleVide", true);
                            Etat = 7;
                            Cuiss1.destroy();
                          break;
                          case 1:
                            player.anims.play("PoeleOeufcru", true);
                            Etat =11;
                            Cuiss1.destroy();
                            brule = false;
                          break;
                          case 2:
                            player.anims.play("PoeleOeufcuit", true);
                            Etat = 12;
                            Cuiss1.destroy();
                            brule = false;
                          break;
                          case 3:
                            player.anims.play("PoeleOeufCrame", true);
                            Etat = 13;
                            Cuiss1.destroy();
                            brule = false;
                          break;
                          case 4:
                            player.anims.play("PoeleSteackCru", true);
                            Etat = 14;
                            Cuiss1.destroy();
                            brule = false;
                          break;
                          case 5:
                            player.anims.play("PoeleSteackCuit", true);
                            Etat = 15;
                            Cuiss1.destroy();
                            brule = false;
                          break;
                          case 6:
                            player.anims.play("PoeleSteackCrame", true);
                            Etat = 16;
                            Cuiss1.destroy();
                            brule = false;
                          break;
                          case 7:
                            player.anims.play("PoelePouletCru", true);
                            Etat = 8;
                            Cuiss1.destroy();
                            brule = false;
                          break;
                          case 8:
                            player.anims.play("PoelePouletCuit", true);
                            Etat = 9;
                            Cuiss1.destroy();
                            brule = false;
                          break;
                          case 9:
                            player.anims.play("PoelePouletCrame", true);
                            Etat = 10;
                            Cuiss1.destroy();
                            brule = false;
                          break;
                          case 10:
                            player.anims.play("PoeleSale", true);
                            Etat = 17;
                            Cuiss1.destroy();
                            brule = false;
                          break;
                        }
                      break;
                      case 1://Mec avec une poele
                        if(C1 == 0)
                        {
                          player.anims.play("Vide", true);
                          Etat = 0;
                          Cuiss1.destroy();
                          Cuiss1 = this.physics.add.sprite(235, 575, "PoeleCuiss",7);
                          //Cuiss1.anims.play("PoelePouletCruA", true);
                          C1 = 7;
                          brule = true;
                          avancement = 0;
                        }
                      break;
                      case 2:
                        if(C1 == 0)
                        {
                          player.anims.play("Vide", true);
                          Etat = 0;
                          Cuiss1.destroy();
                          Cuiss1 = this.physics.add.sprite(235, 575, "PoeleCuiss",1);
                          //Cuiss1.anims.play("PoeleOeufCruA", true);
                          C1 = 1;
                          brule = true;
                          avancement = 0;
                        }
                      break;
                      case 5:
                        if(C1 == 0)
                        {
                          player.anims.play("Vide", true);
                          Etat = 0;
                          Cuiss1.destroy();
                          Cuiss1 = this.physics.add.sprite(235, 575, "PoeleCuiss",4);
                          //Cuiss1.anims.play("PoeleSteackCruA", true);
                          C1 = 4;
                          brule = true;
                          avancement = 0;
                        }
                      break;
                      //Vide
                      case 7:
                        player.anims.play("Vide", true);
                        Etat = 0;
                        Cuiss1.destroy();
                        Cuiss1 = this.physics.add.sprite(235, 575, "PoeleCuiss",0);
                        //Cuiss1.anims.play("PoeleVideCuissA", true);
                        C1 = 0;
                      break;
                      //Poulet
                      case 8:
                        player.anims.play("Vide", true);
                        Etat = 0;
                        Cuiss1.destroy();
                        Cuiss1 = this.physics.add.sprite(235, 575, "PoeleCuiss",7);
                        //Cuiss1.anims.play("PoelePouletCruA", true);
                        C1 = 7;
                        brule = true;
                      break;
                      case 9:
                        player.anims.play("Vide", true);
                        Etat = 0;
                        Cuiss1.destroy();
                        Cuiss1 = this.physics.add.sprite(235, 575, "PoeleCuiss",8);
                        //Cuiss1.anims.play("PoelePouletCuitA", true);
                        C1 = 8;
                        brule = true;
                      break;
                      case 10:
                        player.anims.play("Vide", true);
                        Etat = 0;
                        Cuiss1.destroy();
                        Cuiss1 = this.physics.add.sprite(235, 575, "PoeleCuiss",9);
                        //Cuiss1.anims.play("PoelePouletCrameA", true);
                        C1 = 9;
                        brule = true;
                      break;
                      //Oeuf
                      case 11:
                        player.anims.play("Vide", true);
                        Etat = 0;
                        Cuiss1.destroy();
                        Cuiss1 = this.physics.add.sprite(235, 575, "PoeleCuiss",1);
                        //Cuiss1.anims.play("PoeleOeufCruA", true);
                        C1 = 1;
                        brule = true;
                      break;
                      case 12:
                        player.anims.play("Vide", true);
                        Etat = 0;
                        Cuiss1.destroy();
                        Cuiss1 = this.physics.add.sprite(235, 575, "PoeleCuiss",2);
                        //Cuiss1.anims.play("PoeleOeufCuitA", true);
                        C1 = 2;
                        brule = true;
                      break;
                      case 13:
                        player.anims.play("Vide", true);
                        Etat = 0;
                        Cuiss1.destroy();
                        Cuiss1 = this.physics.add.sprite(235, 575, "PoeleCuiss",3);
                        //Cuiss1.anims.play("PoeleOeufCraméA", true);
                        C1 = 3;
                      break;
                      //Steak
                      case 14:
                        player.anims.play("Vide", true);
                        Etat = 0;
                        Cuiss1.destroy();
                        Cuiss1 = this.physics.add.sprite(235, 575, "PoeleCuiss",4);
                        //Cuiss1.anims.play("PoeleSteackCruA", true);
                        C1 = 4;
                        brule = true;
                      break;
                      case 15:
                        player.anims.play("Vide", true);
                        Etat = 0;
                        Cuiss1.destroy();
                        Cuiss1 = this.physics.add.sprite(235, 575, "PoeleCuiss",5);
                        //Cuiss1.anims.play("PoeleSteackCuitA", true);
                        C1 = 5;
                        brule = true;
                      break;
                      case 16:
                        player.anims.play("Vide", true);
                        Etat = 0;
                        Cuiss1.destroy();
                        Cuiss1 = this.physics.add.sprite(235, 575, "PoeleCuiss",6);
                        //Cuiss1.anims.play("PoeleSteackCrameA", true);
                        C1 = 6;
                      break;
                      //Sale
                      case 17:
                        player.anims.play("Vide", true);
                        Etat = 0;
                        Cuiss1.destroy();
                        Cuiss1 = this.physics.add.sprite(235, 575, "PoeleCuiss",10);
                        //Cuiss1.anims.play("PoeleSalA", true);
                        C1 = 10;
                      break;
                    }
                    console.log("C1:"+C1);
                    console.log("Etat:"+Etat);
                    curDown = false;
                    setTimeout(cursor, 500);
                  }
                } 
              }
            }
          }
        }
      }
    }


  //-----------------deplacement du joueur avec les rotatins--------------------------//
  if(Dep == true)
  {
    if (cursors.left.isDown && cursors.up.isDown) 
    {
      //left-up
      player.setVelocityX(-160);
      player.setVelocityY(-160);
      angle = 225;
      player.rotation = (angle * Math.PI) / 180;
    } 
    else 
    {
      if (cursors.right.isDown && cursors.up.isDown) 
      {
        //Right-up
        player.setVelocityX(160);
        player.setVelocityY(-160);
        angle = 315;
        player.rotation = (angle * Math.PI) / 180;
      } 
      else 
      {
        if (cursors.left.isDown && cursors.down.isDown) 
        {
          //Left-down
          player.setVelocityX(-160);
          player.setVelocityY(160);
          angle = 135;
          player.rotation = (angle * Math.PI) / 180;
        } 
        else 
        {
          if (cursors.right.isDown && cursors.down.isDown) 
          {
            //Right-down
            player.setVelocityX(160);
            player.setVelocityY(160);
            angle = 45;
            player.rotation = (angle * Math.PI) / 180;
          }
          else 
          {
            //Position des X
            if (cursors.left.isDown) 
            {
              player.setVelocityX(-160);
              angle = 180;
              player.rotation = (angle * Math.PI) / 180;
            } 
            else 
            {
              if (cursors.right.isDown) 
              {
                player.setVelocityX(160);
                angle = 0;
                player.rotation = (angle * Math.PI) / 180;
              } 
              else 
              {
                player.setVelocityX(0);
              }
            }

            //Position des Y
            if (cursors.up.isDown) 
            {
              player.setVelocityY(-160);
              angle = 270;
              player.rotation = (angle * Math.PI) / 180;
            } 
            else 
            {
              if (cursors.down.isDown) 
              {
                player.setVelocityY(160);
                angle = 90;
                player.rotation = (angle * Math.PI) / 180;
              } 
              else 
              {
                player.setVelocityY(0);
              }
            }
          }
        }
      }
    }
  }
//------------------------------------------------------------------------//
  
}
