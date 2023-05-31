class Preloader extends Phaser.Scene {
    constructor() {
      super({key: "Preloader"});
    }
    
    preload() {
      this.load.setBaseURL('https://raw.githubusercontent.com/photonstorm/phaser-coding-tips/master/issue-005/');
      this.load.image('dot', 'assets/dot.png');
      this.load.image('tiles', 'assets/pacman-tiles.png');
      this.load.tilemapTiledJSON('map', 'assets/pacman-map.json');
      this.load.spritesheet('pacman', 'assets/pacman.png', {frameWidth: 32, frameHeight: 32});
    }
  
    create() {
      this.createAnimations()
      this.scene.start('Game')
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
      this.map.setCollisionByExclusion([this.safetile], true, this.layer);
      this.pacman = this.physics.add.sprite((14 * 16) + 8, (17 * 16) + 8, 'pacman', 0);
      this.pacman.body.setSize(16, 16);
      this.pacman.play('munch');
      this.physics.add.collider(this.pacman, this.layer);
      this.physics.add.overlap(this.pacman, this.dots, this.eatDot, null, this);
      
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
     
    eatDot(pacman, dot) {
      dot.setActive(false).setVisible(false);
    }
    
  }
  
  const config = {
    width: 449,
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
  
  
  var game = new Phaser.Game(config);