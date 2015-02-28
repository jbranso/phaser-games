//Set up the phaser game.
var game = new Phaser.Game ('100%', '100%', Phaser.AUTO, 'myDiv', {preload: preload, create: create, update: update });

function preload () {
  game.load.spritesheet ( 'dude', 'assets/dude.png', 32, 48 );
  game.load.image ('ground', 'assets/platform.png');
  game.load.image ( 'star', 'assets/star.png' );
  game.load.image ( 'baddie', 'assets/baddie.png' );
  game.load.image ( 'heart',  'assets/heart.png' );
  game.load.image ( 'sky', 'assets/sky.png' );
  game.load.image ( 'rock', 'assets/rock.png' );
  game.load.image ( 'diamond', 'assets/diamond.png' );
}

var player;
//anything hard that will not move and the player can stand on.
var ground;
var platforms;
var ledges;
var ledge;
var heightOf3rdLedge;
var stars;
var starsTimer;
var rocks;
var rocksTimer;
var hearts;
var heartsTimer;
var diamonds;
var diamondsTimer;
//the object that will record user input via the arrow keys
var cursors;
var lives = 5;
var scoreLives;
var sky;
var score = 0;
var scoreText;
//the many different ledges that will pop up and the player can move up in the game.
var heightOfTallestLedge;
var random; // this is the random number generator
var randomLength;


function create () {
  //  Make our game world 2000x2000 pixels in size (the default is to match the game size)
  // game.world.setBounds(0, 0, game.world.width, 2000);
  // game.camera.setPosition (0, 0);

  // Set the physics system
  game.physics.startSystem (Phaser.Physics.ARCADE);

  sky = game.add.sprite (0, 0, 'sky');
  sky.width = game.world.width;
  sky.height = game.world.height;

  // the platforms group shall be any object that is not movable, and the player can stand on it.
  platforms = game.add.group ();
  //enable physics for any object that is created in this group
  platforms.enableBody = true;

  ground = platforms.create (0, game.world.height - game.world.height * .1, 'ground');
  //scale the ground properly
  //ground.scale.setTo (2, 2);
  ground.width = game.world.width;
  ground.height = game.world.height;
  //don't let the ground move
  ground.body.immovable = true;

  //create a ledges group
  ledges = game.add.group();
  //add physics to the group
  ledges.enableBody = true;

  randomLength = [ Math.floor (game.width / 3), Math.floor (game.width / 4), Math.floor ( game.width / 5 ), ];
  // Display the player on the screen
  //player = game.add.sprite (32, game.world.height - 150, 'dude');
  player = game.add.sprite(game.world.centerX, game.world.centerY, 'dude');
  game.physics.arcade.enable (player);

  //how fast the player falls
  player.body.gravity.y = 400;
  // if the player will collide with the world
  player.body.collideWorldBounds = true;

  player.animations.add ('left', [0, 1, 2, 3], 10, true);
  player.animations.add ('right', [5, 6, 7, 8], 10, true);

  cursors = game.input.keyboard.createCursorKeys ();

  // ---------------------- Falling things --------------------------- //

  ledge = ledges.create ( Math.floor (Math.random() * game.world.width), 300, 'ground');
  ledge.width = randomLength[ Math.floor (Math.random() * 3) ];
  ledge.body.immovable = true;

  ledge = ledges.create ( Math.floor (Math.random() * game.world.width), 250, 'ground');
  ledge.width = randomLength[ Math.floor (Math.random() * 3) ];
  ledge.body.immovable = true;

  ledge = ledges.create ( Math.floor (Math.random() * game.world.width), 150, 'ground');
  ledge.width = randomLength[ Math.floor (Math.random() * 3) ];
  ledge.body.immovable = true;

  ledge = ledges.create ( Math.floor (Math.random() * game.world.width), 50, 'ground');
  ledge.width = randomLength[ Math.floor (Math.random() * 3) ];
  ledge.body.immovable = true;

  ledge = ledges.create ( Math.floor (Math.random() * game.world.width), 00, 'ground');
  ledge.width = randomLength[ Math.floor (Math.random() * 3) ];
  ledge.body.immovable = true;

  // make stars its own group
  stars = game.add.group ();

  //enable physics for this group
  stars.enableBody = true;

  //add a timer that will make a new star every 300 milliseconds and place it randomonly on the screen
  starsTimer = game.time.events.loop(1000, addNewStar, this);

  function addNewStar () {
    star = stars.create ( Math.floor (Math.random() * game.world.width ), game.world.bounds.y, 'star');
    star.body.gravity.y = 300;
    star.checkWorldBounds = true;
    star.outOfBoundsKill = true;
  }

  //make rocks its own group
  rocks = game.add.group ();
  //enable physics for the group
  rocks.enableBody = true;
  //add a timer that will add a new rock and place it randomly on the screen
  //in the addNewRock, function, subtract 1 from the lives variable
  rocksTimer = game.time.events.loop (30000, addNewRock, this);

  function addNewRock () {
    rock = rocks.create ( Math.floor (Math.random() * game.world.width ), game.world.bounds.y, 'rock');
    rock.body.gravity.y = 300;
    rock.checkWorldBounds = true;
    rock.outOfBoundsKill = true;
  }

  //make a hearts game.add, enableBody =true, and heartsTimer //help wanted

  hearts = game.add.group ();
  hearts.enableBody = true ;
  heartsTimer = game.time.events.loop (60000, addNewHeart, this);

  function addNewHeart () {
    heart = hearts.create ( Math.floor (Math.random() * game.world.width ), game.world.bounds.y, 'heart');
    heart.body.gravity.y = 300;
    heart.checkWorldBounds = true;
    heart.outOfBoundsKill = true;
  }

  diamonds = game.add.group ();
  diamonds.enableBody = true ;
  diamondsTimer = game.time.events.loop (3000, addNewDiamond, this);

  function addNewDiamond () {
    diamond = diamonds.create ( Math.floor (Math.random() * game.world.width ), game.world.bounds.y, 'diamond');
    diamond.body.gravity.y = 300;
    diamond.checkWorldBounds = true;
    diamond.outOfBoundsKill = true;
  }


  // ---------------------- Falling things --------------------------- //


  scoreText = game.add.text (game.world.width - game.world.width * .99, 16, 'score:0', {fontSize: '32px', fill: '#000' });

  scoreLives = game.add.text (game.world.width - game.world.width * .1, 16, 'lives:5', {fontSize: '32px', fill: '#000' });

}

