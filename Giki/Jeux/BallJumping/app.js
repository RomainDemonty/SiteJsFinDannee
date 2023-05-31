var game;
var username;

const config = {
    type: Phaser.AUTO,
    width: 1500,
    height: 900,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y:0 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

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
        window.location.href = "../../Connexion.html";
    }
}

demarreJeu();

var terrain, elementsTerrain, nomTerrain = "groundType1", tailleDemiTerrain = 960;
var spikes, elementsSpikes, nomSpike = "spikeType1", tailleDemiSpike = 116;
var pieces, elementsPieces, nombrePiecesParGroupe = 5;
var pompeAir = null;
var timer, vitesseDeplacement = -310, level = 1;
var probabiliteApparitionTrou = 0.3;
var balle, vRotationBalle = 2.5, graviteBalle = 480, vitesseSaut = -300;
var objTexteTempsRestant, objTexteNiveauActuel, objTexteScore, delaiNiveau = 30000;
var score = 0;
var remplissageBonbonne = 100, timerBonbonne, objTexteBonbonne;
var isFlatingBall = false;

var sonPiece, sonNiveauSuivant, sonGonflementBalle, sonDegonflementBalle;

function preload()
{
    this.load.image("fondMontagnes", "./assets/montagnes.jpg");
    this.load.image("groundType1", "./assets/groundType1.jpg");
    this.load.image("groundType2", "./assets/groundType2.png");
    this.load.image("groundType3", "./assets/groundType3.png");
    this.load.image("groundType4", "./assets/groundType4.png");
    this.load.image("ball", "./assets/balle2.png");
    this.load.image("hole", "./assets/trou1.png");
    this.load.image("spikeType1", "./assets/spikeType1.png");
    this.load.image("spikeType2", "./assets/spikeType2.png");
    this.load.image("spikeType3", "./assets/spikeType3.png");
    this.load.image("airPump", "./assets/pompeAir2.png");
    this.load.image("airCanister", "./assets/bonbonneAir2.png");
    this.load.image("coinModel", "./assets/coinRef.png");

    this.load.audio('coinHandling', "./sounds/coin-handling.wav");
    this.load.audio('completionLevel', "./sounds/completion-of-level.wav");
    this.load.audio('inflatingBall', "./sounds/inflating-balloon.wav");
    this.load.audio('deflatingBall', "./sounds/balloon-deflating.wav");

    this.load.spritesheet(
        "coin",
        "./assets/coin.png",
        { frameWidth:59, frameHeight:60 }
    );

    this.physics.start();
}

function create()
{
    terrain = this.physics.add.group();
    elementsTerrain = terrain.getChildren();

    spikes = this.physics.add.group();
    elementsSpikes = spikes.getChildren();

    pieces = this.physics.add.group();
    elementsPieces = pieces.getChildren();

    this.add.image(0, -50, "fondMontagnes").setOrigin(0, 0);

    this.anims.create({
        key: 'animCoin',
        frames: this.anims.generateFrameNumbers('coin', { start:0, end:9 }),
        frameRate: 10,
        repeat: -1
    });

    this.physics.add.image( (this.scale.width-70), 10, "airCanister").setOrigin(0,0);
    let texteBonbonne = remplissageBonbonne + "%";
    objTexteBonbonne = this.add.text( (this.scale.width-140), 20, texteBonbonne, {
        fontFamily: "Arial",
        fontSize: 35,
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 3,
        align: "right"
    });
    timerBonbonne = this.time.addEvent({
        delay: 400,
        callback: videBonbonne.bind(this),
        callbackScope: this,
        loop: true
    });
    
    this.physics.add.image( (this.scale.width-60), 80, "coinModel").setOrigin(0,0);
    objTexteScore = this.add.text( (this.scale.width-110), 85, "0", {
        fontFamily: "Arial",
        fontSize: 35,
        color: "#DAA520",
        stroke: "#000000",
        strokeThickness: 3,
        align: "right"
    });
    

    balle = this.physics.add.sprite(250, 200, "ball");
    balle.setGravityY(graviteBalle);

    cursors = this.input.keyboard.createCursorKeys();

    timer = this.time.addEvent({
            delay: delaiNiveau,
            callback: updateLevelGame,
            callbackScope: this,
            repeat: 3
    });

    objTexteTempsRestant = this.add.text(10, 10, "", {
        fontFamily: "Arial",
        fontSize: 20,
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 2,
        align: "left"
    });

    objTexteNiveauActuel = this.add.text(( (this.scale.width/2) - 50), 10, "Niveau 1", {
        fontFamily: "Arial",
        fontSize: 20,
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 2,
        align: "center"
    });

    sonPiece = this.sound.add('coinHandling');
    sonNiveauSuivant = this.sound.add('completionLevel');
    sonGonflementBalle = this.sound.add('inflatingBall');
    sonDegonflementBalle = this.sound.add('deflatingBall');
    
    //Creation des premiers items en dur
    createFirstItems.call(this);
}

