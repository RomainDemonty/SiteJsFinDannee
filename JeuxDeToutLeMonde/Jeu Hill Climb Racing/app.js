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
        update: update
    }
};

var game = new Phaser.Game(config);
var terrain, voiture;

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
    
    //var tuileSprite;
    var nbPixels = 0;
    var x = 0;
    var y = 1;
    var yPrec = 1;
    var ecartSinusoides;
    while(nbPixels < game.config.width)
    {
        var longMorceauTerrain = (Math.random() * 180); //Longueur du morceau de courbe qui sera affiché avant de générer un autre morceau de courbe différent.
        var A = Math.random() * 150; //Amplitude de la sinusoïde
        var f = Math.random() * 2; //Fréquence de la sinusoïde
        var axeOscillation = 200; //L'axe d'oscillation permet de faire varier la hauteur de la courbe sur l'axe Y.

        y = Math.sin( ((Math.PI/180) * x) * f) * A  + axeOscillation; //Ici on teste simplement la nouvelle valeur de y avec les nouveaux paramètres générés aléatoirement.

        ecartSinusoides = y - yPrec; 
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

        while(x < longMorceauTerrain && nbPixels <= game.config.width) //On boucle pour afficher chaque point de la courbe un à un.
        {
            y = Math.sin( ((Math.PI/180) * x) * f) * A  + axeOscillation; //On calcule le point y de la courbe pour chaque mesure d'angle en partant de 1 * Pi/180 à (longMorceauTerrain-1) * Pi/180
            console.log("y = " + y + ", x = " + x);
            //tuileSprite = this.add.image(nbPixels, 600 - y, 'terrainTuile');
            terrain.create(nbPixels, 600 - y, 'terrainTuile');

            x++;
            nbPixels+=5; //L'asset 'terrainTuile' fait 5px de large donc nbPixels += 5
        }
        x = 0; //On remet x à 1 pour reconstruire une nouvelle courbe en partant de Pi/180 * 1 pour déterminer l'angle.

        yPrec = y; //Pour comparer au prochain tour de boucle si il y un écart entre la hauteur du dernier point de la courbe qui vient d'être généré
                        //et la hauteur du premier point de la nouvelle courbe qui va être généré
        
    }
    voiture = this.physics.add.sprite(0, 200, 'hillClimberCar').setOrigin(0, 0);
    voiture.setBounce(0.2);
    voiture.setCollideWorldBounds(true);
    voiture.body.setGravity(300);

    this.physics.add.collider(voiture, terrain);

}

function update(){

}