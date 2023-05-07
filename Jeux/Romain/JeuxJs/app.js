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
var timer = 300;

//Score
var ScoreText;
var Score = 0;

//Slider du frigo
//Image actuelle
var image;
//Vecteur d'image
var images;
//Si changement
var sliderOn = true;
//Les zones où les interactions sont possible
const Assietes = new Phaser.Geom.Rectangle(90, 550, 15, 15);
const Evier = new Phaser.Geom.Rectangle(100, 375, 5, 1);
const Couteau = new Phaser.Geom.Rectangle(100, 175, 20, 20);
const Poubelle = new Phaser.Geom.Rectangle(100, 290, 5, 1);
const Frigo = new Phaser.Geom.Rectangle(290, 100, 70, 20);
const Plats1 = new Phaser.Geom.Rectangle(450, 350, 5, 1);
const Plats2 = new Phaser.Geom.Rectangle(450, 500, 5, 1);
const Poele1 = new Phaser.Geom.Rectangle(235, 550, 5, 1);
const Poele2 = new Phaser.Geom.Rectangle(325, 550, 5, 1);



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
 
  
  player.setOrigin(0.39, 0.5);
  player.setSize(61, 61);
  var radius = 31;
  player.body.setCircle(radius, 7, 16);

  player.setBounce(0); //Rebondissement
  player.setCollideWorldBounds(true);

  //var spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
  //Les différentes annimations
  let anim = this.anims.create({
    key: 'LavagePoele',
    frames: this.anims.generateFrameNumbers('Poele', { start: 10, end: 20 }),
    frameRate: 2,
    repeat: 0
  });

  this.anims.create({
    key: "Vide",
    frames: [{ key: "mec", frame: 0 }],
    frameRate: 1,
  });

  this.anims.create({
    key: "Poulet",
    frames: [{ key: "mec", frame: 1 }],
    frameRate: 1,
  });

  this.anims.create({
    key: "Oeuf",
    frames: [{ key: "mec", frame: 2 }],
    frameRate: 1,
  });

  this.anims.create({
    key: "Salade",
    frames: [{ key: "mec", frame: 3 }],
    frameRate: 1,
  });

  this.anims.create({
    key: "SaladeCoupe",
    frames: [{ key: "mec", frame: 4 }],
    frameRate: 1,
  });

  this.anims.create({
    key: "Steack",
    frames: [{ key: "mec", frame: 5 }],
    frameRate: 1,
  });

  this.anims.create({
    key: "Pain",
    frames: [{ key: "mec", frame: 6 }],
    frameRate: 1,
  });

  this.anims.create({
    key: "PoeleVide",
    frames: [{ key: "mec", frame: 7 }],
    frameRate: 1,
  });

  this.anims.create({
    key: "PoelePouletCru",
    frames: [{ key: "mec", frame: 8 }],
    frameRate: 1,
  });

  this.anims.create({
    key: "PoelePouletCuit",
    frames: [{ key: "mec", frame: 9 }],
    frameRate: 1,
  });

  this.anims.create({
    key: "PoelePouletCrame",
    frames: [{ key: "mec", frame: 10 }],
    frameRate: 1,
  });

  this.anims.create({
    key: "PoeleOeufcru",
    frames: [{ key: "mec", frame: 11 }],
    frameRate: 1,
  });

  this.anims.create({
    key: "PoeleOeufcuit",
    frames: [{ key: "mec", frame: 12 }],
    frameRate: 1,
  });

  this.anims.create({
    key: "PoeleOeufCrame",
    frames: [{ key: "mec", frame: 13 }],
    frameRate: 1,
  });

  this.anims.create({
    key: "PoeleSteackCru",
    frames: [{ key: "mec", frame: 14 }],
    frameRate: 1,
  });

  this.anims.create({
    key: "PoeleSteackCuit",
    frames: [{ key: "mec", frame: 15 }],
    frameRate: 1,
  });

  this.anims.create({
    key: "PoeleSteackCrame",
    frames: [{ key: "mec", frame: 16 }],
    frameRate: 1,
  });

  this.anims.create({
    key: "PoeleSale",
    frames: [{ key: "mec", frame: 17 }],
    frameRate: 1,
  });

  this.anims.create({
    key: "MecCoca",
    frames: [{ key: "mec", frame: 18 }],
    frameRate: 1,
  });

  this.anims.create({
    key: "MecFanta",
    frames: [{ key: "mec", frame: 19 }],
    frameRate: 1,
  });

  this.anims.create({
    key: "MecEau",
    frames: [{ key: "mec", frame: 20 }],
    frameRate: 1,
  });

  this.anims.create({
    key: "AssieteVide",
    frames: [{ key: "mec", frame: 21 }],
    frameRate: 1,
  });

  this.anims.create({
    key: "AssieteOeufCru",
    frames: [{ key: "mec", frame: 22 }],
    frameRate: 1,
  });

  this.anims.create({
    key: "AssieteOeufCuit",
    frames: [{ key: "mec", frame: 23 }],
    frameRate: 1,
  });

  this.anims.create({
    key: "AssieteOeufCrame",
    frames: [{ key: "mec", frame: 24 }],
    frameRate: 1,
  });

  this.anims.create({
    key: "AssietePain",
    frames: [{ key: "mec", frame: 25 }],
    frameRate: 1,
  });

  this.anims.create({
    key: "AssietePainSteakCru",
    frames: [{ key: "mec", frame: 26 }],
    frameRate: 1,
  });

  this.anims.create({
    key: "AssietePainSteakCruSalade",
    frames: [{ key: "mec", frame: 27 }],
    frameRate: 1,
  });

  this.anims.create({
    key: "AssietePainSteakCuit",
    frames: [{ key: "mec", frame: 28 }],
    frameRate: 1,
  });

  this.anims.create({
    key: "AssietePainSteakCuitSalade",
    frames: [{ key: "mec", frame: 29 }],
    frameRate: 1,
  });

  this.anims.create({
    key: "AssietePainSteakCrame",
    frames: [{ key: "mec", frame: 30 }],
    frameRate: 1,
  });

  this.anims.create({
    key: "AssietePainSteakCrameSalade",
    frames: [{ key: "mec", frame: 31 }],
    frameRate: 1,
  });

  this.anims.create({
    key: "AssietePouletCru",
    frames: [{ key: "mec", frame: 32 }],
    frameRate: 1,
  });

  this.anims.create({
    key: "AssietePouletCruSalade",
    frames: [{ key: "mec", frame: 33 }],
    frameRate: 1,
  });

  this.anims.create({
    key: "AssietePouletCuit",
    frames: [{ key: "mec", frame: 34 }],
    frameRate: 1,
  });

  this.anims.create({
    key: "AssietePouletCuitSalade",
    frames: [{ key: "mec", frame: 35 }],
    frameRate: 1,
  });

  this.anims.create({
    key: "AssietePouletCrame",
    frames: [{ key: "mec", frame: 36 }],
    frameRate: 1,
  });

  this.anims.create({
    key: "AssietePouletCrameSalade",
    frames: [{ key: "mec", frame: 37 }],
    frameRate: 1,
  });

  //Permet d'avoir une intéraction avec le clavier
  cursors = this.input.keyboard.createCursorKeys();
  //permet de creer l'environement de jeux
  bounds = new Phaser.Geom.Rectangle(65, 70, 420, 510);
  //player.body.setSize(36, 36);
  player.body.setBoundsRectangle(bounds);

  //Définir l'état de base
  Etat = 0;

  // Créer un objet Graphics
  //const graphics = this.add.graphics();
  // Définir la couleur de remplissage à rouge
  //graphics.fillStyle(0xff0000);
  // Dessiner un rectangle rempli de couleur dans la zone atteignable
  
  /*
  graphics.fillRectShape(Assietes);
  graphics.fillRectShape(Evier);
  graphics.fillRectShape(Couteau);
  graphics.fillRectShape(Poubelle);
  graphics.fillRectShape(Frigo);
  graphics.fillRectShape(Poele1);
  graphics.fillRectShape(Poele2);
  graphics.fillRectShape(Plats1);
  graphics.fillRectShape(Plats2);
  */

  //graphics.fillRectShape(player);
  images = ['Steak','Poulet','Oeuf','Pain','Salade'];
  image = this.add.image(330, 50, images[FrigoAliment]);
}