function update()
{
    balle.setDepth(1);
    if(balle.body.y > 900)
    {
        gameOver.call(this, "Votre balle a fondu dans la lave...");
    }
    balle.angle += vRotationBalle;

    if(level < 5)
    {
        MajTempsRestant();
    }
    
    if(cursors.space.isDown)
    {
        if(balle.body.y == 641)
        {
            balle.setGravityY(0);
            balle.setVelocityY(vitesseSaut);
        }
        else if(balle.body.y < 500)
        {
            balle.setGravityY(graviteBalle);
        }
    }
    else
    {
        balle.setGravityY(graviteBalle);
    }
    
    generateRandomItems.call(this);
}

function createFirstItems()
{
    pompeAir = this.physics.add.sprite(3000, 700, "airPump");
    this.physics.add.collider(pompeAir, balle, recuperePompeAir.bind(this));
    pompeAir.setVelocityX(vitesseDeplacement);

    //Création pièces :
    let x = 900;
    for(let i=0; i < 5; i++, x += 80)
    {
        pieces.create(x, 700, "coin");
        elementsPieces[i].anims.play('animCoin');
        elementsPieces[i].body.setVelocityX(vitesseDeplacement);
        this.physics.add.collider(elementsPieces[i], balle, recuperePiece);
    }

    terrain.create(960, 820, "groundType1");
    terrain.create( (elementsTerrain[0].body.width + 125), 820, "hole");
    terrain.create( (elementsTerrain[0].body.width + elementsTerrain[1].body.width + 960), 820, "groundType1");

    for(let i=0; i < elementsTerrain.length; i++)
    {
        elementsTerrain[i].body.setVelocityX(vitesseDeplacement);
        elementsTerrain[i].setImmovable(true);
    }

    this.physics.add.collider(elementsTerrain[0], balle);
    this.physics.add.collider(elementsTerrain[2], balle);
}

function creePompeAir(scene, positionX, positionY)
{
    pompeAir = scene.physics.add.sprite(positionX, positionY, "airPump");
    scene.physics.add.collider(pompeAir, balle, recuperePompeAir.bind(scene));
    pompeAir.setVelocityX(vitesseDeplacement);
}

function creeGroupePieces(scene, positionInitialeX, positionInitialeY, isGroupAboveHole)
{
    let elem;
    let x = positionInitialeX;
    let y = positionInitialeY;

    if(isGroupAboveHole == true)
    {
        for(let i=0; i<5; i++, x += 80)
        {
            switch(i)
            {
                case 1:
                    y -= 65;
                    break;

                case 4:
                    y += 65;
            }

            elem = pieces.create(x, y, "coin");
            elem.anims.play('animCoin');
            elem.body.setVelocityX(vitesseDeplacement);
            scene.physics.add.collider(elem, balle, recuperePiece);
        }
    }
    else
    {
        for(let i=0; i< nombrePiecesParGroupe; i++, x += 80)
        {
            elem = pieces.create(x, y, "coin");
            elem.anims.play('animCoin');
            elem.body.setVelocityX(vitesseDeplacement);
            scene.physics.add.collider(elem, balle, recuperePiece);
        }
    }
}

