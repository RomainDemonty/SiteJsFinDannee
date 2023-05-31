var score = 0;

class Preloader extends Phaser.Scene {
    constructor() {
      super({key: "Preloader"});
    }
    
    preload() {
      this.load.image('dot', 'images/dot.png');
      this.load.image('superDot','images/superdot.png');
      this.load.image('tiles', 'images/pacman-tiles.png');
      this.load.tilemapTiledJSON('map', 'images/pacman-map.json');
      this.load.spritesheet('pacman', 'images/pacman.png', {frameWidth: 32, frameHeight: 32});
      this.load.image('redghost','images/ghostred.png');
      this.load.image('blueghost','images/ghostblue.png');
      this.load.image('pinkghost','images/ghostpink.png');
      this.load.image('orangeghost','images/ghostorange.png');
      this.load.image('fearedghost','images/ghostfeared.png');
      this.load.image('deadghost','images/ghostdead.png');
    }
  
    create() {
      this.createAnimations();
      this.scene.start('Game');
    }
    
    createAnimations() {
      this.anims.create({
        key: 'munch',
        frames: this.anims.generateFrameNumbers('pacman', { frames: [ 0, 1, 2, 1] }),
        frameRate: 20,
        repeat: -1
      });
    }
  
  }
  
  class Game extends Phaser.Scene {
    constructor() {
      super({key: "Game"});
      
      this.map = null;
      this.layer = null; 
      this.pacman = null;
      this.safetile = 14;
      this.gridsize = 16;
      this.speed = 150;
      this.threshold = 3;
      this.marker = new Phaser.Geom.Point();
      this.turnPoint = new Phaser.Geom.Point();
      this.directions = [ null, null, null, null, null];
      this.opposites = [ Game.Direction.NONE, Game.Direction.RIGHT, Game.Direction.LEFT, Game.Direction.DOWN, Game.Direction.UP ];
      this.current = Game.Direction.UP;
      this.turning = Game.Direction.NONE;
    }
   
    static Direction = {
      NONE: 0,
      LEFT: 1,
      RIGHT: 2,
      UP: 3,
      DOWN: 4, 
    }
    
    create() { 
      this.scoreText = this.add.text(450, 16, "Score: 0", { fontSize: "24px", fill: "#fff" });
      this.map = this.make.tilemap({ key: 'map', tileWidth: 32, tileHeight: 32 });
      const tileset = this.map.addTilesetImage('pacman-tiles','tiles');
      this.layer = this.map.createLayer('Pacman', tileset, 0, 0); 
      this.dots = this.add.group();
      const pillsArray = this.map.createFromTiles(7, this.safetile, {key:'dot'}, this);
      pillsArray.forEach((dot)=>{
        dot.x += 6;
        dot.y += 6;
        this.physics.add.existing(dot)
        this.dots.add(dot);
      });
      const superDotPositions = [
        { x: 1, y: 3 },
        { x: 26, y: 3 },
        { x: 1, y: 28 },
        { x: 26, y: 28 }
      ];
  
      superDotPositions.forEach((position) => {
        const superDot = this.add.image(position.x * 16, position.y * 16, 'superDot');
        superDot.setOrigin(0);
        this.physics.add.existing(superDot);
        this.dots.add(superDot);
      });
      
      this.map.setCollisionByExclusion([this.safetile], true, this.layer);
      this.pacman = this.physics.add.sprite((14 * 16) + 8, (17 * 16) + 8, 'pacman', 0);
      this.pacman.body.setSize(16, 16);
      this.pacman.play('munch');
      this.physics.add.collider(this.pacman, this.layer);
      this.physics.add.overlap(this.pacman, this.dots, this.eatDot, null, this);
      
      this.ghosts = this.physics.add.group();
      this.ghostsColliderGroup = this.physics.add.group();
      const ghost1 = new Ghost(this, 14 * 16 + 8, 11 * 16 + 8, 'redghost');
      ghost1.target = this.pacman;
      this.ghosts.add(ghost1);
      this.ghostsColliderGroup.add(ghost1);
    
      const ghost2 = new Ghost(this, 12 * 16 + 8, 14 * 16 + 8, 'pinkghost');
      ghost2.target = this.pacman;
      this.ghosts.add(ghost2);
      this.ghostsColliderGroup.add(ghost2);
    
      const ghost3 = new Ghost(this, 14 * 16 + 8, 14 * 16 + 8, 'blueghost');
      ghost3.target = this.pacman;
      this.ghosts.add(ghost3);
      this.ghostsColliderGroup.add(ghost3);
    
      const ghost4 = new Ghost(this, 16 * 16 + 8, 14 * 16 + 8, 'orangeghost');
      ghost4.target = this.pacman;
      this.ghosts.add(ghost4);
      this.ghostsColliderGroup.add(ghost4);

      this.physics.add.collider(this.pacman, this.ghosts, this.handleCollision, null, this);
      this.physics.add.collider(this.ghostsColliderGroup, this.layer);
      this.ghosts.getChildren().forEach((ghost) => {
  ghost.enableCollisions();
});

      
      this.cursors = this.input.keyboard.createCursorKeys();
  
      this.move(Game.Direction.LEFT)
    }
  
    update(time, delta) {
      this.marker.x = Phaser.Math.Snap.Floor(Math.floor(this.pacman.x), this.gridsize) / this.gridsize;
      this.marker.y = Phaser.Math.Snap.Floor(Math.floor(this.pacman.y), this.gridsize) / this.gridsize;
      this.directions[Game.Direction.LEFT] = this.map.getTileAt(this.marker.x - 1, this.marker.y);
      this.directions[Game.Direction.RIGHT] = this.map.getTileAt(this.marker.x + 1, this.marker.y);
      this.directions[Game.Direction.UP] = this.map.getTileAt(this.marker.x, this.marker.y - 1);
      this.directions[Game.Direction.DOWN] = this.map.getTileAt(this.marker.x, this.marker.y + 1);
      this.ghosts.getChildren().forEach((ghost) => {
        ghost.update();
      });
      this.checkKeys();    
      if (this.turning !== Game.Direction.NONE) this.turn();
    }  
    
    checkKeys() {
      if (this.cursors.left.isDown && this.current !== Game.Direction.LEFT) {
        this.checkDirection(Game.Direction.LEFT);
      } else if (this.cursors.right.isDown && this.current !== Game.Direction.RIGHT) {
        this.checkDirection(Game.Direction.RIGHT);
      } else if (this.cursors.up.isDown && this.current !== Game.Direction.UP) {
        this.checkDirection(Game.Direction.UP); 
      } else if (this.cursors.down.isDown && this.current !== Game.Direction.DOWN) {
        this.checkDirection(Game.Direction.DOWN);
      } else { 
        this.turning = Game.Direction.NONE;
     }
  
    }
    
    checkDirection(turnTo) {
      if (this.turning === turnTo || this.directions[turnTo] === null || this.directions[turnTo].index !== this.safetile) {

        return;
      }

      if (this.current === this.opposites[turnTo]) {
        this.move(turnTo);
      } else {      
        this.turning = turnTo;
        this.turnPoint.x = (this.marker.x * this.gridsize) + (this.gridsize / 2);      
        this.turnPoint.y = (this.marker.y * this.gridsize) + (this.gridsize / 2);
     }
    }
    
    turn() {
      const cx = Math.floor(this.pacman.x);
      const cy = Math.floor(this.pacman.y);
      if (!Phaser.Math.Fuzzy.Equal(cx, this.turnPoint.x, this.threshold) || !Phaser.Math.Fuzzy.Equal(cy, this.turnPoint.y, this.threshold)) {
        return false;
      }
      this.pacman.x = this.turnPoint.x;
      this.pacman.y = this.turnPoint.y;
      this.pacman.body.reset(this.turnPoint.x, this.turnPoint.y);
      this.move(this.turning);
      this.turning = Game.Direction.NONE;
      return true;
    }
    
   move(direction) {
      let speed = this.speed;
      if (direction === Game.Direction.LEFT || direction === Game.Direction.UP) {           
        speed = -speed;
      }
      if (direction === Game.Direction.LEFT || direction === Game.Direction.RIGHT) {  
        this.pacman.body.setVelocityX(speed);
      } else {
        this.pacman.body.setVelocityY(speed);
      } 
     switch (direction) {
       case Game.Direction.UP:
          this.pacman.angle = -90;
         break;
       case Game.Direction.DOWN:
         this.pacman.angle = 90;
         break;
       case Game.Direction.RIGHT:
         this.pacman.angle = 0;
         break;
       case Game.Direction.LEFT:
          this.pacman.angle = 180;   
         break;
     }
     this.current = direction;
    }
    makeGhostsVulnerable() {
      clearTimeout(this.ghostVulnerabilityTimeout);
      this.ghosts.getChildren().forEach((ghost) => {
        ghost.body.enable = true;
        ghost.vulnerable = true; // Définit l'état de vulnérabilité du fantôme sur true
        ghost.setTexture('fearedghost'); // Change le sprite du fantôme pour le sprite de fantôme vulnérable
      });
    
      // Planifiez une temporisation pour restaurer l'état normal des fantômes après un certain délai (par exemple, 10 secondes)
      this.ghostVulnerabilityTimeout = setTimeout(() => {
        this.restoreGhostsNormal();
      }, 10000);

  
    }
    
    restoreGhostsNormal() {
      this.ghosts.getChildren().forEach((ghost) => {
        ghost.vulnerable = false; // Rétablit l'état de vulnérabilité du fantôme à false
        ghost.setTexture(ghost.originalTexture); // Rétablit le sprite original du fantôme
        ghost.body.enable = true;
      });
    }
    eatDot(pacman, dot) {
      dot.setActive(false).setVisible(false);
      dot.destroy();
      if (dot.texture.key === 'superDot') {
        this.updateScore(100); // Augmente le score de 100 points pour une super dot
        this.makeGhostsVulnerable();
      } else {
        this.updateScore(10); // Augmente le score de 10 points pour un point normal
      }
      if (this.dots.countActive() === 0) {
        this.gameOver();
      }
    }
    gameOver() {
      console.log("Game Over! Score: " + this.score);
      afficherFenetre(this.score);
      Envoie();
      this.scene.pause();
    }

    updateScore(points) {
      this.score += points;
      this.scoreText.setText("Score: " + this.score);
    }
    handleCollision(pacman, ghost) {
      if(ghost.vulnerable)
      {
        this.updateScore(200);
        ghost.setTexture('deadghost');
        ghost.body.enable = false;
      }
      else
      {
        this.gameOver();
      }
      
    }
  }














  class Ghost extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture) {
      super(scene, x, y, texture);
  
      // Ajoutez le fantôme à la scène
      scene.add.existing(this);
  
      // Activez la physique du fantôme
      scene.physics.world.enable(this);
  
      // Définissez la taille du corps du fantôme
      this.body.setSize(16, 16);
  
      // Définissez l'origine du fantôme
      this.setOrigin(0.5);
  
      // Définissez la vitesse du fantôme
      this.speed = 100;
  
      // Définissez le joueur cible initial du fantôme
      this.target = this.target;

      this.vulnerable = false;

      this.originalTexture=texture;
    }
  
    update() {
      // Vérifiez si le joueur cible existe
      if (this.target) {
        // Déplacez le fantôme vers le joueur cible
        const angle = Phaser.Math.Angle.Between(this.x, this.y, this.target.x, this.target.y);
        this.body.velocity.x = Math.cos(angle) * this.speed;
        this.body.velocity.y = Math.sin(angle) * this.speed;
      }
    }
    enableCollisions() {
      this.scene.physics.add.collider(this, this.scene.ghosts);
    }
  }
  const config = {
    width: 650,
    height: 496,
    backgroundColor: 0x000000,
    pixelArt: true,
    physics: {
      default: "arcade",
      arcade: {
        debug: false
      }
    },
    scene: [Preloader, Game]
  };
  
  function afficherFenetre(Score) {
    var fenetre = document.createElement("div");
    fenetre.style.position = "fixed";
    fenetre.style.width = "200px";
    fenetre.style.height = "200px";
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
    boutonJouer.style.top = "70%";
    boutonJouer.style.transform = "translate(-50%, -50%)";
    boutonJouer.onclick = function() {
      location.reload();
    };
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
    fenetre.appendChild(boutonJouer);
    fenetre.appendChild(boutonQuitter);
  
    document.body.appendChild(fenetre);
  }

  function Envoie(){
    var jeu = "PacMan";
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