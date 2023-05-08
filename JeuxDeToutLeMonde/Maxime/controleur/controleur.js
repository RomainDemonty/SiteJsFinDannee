var config = 
{
    type: Phaser.AUTO,
    width: 1280,
    height: 704,
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
            debug: true // affiche les contours des corps
        }
    },
    
    scene: 
    {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);
var cursors;
var jerry;
var bordure;
var bool=0;
var iKey;
var randomNum=0;

// Initialiser le tableau
const tableau = []; //zone
const tableau_elem = []; //personnage
const possede = 0; //0     1     2     3

cree_tab_zone();
cree_tab_placement();
// Créer un rectangle pour les potages
const potager_centre = new Phaser.Geom.Rectangle(tableau[102].x, tableau[102].y, 128, 128);
const potager_gauche = new Phaser.Geom.Rectangle(tableau[61].x, tableau[61].y, 128, 128);
const potager_droite = new Phaser.Geom.Rectangle(tableau[149].x, tableau[149].y, 128, 128);//14-7 832-384

const legume_haut = new Phaser.Geom.Rectangle(tableau[202].x, tableau[202].y+16,64,  32);
const legume_centre = new Phaser.Geom.Rectangle(tableau[203].x, tableau[203].y+16, 64,32);
const legume_bas = new Phaser.Geom.Rectangle(tableau[204].x, tableau[204].y+16, 64, 32);

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

function spawnCorbeauBas(x,y)
{
    corbeau = this.physics.add.sprite(x, y, 'corbeau');
    corbeau.anims.play('corb');
    console.log('apparition corbeau bas');
    //faire deplacer le corbeau en ligne droite
    corbeau.body.velocity.y = -32;
    randomNum=0;
}

function spawnCorbeauGauche(x,y)
{
    corbeau = this.physics.add.sprite(x, y, 'corbeau');
    corbeau.anims.play('corb');
    console.log('apparition corbeau gauche');
    //faire deplacer le corbeau en ligne droite
    corbeau.body.velocity.x = +32;
    randomNum=0;
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
    
    //chargement des sprites
    this.load.spritesheet(
        'jerry', 
        './image/jerry.png',
        { frameWidth: 64, frameHeight: 64 } 
    );
     
    this.load.spritesheet(
        'carotte', 
        'carote.png',
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
    //la map
    this.add.image(0, 0, 'map').setOrigin(0);

    //ajout des seed
    this.add.image(1152, 255, 'seedC').setOrigin(0);
    this.add.image(1152, 320, 'seedT').setOrigin(0);
    this.add.image(1152, 390, 'seedP').setOrigin(0);

    //le personnages + ajout des bordures du monde
    jerry = this.physics.add.sprite(300, 150, 'jerry');
    jerry.body.collideWorldBounds = true;

    //evenement du clavier
    evt = this.input.keyboard.createCursorKeys();
    iKey = this.input.keyboard.addKey('i');

    this.sprite = this.add.sprite(tableau_elem[102].x, tableau_elem[102].y, 'carotte');

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

    //mise en  courleur des zones TEST
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
}

/************************************************************************************************************************************************** */

///////////////////////////////////////////////////////////////////////UPDATE/////////////////////////////////////////////////////////////////////////

/************************************************************************************************************************************************** */

function update ()
{
    /////////////////////////////////////////////////////////////
    if(Phaser.Geom.Intersects.RectangleToRectangle(jerry.getBounds(), potager_centre) || 
       Phaser.Geom.Intersects.RectangleToRectangle(jerry.getBounds(), potager_gauche) ||
       Phaser.Geom.Intersects.RectangleToRectangle(jerry.getBounds(), potager_droite))
    {
        //plante au point d'accroche le plus proche un légume qui est pris
        console.log('rentre dans potager')

        if (cursors.space.isDown) { //et que a false
            console.log('La touche "i" a été appuyée !');
            //plante le légumes

            //mettre a false
        }
    }
    else{
        //ici je bouge le truc donc je peux le refaire
    }

    /////////////////////////////////////////////////////////////
    if(Phaser.Geom.Intersects.RectangleToRectangle(jerry.getBounds(), legume_haut)) 
    {
        //met jerry en animation légume haut
        console.log('prend légume haut');
        //jerry.anims.play(name anim, true);
        possede = 1;
    }

    if(Phaser.Geom.Intersects.RectangleToRectangle(jerry.getBounds(), legume_centre)) 
    {
        //met jerry en animation légume centre
        console.log('prend légume centre');
        //possede = 2;
    }

    if(Phaser.Geom.Intersects.RectangleToRectangle(jerry.getBounds(), legume_bas)) 
    {
        //met jerry en animation légume bas
        console.log('prend légume bas');
        //possede = 3;
    }

    /////////////////////////////////////////////////////////////   
    
    if(randomNum != 45)randomNum = Phaser.Math.Between(1, 4000);
    else spawnCorbeauBas.call(this, tableau_elem[65].x,tableau_elem[65].y);
    
    if(randomNum != 45)randomNum = Phaser.Math.Between(1, 4000);
    else spawnCorbeauBas.call(this, tableau_elem[120].x,tableau_elem[120].y);

    if(randomNum != 45)randomNum = Phaser.Math.Between(1, 4000);
    else spawnCorbeauGauche.call(this, tableau_elem[6].x,tableau_elem[6].y)
    

    /////////////////////////////////////////////////////////////   
    if (evt.left.isDown) 
    {
        jerry.anims.play('left1');
        bool = 1;
        jerry.x -= 2.5;   //fait 4 case pour anims
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