function generateRandomItems()
{
    var indiceDernierElem = (elementsTerrain.length-1);
    var dernierElem = elementsTerrain[indiceDernierElem];
    var nbPixelsX = dernierElem.body.x + dernierElem.body.width;
    
    if(nbPixelsX < 4500)
    {
        let rand = Math.random();
        if(rand < probabiliteApparitionTrou)
        {
            var elem = terrain.create( (nbPixelsX + 125), 820, "hole").setVelocityX(vitesseDeplacement);
            elem.setImmovable(true);

            if(pompeAir.body == undefined && remplissageBonbonne < 55 && isFlatingBall == false)
            {
                creePompeAir(this, (nbPixelsX + 125), 600);
            }
            else
            {
                creeGroupePieces(this, (nbPixelsX - 30), 700, true);
            }

            elem = terrain.create( (nbPixelsX + 250 + tailleDemiTerrain), 820, nomTerrain).setVelocityX(vitesseDeplacement);
            elem.setImmovable(true);
            this.physics.add.collider(elem, balle);
        }
        else
        {
            var elem = terrain.create( (nbPixelsX + tailleDemiTerrain), 820, nomTerrain).setVelocityX(vitesseDeplacement);
            elem.setImmovable(true);
            this.physics.add.collider(elem, balle);

            let tailleTotaleTerrain = tailleDemiTerrain * 2; 

            if(pompeAir.body == undefined && remplissageBonbonne < 55 && isFlatingBall == false)
            {
                creePompeAir(this, (nbPixelsX + (tailleDemiTerrain/2)), 700);
            }
            else
            {
                rand = Math.random();
                if(rand < 0.5)
                {
                    rand = Math.random();
                    if(rand < 0.5)
                    {
                        creeGroupePieces(this, (nbPixelsX + 115), 700, false);
                    }
                    else
                    {
                        creeGroupePieces(this, (nbPixelsX + 115), 600, false);

                        elem = spikes.create( (nbPixelsX + tailleDemiSpike + 195), 726, nomSpike).setVelocityX(vitesseDeplacement);
                        elem.setImmovable(true);
                        this.physics.add.collider(elem, balle, detecteCollisionBalleSpike.bind(this));
                    }
                }
                else
                {
                    let posMinSpike = tailleTotaleTerrain/4;
                    var positionSpike = ( (Math.random() * (tailleDemiTerrain - posMinSpike)) + posMinSpike);
                    elem = spikes.create( (nbPixelsX + positionSpike + tailleDemiSpike), 726, nomSpike).setVelocityX(vitesseDeplacement);
                    elem.setImmovable(true);
                    this.physics.add.collider(elem, balle, detecteCollisionBalleSpike.bind(this));
                }
            }
        
            /*let posMinSpike = tailleTotaleTerrain/4;
            var positionSpike = ( (Math.random() * (tailleDemiTerrain - posMinSpike)) + posMinSpike);
            elem = spikes.create( (nbPixelsX + positionSpike + tailleDemiSpike), 726, nomSpike).setVelocityX(vitesseDeplacement);
            elem.setImmovable(true);
            this.physics.add.collider(elem, balle);*/
        }
    }

    if(elementsTerrain.length > 0)
    {
        if( (elementsTerrain[0].body.x + elementsTerrain[0].body.width) < 0){
            elementsTerrain[0].destroy();
        }
    }
    
    if(elementsSpikes.length > 0)
    {
        if( (elementsSpikes[0].body.x + elementsSpikes[0].body.width) < 0){
            elementsSpikes[0].destroy();
        }
    }

    if(elementsPieces.length > 0)
    {
        if( (elementsPieces[0].body.x + elementsPieces[0].body.width) < 0){
            elementsPieces[0].destroy();
        }
    }

    if(pompeAir.body != undefined)
    {
        if(pompeAir.x + pompeAir.width < 0)
        {
            pompeAir.destroy();
        }
    }
}

