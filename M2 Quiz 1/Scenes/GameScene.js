export default class GameScene extends Phaser.Scene{

  constructor(){
    super("GameScene");
  }

  init(){
    this.player;
    this.stars;
    this.bombs;
    this.psc = 0.1 ;
    this.platforms;
    this.starcollect = 0;
    this.cursors;
    this.color = ['0xff0000','0xff6600','0xffff00','0x00ff00','0x0000ff','0x9900cc'];
    this.score = 0;
    this.gameOver = false;
    this.scoreText;
  }

  preload ()
  {
      this.load.image('sky', 'assets/sky.png');
      this.load.image('ground', 'assets/platform.png');
      this.load.image('star', 'assets/star.png');
      this.load.image('bomb', 'assets/Devil.png');
      this.load.spritesheet('dude', 'assets/ThisGuy.png', { frameWidth: 32, frameHeight: 48 });
  }

  

  create ()
{
    //  A simple background for our game
    this.add.image(400, 300, 'sky');

//  The score
    this.scoreText = this.add.text(16, 16, 'score: ' + this.score, { fontSize: '32px', fill: '#000' });

    //  The platforms group contains the ground and the 2 ledges we can jump on
    this.platforms = this.physics.add.staticGroup()

    this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();

    //  Now let's create some ledges
    this.platforms.create(600, 400, 'ground');
    this.platforms.create(50, 250, 'ground');
    this.platforms.create(750, 220, 'ground');

    // The player and its settings
    this.player = this.physics.add.sprite(100, 450, 'dude');
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);

    //  Player physics properties. Give the little guy a slight bounce.
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);

    //  Our player animations, turning, walking left and walking right.
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [ { key: 'dude', frame: 4 } ],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

    //  Input Events
    this.cursors = this.input.keyboard.createCursorKeys();

    //  Some stars to collect, 12 in total, evenly spaced 70 pixels apart along the x axis
    this.stars = this.physics.add.group({
        key: 'star',
        repeat: 11,
        setXY: { x: 12, y: 0, stepX: 70 }
    });    

    this.stars.children.iterate(function (child) {
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
      });

    this.bombs = this.add.group();
    
     // Collide the player and bombs with the platforms
    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.bombs, this.platforms);
 
     // Check for collision between the player and bombs
    this.physics.add.collider(this.player, this.bombs, this.hitBomb, null, this);

    //  Collide the player and the stars with the platforms
    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.stars, this.platforms);
    this.physics.add.collider(this.bombs, this.platforms);

    //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
    this.physics.add.collider(this.player, this.stars, this.collectStar, null, this);

    // Collide the player and the bombs with the platforms
    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.bombs, this.platforms);

    // Check for collision between the player and bombs
    this.physics.add.collider(this.player, this.bombs, this.hitBomb, null, this);

}



collectStar (player, stars)
{
    stars.disableBody(true, true);

    // Add and update the score
    this.score += 10;

    this.player.setTint(this.color[0]);
    this.color.shift();
    if (this.color.length === 0) {
        this.color.push('0xff0000', '0xff6600', '0xffff00', '0x00ff00', '0x0000ff', '0x9900cc');
    }

    if (this.starcount < 4) {
        this.starcount += 1;   
    } else {
        this.sizeX += this.sizechanged;
        this.sizeY += this.sizechanged;
        this.starcount = 0;
        this.player.setScale(this.sizeX, this.sizeY);
    }

    this.scoreText.setText('Score: ' + this.score);

    if (this.stars.countActive(true) === 0) {
        // A new batch of stars to collect
        this.stars.children.iterate(function (child) {
            child.enableBody(true, child.x, 0, true, true);
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        });

        var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

        

        var bomb = this.physics.add.sprite(x, 16, 'bomb');
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
        bomb.allowGravity = false;

        // Enable collision between bombs and platforms
        this.physics.add.collider(bomb, this.platforms);

        // Add the bomb to the bombs group
        this.bombs.add(bomb);
         
    }
}

hitBomb (player, bomb)
{
    this.gameOver = true;
   
     // Disable player movement and animations
     this.player.setVelocity(0);
     this.player.anims.stop();

     // Set player tint to indicate game over
     this.player.setTint(0xff0000);

     this.scene.start("GameoverScene");

    
}

sizeX = 1;
sizeY = 1;
sizechanged = 0.1;
starcount = 0;

update()
{
    if (this.gameOver)
    {
        return;
    }

    if (this.cursors.left.isDown)
    {
        this.player.setVelocityX(-160);

        this.player.anims.play('left', true);
    }
    else if (this.cursors.right.isDown)
    {
        this.player.setVelocityX(160);

        this.player.anims.play('right', true);
    }
    else
    {
        this.player.setVelocityX(0);

        this.player.anims.play('turn');
    }

    if (this.cursors.up.isDown && this.player.body.touching.down)
    {
        this.player.setVelocityY(-330);
    }
}

}