/*-----------------------------------------------------------------------------------*/
/*-----------------------------------------------------------------------------------*/ 
/*-----------------------------------------------------------------------------------*/ 

function onTimerTick() {
  // Décrémentation du timer
  timer--;

  // Mise à jour du texte du timer
  let Min = Math.floor(timer/60);
  timerText.setText('Temps restant : ' + Min + 'min' + timer%60 +'sec');

  // Si le timer atteint 0, arrêt du jeu
  if (timer === 0) {
      this.scene.pause();
  }
  console.log(timer);
}

function Deplacement() {
  console.log("Cinq secondes se sont écoulées !");
  Dep = true;
  Poele.destroy();
  player.anims.play("PoeleVide", true);
  Etat = 7;
}

function update() {

  if(sliderOn == true)
  {
    image.destroy();
    image = this.add.sprite(330, 50, images[FrigoAliment]);
    sliderOn = false;
  }

  //Calcul des zones
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
    }
  }
  else 
  {
    if (Phaser.Geom.Intersects.RectangleToRectangle(player.getBounds(), Assietes)) 
    {
      if(cursors.space.isDown && Etat == 0)
      {
        player.anims.play("AssieteVide", true);
        Etat = 21;
      }
    } 
    else 
    {
      if (Phaser.Geom.Intersects.RectangleToRectangle(player.getBounds(), Couteau)) 
      {
        //player.anims.play("Salade", true);
      } 
      else 
      {
        if (Phaser.Geom.Intersects.RectangleToRectangle(player.getBounds(),Poubelle)) 
        {
          if(cursors.space.isDown && Etat != 0)
          {
            //console.log(Etat)
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
            }
          } 
          else 
          {
            if (Phaser.Geom.Intersects.RectangleToRectangle(player.getBounds(),Plats1)) 
            {
              //player.anims.play("AssietePouletCuit", true);
            } 
            else 
            {
              if (Phaser.Geom.Intersects.RectangleToRectangle(player.getBounds(),Plats2)) 
              {
                //player.anims.play("AssietePouletCuit", true);
              } 
              else
              {
                if (Phaser.Geom.Intersects.RectangleToRectangle(player.getBounds(),Poele1)) 
                {
                  if(cursors.space.isDown )//Pas juste
                  {
                      player.anims.play("PoeleSteackCru", true);
                      Etat = 14;
                  }
                } 
                else 
                {
                  if (Phaser.Geom.Intersects.RectangleToRectangle(player.getBounds(),Poele2)) 
                  {
                    //player.anims.play("PoeleSteakCrame", true);
                  } 
                }
              }
            }
          }
        }
      }
    }
  }

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

  //Deplacement

}