function updateLevelGame()
{   
    sonNiveauSuivant.play();
    switch(level)
    {
        case 1: //On va passer level 2...
            nomTerrain = "groundType2";
            tailleDemiTerrain = 600;
            
            graviteBalle += 80;
            vitesseSaut -= 40;

            vitesseDeplacement -= 75;
            probabiliteApparitionTrou += 0.1;
            objTexteNiveauActuel.text = "Niveau 2";
            vRotationBalle += 0.5;
            break;

        case 2: //On va passer level 3...
            nomTerrain = "groundType3";
            tailleDemiTerrain = 350;
            nombrePiecesParGroupe = 4;

            nomSpike = "spikeType2";
            tailleDemiSpike = 87;

            graviteBalle += 100;
            vitesseSaut -= 60;

            vitesseDeplacement -= 85;
            objTexteNiveauActuel.text = "Niveau 3";
            vRotationBalle++;
            break;

        case 3:
            nomTerrain = "groundType4";
            tailleDemiTerrain = 250;
            nombrePiecesParGroupe = 3;

            nomSpike = "spikeType3";
            tailleDemiSpike = 58;

            graviteBalle += 110;
            vitesseSaut -= 70;

            vitesseDeplacement -= 100;
            probabiliteApparitionTrou += 0.1;
            objTexteNiveauActuel.text = "Niveau 4";
            break;
        
        case 4:
            vitesseDeplacement -= 100;
            objTexteNiveauActuel.text = "Niveau 5";

            graviteBalle += 120;
            vitesseSaut -= 80;

            objTexteTempsRestant.destroy();

            vRotationBalle++;
    }

    level += 1;

    console.log(objTexteNiveauActuel.text);
    var texteUpdateLevel = this.add.text( ((this.scale.width/2) - 100), ((this.scale.height/2) - 100), objTexteNiveauActuel.text, {
        fontFamily: "Arial",
        fontSize: 45,
        color: "#ff8000",
        stroke: "#000000",
        strokeThickness: 4,
        align: "center"
    });
    texteUpdateLevel.setAlpha(0);

    this.tweens.add({
        targets: texteUpdateLevel,
        alpha: 1,
        duration: 1500,
        onComplete: function() {
            texteUpdateLevel.destroy();
        }
    });

    
    for(let i=0; i < elementsTerrain.length; i++){
        elementsTerrain[i].body.setVelocityX(vitesseDeplacement);
    }

    for(let i=0; i < elementsSpikes.length; i++){
        elementsSpikes[i].body.setVelocityX(vitesseDeplacement);
    }

    for(let i=0; i < elementsPieces.length; i++){
        elementsPieces[i].body.setVelocityX(vitesseDeplacement);
    }

    if(pompeAir.body != undefined){
        pompeAir.setVelocityX(vitesseDeplacement);
    }
   
}

function detecteCollisionBalleSpike()
{
    remplissageBonbonne -= 10;
    sonDegonflementBalle.play();

    var texteAlertCollision = this.add.text(balle.body.x + 25, balle.body.y + 50, "-10", {
        fontFamily: "Arial",
        fontSize: 40,
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 3,
        align: "center"
    });
    texteAlertCollision.setAlpha(0);
    
    this.tweens.add({
        targets:texteAlertCollision,
        x: (texteAlertCollision.x + 150),
        y: (texteAlertCollision.y - 110),
        alpha: 1,
        duration: 4000,
        onComplete: function() {
            texteAlertCollision.destroy();
        }
    });

    balle.setGravityY(0);
    balle.setVelocityY(vitesseSaut-500);
}

function regonfleBalle()
{
    remplissageBonbonne += 1;
    objTexteBonbonne.text = remplissageBonbonne + "%";
    if(remplissageBonbonne == 100)
    {
        timerBonbonne.remove();
        isFlatingBall = false;
        sonGonflementBalle.stop();

        timerBonbonne = this.time.addEvent({
            delay: 400,
            callback: videBonbonne,
            callbackScope: this,
            loop: true
        });
    }
}

function recuperePompeAir(obj_pompeAir, obj_balle)
{
    if(sonDegonflementBalle.isPlaying)
    {
        sonDegonflementBalle.stop();
    }
    sonGonflementBalle.play();

    isFlatingBall = true;

    timerBonbonne.remove();
    timerBonbonne = this.time.addEvent({
        delay: 100,
        callback: regonfleBalle,
        callbackScope: this,
        loop: true
    });

    obj_balle.setVelocityX(0);
    obj_pompeAir.destroy();
}


function videBonbonne()
{
    remplissageBonbonne -= 1;
    objTexteBonbonne.text = remplissageBonbonne + "%";
    
    if(remplissageBonbonne == 20)
    {
        sonDegonflementBalle.play();
    }
    else if(remplissageBonbonne == 0)
    {
        timerBonbonne.remove();
        gameOver.call(this, "La balle est complètement dégonflée...");
    }
}

function recuperePiece(obj_piece, obj_balle)
{
    sonPiece.play();

    obj_balle.setVelocityX(0);
    obj_piece.destroy();

    score += 10;
    
    if(score == 100){
        objTexteScore.x -= 15;
    }
    else if(score == 1000){
        objTexteScore.x -= 15;
    }
    else if(score == 10000){
        objTexteScore.x -= 15;
    }

    objTexteScore.text = score;
}