function update () {
  //collide the player with the platforms
  game.physics.arcade.collide (player, platforms);
  game.physics.arcade.overlap (player, stars, collectStar, null, this);
  game.physics.arcade.collide (player, ledges);
  game.physics.arcade.overlap (player, rocks, collectRock, null, this);

  // I have to specify here when the player lands on the 3rd ledge, to spawn 5 more.

  function collectStar (player, star) {
    star.kill();
    score += 10;
    scoreText.text = 'Score: ' + score;
  }

  game.physics.arcade.overlap (player, rocks, collectRock, null, this);

  function collectRock (player, rock) {
    rock.kill();
    lives -= 1;
    scoreLives.text = 'Lives: ' + lives;
  }

  game.physics.arcade.overlap (player, hearts, collectHeart, null, this) //help wanted

  //make function for collectHeart
  function collectHeart (player, heart) {
    heart.kill();
    lives += 1;
    scoreLives.text = 'Lives: ' + lives;
  }

  game.physics.arcade.overlap (player, diamonds, collectDiamond, null, this) //help wanted

  //make function for collectDiamond
  function collectDiamond (player, diamond) {
    diamond.kill();
    for (var i = 0; i < 15; i++) {
      star = stars.create ( player.position.x - i * 5 , game.world.bounds.y + i * 10, 'star');
      star.body.gravity.y = 300;
      star.checkWorldBounds = true;
      star.outOfBoundsKill = true;
    }
  }

  //game.physics.arcade.overlap (player, diamonds, collectDiamond, null, this) //help wanted

  //collectDiamond function () {} when the player hits a diamond add 1,000 points to her score, AND
  //drop 15 or plus stars on the screen. like this
  // *
  //  *
  //   *
  //    *
  //     *
  //      *
  //       *
  //        *
  //         *
  //          *
  //           *
  //            *

  player.body.velocity.x = 0;
  if (cursors.left.isDown) {
    // move to the left
    player.body.velocity.x = -250;
    player.animations.play ('left');
  } else if (cursors.right.isDown) {
    //move to the right
    player.body.velocity.x = 250;
    player.animations.play ('right');
  } else {
    //stop moving
    player.animations.stop();
    //make the player look at you.
    player.frame = 4;
  }
  //  allow the player to jump!!!
  if (cursors.up.isDown && player.body.touching.down) {
    player.body.velocity.y = -450;
  }

}


//make a function for collectDiamond
function collectDiamond () {
  diamond = diamonds.create ( Math.floor (Math.random() * game.world.width ), game.world.bounds.y, 'diamond');
  diamond.body.gravity.y = 200;
  diamond.checkWorldBounds = true;
  diamond.outOfBoundsKill = true;
}

//make 5 more ledges
function make5Ledges () {
  //get the tallest sprite on the world
  heightOfTallestLedge = ledges.getTop();
  if (heightOfTallestLedge == null) {
    //ground.position returns an object. We want y, the position of the image on the y-axis.
    heightOfTallestLedge = ground.position.y;
  } else {
    heightOfTallestLedge = heightOfTallestLedge.position.y;
  }
  for (var i = 1; i < 6; i++) {
    // if this is the 3rd ledge, make sure that when the player touches it, we create 5 more ledges.
    // This code is not perfect.  It is possible for the user to overlap with this ledge multiple times...
    // This means the player could spawn many many many ledges.
    if ( i == 3 ) {
      //make the ledge be randomly put on the map...
      ledge = ledges.create (Math.floor( Math.random() * game.world.width ), heightOfTallestLedge - game.world.height * .1, 'ground');
      //randomly assign a width to the ledge
      ledge.width = randomLength [ Math.floor( Math.random() * 3) ];
      ledge.body.immovable = true;
      heightOf3rdLedge = ledge.position.y;
      heightOfTallestLedge = heightOf3rdLedge;
    } else {
      //make the ledge be randomly put on the map...
      ledge = ledges.create (Math.floor( Math.random() * game.world.width ), heightOfTallestLedge - 50, 'ground');
      //randomly assign a width to the ledge
      ledge.width = randomLength [ Math.floor( random * 3) ];
      ledge.body.immovable = true;
      heightOfTallestLedge = ledge.position.y;
    }
  }
//  game.physics.arcade.overlap (player, ledge, make5ledges, null, this);
}
