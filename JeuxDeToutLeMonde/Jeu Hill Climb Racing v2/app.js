const config = {
    type: Phaser.AUTO,
    width: 1500,
    height: 900,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update,
        render: render
    }
};

var game = new Phaser.Game(config);
console.log(game);

var terrain, nbPixels = 0, voiture, cursors, vitesse = 0;

function preload(){

    this.load.image('coin', './assets/coin.png');
    this.load.image('sky', './assets/sky.png');
    this.load.image('terrainTuile', './assets/tuileTerrain.png');
    this.load.image('hillClimberCar', './assets/Hill_Climber.png');
}

function create(){
    this.add.image(750, 0, 'sky');
    this.add.image(0, 0, 'coin').setOrigin(0, 0);

    terrain = this.physics.add.staticGroup();
    
    nbPixels = generateGround(nbPixels);

    this.player = this.physics.add.sprite(0, 200, 'hillClimberCar').setOrigin(0, 0);
    this.cameras.main.startFollow(this.player, false);
    cursors = this.input.keyboard.createCursorKeys();

    this.player.setBounce(0.0);
    //this.player.setCollideWorldBounds(true);
    this.player.setGravityY(100);
    this.physics.add.collider(this.player, terrain);
}

function update(){
    if (cursors.left.isDown)
    {
        if(vitesse > (-250))
        {
            vitesse -= 15;
            this.player.setVelocityX(vitesse);
        }
    }
    else if (cursors.right.isDown)
    {   
        if(vitesse < 400)
        {
            vitesse += 10;
            this.player.setVelocityX(vitesse);

            console.log("position voiture en x = " + this.player.x);
            if(this.player.x > game.config.width - 350)
            {
                console.log("generation suite terrain");
                nbPixels = generateGround(nbPixels);
            }     
        }
    }
    else
    {
        if(vitesse > 0)
        {
            vitesse -= 2;
            this.player.setVelocityX(vitesse);
        }
    }
}

function render() {

    game.debug.cameraInfo(game.camera, 32, 32);
    game.debug.spriteCoords(player, 32, 500);

}

function generateGround(nbPixels) {

    var x = 0;
    var y = 1;
    var yPrec = 1;
    var ecartSinusoides, longMorceauTerrain, A, f, axeOscillation;
    var cmpt = 0;
    while(cmpt < nbPixels + 1500)
    {
        console.log("bonjour");
        longMorceauTerrain = (Math.random() * 170) + 10; //Longueur du morceau de courbe qui sera affiché avant de générer un autre morceau de courbe différent.
        //x = parseInt(Math.random() * 180);
        x = 0
        A = Math.random() * 150; //Amplitude de la sinusoïde
        f = Math.random() * 2; //Fréquence de la sinusoïde
        axeOscillation = 0; //L'axe d'oscillation permet de faire varier la hauteur de la courbe sur l'axe Y.

        y = Math.sin( ((Math.PI/180) * x) * f) * A  + axeOscillation; //Ici on teste simplement la nouvelle valeur de y avec les nouveaux paramètres générés aléatoirement.
        //console.log("Nouveau Y = " + y);

        ecartSinusoides = y - yPrec; 
        //console.log("Ecart sinu = " + y + " - " + yPrec + " = " + ecartSinusoides);
        if( (y - yPrec) > 0) //Alors la nouvelle courbe est trop haute, on reduit l'axe d'oscillation de l'écart qu'il y a entre y et yPrec
        {
            axeOscillation -= ecartSinusoides;
        }
        else
        {
            if( (y - yPrec) < 0)
            {
                axeOscillation += Math.abs(ecartSinusoides);
            }
        }
        //console.log("axeOscillation = " + axeOscillation);

        while(x < longMorceauTerrain && cmpt < nbPixels + 1500) //On boucle pour afficher chaque point de la courbe un à un.
        {
            y = Math.sin( ((Math.PI/180) * x) * f) * A  + axeOscillation; //On calcule le point y de la courbe pour chaque mesure d'angle en partant de 1 * Pi/180 à (longMorceauTerrain-1) * Pi/180
            //console.log("y = " + y + ", x = " + x);
            terrain.create(cmpt, 700 - y, 'terrainTuile');

            x++;
            cmpt+=5; //L'asset 'terrainTuile' fait 5px de large donc nbPixels += 5
        }
        //x = 0; //On remet x à 1 pour reconstruire une nouvelle courbe en partant de Pi/180 * 1 pour déterminer l'angle.
        //console.log("dernier Y = " + y);
        yPrec = y; //Pour comparer au prochain tour de boucle si il y un écart entre la hauteur du dernier point de la courbe qui vient d'être généré
                        //et la hauteur du premier point de la nouvelle courbe qui va être généré
        
    }

    return cmpt;
}