function gameOver(reason)
{
    var contenu = "Game Over!\n" + reason + "\nScore final : " + score;
    
    var longueur = 0;
    var max = 0;
    for(let i=0; i < contenu.length; i++)
    {
        if(contenu[i] != '\n') 
        {
            longueur++;
        }
        else
        {
            if(max < longueur)
            {
                max = longueur;
            } 
            longueur = 0; 
        }
    }

    var decalage;
    if(max > 0){
        decalage = max *= 10;
    }
    else{
        decalage = longueur *= 10;
    }

    var texteGameOver = this.add.text( ((this.scale.width/2) - decalage), ((this.scale.height/2) - 100), contenu, {
        fontFamily: "Arial",
        fontSize: 45,
        color: "#ff8000",
        stroke: "#000000",
        strokeThickness: 4,
        align: "center"
    });
    texteGameOver.setAlpha(0);

    this.tweens.add({
        targets: texteGameOver,
        alpha: 1,
        duration: 1500,
    });

    timer = this.time.addEvent({
        delay: 2000,
        callback: arretJeu.bind(this),
        callbackScope: this,
        repeat: 1
    });
}

function arretJeu()
{
    this.scene.pause();
    sendData();
    afficherFenetre(score);
}

function afficherFenetre(Score) {
    var fenetre = document.createElement("div");

    fenetre.style.position = "fixed";
    fenetre.style.width = "250px";
    fenetre.style.height = "200px";
    fenetre.style.backgroundColor = "lightgray";
    fenetre.style.border = "3px solid black";
    fenetre.style.borderRadius = "10px";
    fenetre.style.top = "50%";
    fenetre.style.left = "50%";
    fenetre.style.transform = "translate(-50%, -50%)";
  
    var contenu = document.createElement("p");
    contenu.style.fontSize = '24px';   
    contenu.style.fontWeight = 'bold';     
    contenu.style.color = 'orange';
    contenu.style.textAlign = "center";   
    contenu.innerHTML = "Score: " + Score;
  
    var boutonJouer = document.createElement("button");
    boutonJouer.innerHTML = "Jouer";
    boutonJouer.style.position = "fixed";
    boutonJouer.style.margin = "10px";
    boutonJouer.style.left = "40%";
    boutonJouer.style.top = "90%";
    boutonJouer.style.transform = "translate(-50%, -50%)";
    boutonJouer.onclick = function() {
      location.reload(); // Actualiser la page
    };
  
    var boutonQuitter = document.createElement("button");
    boutonQuitter.innerHTML = "Quitter";
    boutonQuitter.style.position = "fixed";
    boutonQuitter.style.margin = "10px";
    boutonQuitter.style.left = "60%";
    boutonQuitter.style.top = "90%";
    boutonQuitter.style.transform = "translate(-50%, -50%)";
    boutonQuitter.onclick = function() {
      window.location.href = "../../index.html"; // Redirection vers l'accueil
    };
  
    fenetre.appendChild(contenu);
    fenetre.appendChild(boutonJouer);
    fenetre.appendChild(boutonQuitter);
  
    document.body.appendChild(fenetre);
  }

function sendData()
{
    var nomJeu = "BallJumping";
    $.ajax({
        url: 'RedirectionModele.php',
        method: 'POST',
        data: {
            action: 'AjoutScore',
            score: score,
            pseudo: username,
            NomJeux: nomJeu
        },
        success: function(response) {
            console.log(response);
            console.log("Reussite");
        },
        error: function(xhr, status, error) {
            console.log("Erreur AJAX: " + error);
            console.log("ERREUR!!");
        }
    });
}

function MajTempsRestant()
{
    let pourcentage = timer.getProgress();
    let nbrSecondesEcoulees = (delaiNiveau/1000) * pourcentage;

    let tempsRestant = (delaiNiveau/1000) - Math.floor(nbrSecondesEcoulees);
    let min = 0;
    if(tempsRestant > 60)
    {
        min = Math.floor(tempsRestant/60);

        let secondes = tempsRestant % 60;
        objTexteTempsRestant.text = "Niveau suivant : " + min + "min " +  secondes + "sec";
    }
    else
    {
        objTexteTempsRestant.text = "Niveau suivant : " +  tempsRestant + "sec";
    }
}