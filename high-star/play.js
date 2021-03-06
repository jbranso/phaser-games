var playState = {

  preload:function () {
    //this value will be the smallest number, divisible by 100, that larger than how many seconds the user has been playing
    //this game
    this.timeDivisibleBy;
    //the little phaser sprite
    this.player;
    //I got the rocket from here: http://www.spriteland.com/sprites/rocket-sprite.html
    //here are their terms of use: http://www.spriteland.com/about/terms.html
    //a rocket sprite
    this.rocket;
    //this will be the number of ledges that must fall before another rocket appears
    this.numberOfLedgesForNewRocket;
    //the width of the rocket
    this.widthOfRocket;
    //the groups that rockes belongs to
    this.rockets;
    //I got the fire from here http://bestanimations.com/Nature/Fire/Fire.html
    this.explodingRocket;
    //they are 69 pixels wide and 31 tall
    this.explodingRockets;
    //anything hard that will not move and the player can stand on.
    this.ground;
    this.platforms;
    //this is the group from which the ledges are built
    this.ledges;
    this.ledge;
    this.ledgeVelocity = 80;
    // the ledgePosition with have 3 possible values:  "x0"                   "x1"                     "x2"                  "x3"
    // It will be the X position on the screen where the highest ledge is.
    // It will determine where the next ledge will be put on the screen
    //This will be an array that stores the ledge X Positions. The first one will be the highest ledge. The 2nd will be the 2nd highest
    //and so on
    this.ledgeXPosition;
    // This will store the value of the ledges width
    this.ledgeWidth;
    //This is the individual star falling on the screen
    this.star;
    //this is for the exploding star that is shown on screen when I take a star
    this.explodingStar;
    //this will hold the exploding Stars group
    this.explodingStars;
    //this is the object from which I can create more individual stars
    this.stars;
    //This is the individual temp star that falls after I hit a diamond.
    this.tempStar;
    //This is the object that produces more temp stars when I a diamond
    this.tempStars;
    this.starsTimer;
    this.rocks;
    this.rock;
    this.rocksTimer;
    this.hearts;
    this.heartsTimer;
    this.diamonds;
    this.diamondsTimer;
    //the object that will record user input via the arrow keys
    this.tempStar;
    this.cursors;
    this.sky;
    this.lives = 5;
    this.scoreLives;
    this.score = 0;
    //This is the variable that is displayed on the screen as my score
    this.scoreText;
    this.i = 1;
    //This is the player's x position
    this.x;
    //these will store the values of the various places on the screen I can put a ledge.
    // This is much easier than saying game.world.width / 2;
    this.x0;
    this.x1;
    this.x2;
    this.x3;
    this.y0;
    this.y1;
    this.y2;
    this.y3;
    this.xArray = new Array();

    this.x0 = 0;
    this.x1 = this.game.world.width / 4;
    this.x2 = this.game.world.width / 2;
    this.x3 = this.game.world.width * ( 3 / 4);
    this.yArray = new Array(4);
    this.restartImage;
  },

  create: function () {
    //start this out at 100
    this.timeDivisibleBy = 20;
    //  Make our game world 2000x2000 pixels in size (the default is to match the game size)
    // game.world.setBounds(0, 0, game.world.width, 2000);
    // game.camera.setPosition (0, 0);
    var pkey = game.input.keyboard.addKey (Phaser.Keyboard.P);
    //When the player plesses the p key, we call the start function
    pkey.onDown.add (this.pauseGame, this);

    // Set the physics system
    this.game.physics.startSystem (Phaser.Physics.ARCADE);

    this.x0 = 0;
    this.x1 = this.game.world.width / 4;
    this.x2 = this.game.world.width / 2;
    this.x3 = this.game.world.width * ( 3 / 4);

    this.xArray[0] = this.x0;
    this.xArray[1] = this.game.world.width / 4;
    this.xArray[2] = this.game.world.width / 2;
    this.xArray[3] = this.game.world.width * (3 / 4);

    this.y0 = 0;
    this.y1 = this.game.world.height / 4;
    this.y2 = this.game.world.height / 2;
    this.y3 = this.game.world.height * (3 / 4);

    this.yArray[0] = 0;
    this.yArray[1] = this.game.world.height / 4;
    this.yArray[2] = this.game.world.height / 2;
    this.yArray[3] = this.game.world.height * (3 / 4);

    this.ledgeWidth = this.game.world.width / 4 / 1.5;

    // this.sky = this.add.sprite (0, 0, 'sky');
    // this.sky.width = this.game.world.width;
    // this.sky.height = this.game.world.height;
    //game.stage.backgroundColor = "#87CEEB";

    var out = [];
    var bmd = game.add.bitmapData(game.world.width, game.world.height);
    bmd.addToWorld();

    var y = 0;

    for (var i = 0; i < game.world.height / 2; i++)
    {
      var c = Phaser.Color.interpolateColor(0x009acd, 0x87ceeb, game.world.height / 2, i);

      // console.log(Phaser.Color.getWebRGB(c));

      bmd.rect(0, y, game.world.width, game.world.height, Phaser.Color.getWebRGB(c));

      out.push(Phaser.Color.getWebRGB(c));

      y += 2;
    }

    this.player = this.add.sprite(game.world.centerX, game.world.centerY, 'dude');
    this.game.physics.arcade.enable (this.player);
    //how fast the player falls
    this.player.body.gravity.y = 600;
    // if the player will collide with the world
    //this.player.body.collideWorldBounds = true;

    // the platforms group shall be any object that is not movable, and the player can stand on it.
    this.platforms = game.add.group ();
    //enable physics for any object that is created in this group
    this.platforms.enableBody = true;

    this.ground = this.platforms.create (0, game.world.height - game.world.height * .1, 'ground');
    //scale the ground properly
    //ground.scale.setTo (2, 2);
    this.ground.width = game.world.width;
    this.ground.height = game.world.height;
    //don't let the ground move
    this.ground.body.immovable = true;
    this.groundTimer = this.game.time.events.loop(5000, this.deleteGround, this);
    this.groundTimer.autoDestroy = true;

    //create a ledges group
    this.ledges = this.game.add.group();
    //add physics to the group
    this.ledges.enableBody = true;
    game.physics.arcade.enable (this.ledges);
    //create 4 ledges
    this.ledges.createMultiple (4, 'ground');

    for (var i = 0; i < 4; i++){
      this.ledge = this.ledges.getFirstDead ();
      this.ledge.reset (this.xArray[i], this.yArray[i]);
      console.log ("this.ledge.reset (" + this.xArray[i] + "," + this.yArray[i]);
      this.ledge.width = this.ledgeWidth;
      //don't let the player jump and push the ledge down
      this.ledge.body.immovable = true;
      this.ledge.checkWorldBounds = true;
      this.ledge.events.onOutOfBounds.add(this.recycleLedge, this);
    }
    this.ledgeXPosition = ["x0", "x1", "x2", "x3"];

    //create a rockets group
    this.rockets = this.game.add.group();
    //add physics to the group
    this.rockets.enableBody = true;
    game.physics.arcade.enable (this.rockets);
    //create 4 rockets
    this.rockets.createMultiple (4, 'rocket');
    this.widthOfRocket = 59;
    this.rockets.forEach (function (rocket) {
      rocket.body.gravity.y = 600;
      rocket.checkWorldBounds = true;
      rocket.outOfBoundsKill = true;
    }, this);

    this.rocket = this.rockets.getFirstDead ();
    console.log("rocket: " + this.rocket);
    this.rocket.ledgeXPosition = "x0";
    this.rocket.reset(0, -15);

    //create an exploding rocket
    this.explodingRockets = this.game.add.group ();
    //give the rockets physics
    this.explodingRockets.enableBody = true;
    game.physics.arcade.enable (this.explodingRockets);
    //create 4 exploding rockets
    this.explodingRockets.createMultiple (4, 'explodingRocket');
    this.explodingRockets.forEach (function (explodingRocket) {
      explodingRocket.body.gravity = 200;
      explodingRocket.animations.add ('explode', [0, 1, 2, 3, 4], 10, false);
    }, this);


    //how fast the rocket falls

    //Check to see if the player has left the world each frame, if he has then emit onOutOfBounds
    this.player.checkWorldBounds = true;
    this.player.animations.add ('left', [0, 1, 2, 3], 10, true);
    this.player.animations.add ('right', [5, 6, 7, 8], 10, true);

    this.cursors = game.input.keyboard.createCursorKeys ();

    // ---------------------- Falling things --------------------------- //

    // make stars its own group
    this.tempStars = this.game.add.group ();

    //enable physics for this group
    this.tempStars.enableBody = true;
    this.tempStars.createMultiple (99, 'tempStar');
    this.tempStars.forEach (function (tempStar) {
      tempStar.body.gravity.y = 300;
      tempStar.checkWorldBounds = true;
      tempStar.outOfBoundsKill = true;
    }, this);

    // make stars its own group
    this.stars = this.game.add.group ();
    //enable physics for this group
    this.stars.enableBody = true;

    this.stars.createMultiple (99, 'star');
    this.stars.forEach (function (star) {
      star.body.gravity.y = 300;
      star.checkWorldBounds = true;
      star.outOfBoundsKill = true;
    }, this);

    //add a timer that will make a new star every 300 milliseconds and place it randomonly on the screen
    this.starsTimer = this.game.time.events.loop(1009, this.recycleStar, this);

    //make exploding Stars its own group
    this.explodingStars = this.game.add.group ();
    //let the exploding star interact in the arcade physics
    this.explodingStars.enableBody = true;
    this.explodingStars.createMultiple (10, 'explodingStar');
    //add gravity to all of the exploding stars
    this.explodingStars.forEach (function (explodingStar) {
      explodingStar.body.gravity.y = 300;
      explodingStar.checkWorldBounds = true;
      explodingStar.outOfBoundsKill = true;
    }, this);

    //create an animation for the exploding star
    this.explodingStars.forEach (function (explodingStar) {
      explodingStar.animations.add ('explode', [0, 1, 2, 3, 4], 10, false);
    }, this);

    //make rocks its own group
    this.rocks = this.game.add.group ();
    //enable physics for the group
    this.rocks.enableBody = true;

    //add a timer that will add a new rock and place it randomly on the screen
    //in the recycleRock, function, subtract 1 from the lives variable
    this.rocks.createMultiple (20, 'rock');
    this.rocksTimer = this.game.time.events.loop (30011, this.recycleRock, this);

    //make a hearts game.add, enableBody =true, and heartsTimer //help wanted

    this.hearts = game.add.group ();
    this.hearts.enableBody = true ;
    this.hearts.createMultiple (20, 'heart');
    this.heartsTimer = this.game.time.events.loop (60013, this.recycleHeart, this);

    this.diamonds = game.add.group ();
    this.diamonds.enableBody = true ;
    this.diamonds.createMultiple (20, 'diamond');
    this.diamondsTimer = game.time.events.loop (10007, this.recycleDiamond, this);

    this.scoreText = game.add.text (game.world.width - game.world.width * .99, 16, 'score:0', {fontSize: '32px', fill: '#000' });
    this.scoreLives = game.add.text (game.world.width - game.world.width * .1, 16, 'lives:5', {fontSize: '32px', fill: '#000' });

  },

  pauseGame: function () {
    if (game.paused)
      game.paused = false;
    else
      game.paused = true;
  },

  update: function () {
    // if(userClicksRestart() || (lives == 0)){ // Check to see the game needs restarting
    //if the user has lost all of his lives...
    if ( this.lives == 0) {
      this.state.start ('lose');
    }

    //collide the player with the platforms
    game.physics.arcade.collide (this.player    , this.platforms);
    game.physics.arcade.collide (this.player    , this.ledges);
    game.physics.arcade.collide (this.rockets   , this.ledges);

    // ---------------------- Falling things --------------------------- //
    //let the player collect any falling thing
    game.physics.arcade.overlap (this.player, this.stars,     this.collectStar,     null, this);
    game.physics.arcade.overlap (this.player, this.rocks,     this.collectRock,     null, this);
    game.physics.arcade.overlap (this.player, this.hearts,    this.collectHeart,    null, this);
    game.physics.arcade.overlap (this.player, this.diamonds,  this.collectDiamond,  null, this);
    game.physics.arcade.overlap (this.player, this.tempStars, this.collectTempStar, null, this);
    //let the player get punished or rewarded if he hits the rocket
    game.physics.arcade.overlap (this.player, this.rockets, this.collectRocket, null, this);
    this.ledges.forEachAlive (this.addVelocity, this, this);
    this.tempStars.forEach (this.updateTempStarPositionX, this);

    //pausing stops the player from having gravity, so I need to add it in again
    this.player.body.gravity.y = 600;
    //If the player moves too far to the right or left, put him back in the world
    this.player.events.onOutOfBounds.add(this.putPlayerInWorld, this);
    //dictate how the player moves
    this.player.body.velocity.x = 0;
    if (this.cursors.left.isDown) {
      // move to the left
      this.player.body.velocity.x = -250;
      this.player.animations.play ('left');
    } else if (this.cursors.right.isDown) {
      //move to the right
      this.player.body.velocity.x = 250;
      this.player.animations.play ('right');
    } else {
      //stop moving
      this.player.animations.stop();
      //make the player look at you.
      this.player.frame = 4;
    }
    //  allow the player to jump!!!
    if (this.cursors.up.isDown && this.player.body.touching.down) {
      this.player.body.velocity.y = -450;
    }

    //let the player move down faster is needed
    if (this.cursors.down.isDown && !this.player.body.touching.down) {
      this.player.body.velocity.y = 800;
    }

    //make the ledges fall faster but not faster than 100 as time goes on
    if (this.ledgeVelocity < 100) {
      if (game.time.totalElapsedSeconds() > this.timeDivisibleBy) {
        this.ledgeVelocity += 5;
        this.timeDivisibleBy += 20;
      }
    }

    //move the rocket forward and back on the ledge if it is in the world
    if (true) {
      var x = null;
      switch (this.rocket.ledgeXPosition) {
      case "x0":
        x = 0;
        break;
      case "x1":
        x = this.x1;
        break;
      case "x2":
        x = this.x2;
        break;
      case "x3":
        x = this.x3;
        break;
      default:
        alert ("Your update rocket switch statement is broked");
      }
      //if the rocket is facing left, then push it left
      if (this.rocket.frame == 1) {
        this.rocket.body.velocity.x = 100;
        //if the rocket is equal to or greater than the farthest x position on the ledge, then turn it around
        if (this.rocket.position.x >= this.ledgeWidth + x - this.widthOfRocket) {
          this.rocket.frame = 0;
          this.rocket.body.velocity.x = -100;
        }
        //if the has hit the left side of the screen coming back, then turn it around
      } else { //turn the rocket around and patrol back
        this.rocket.body.velocity.x = -100;
        //if the rocket is <= to the eastern most position on the ledge, then flip it around and push it back
        if (this.rocket.position.x <= x) {
          this.rocket.frame = 1;
          this.rocket.body.velocity.x = 100;
          this.rocket.position.x = 10;
        }
      }
    }
    //update the score and the lives section of the page
    this.scoreText.text = 'Score: ' + this.score;
    this.scoreLives.text = 'Lives: ' + this.lives;
  },

  //add a velocity to all alive ledges
  addVelocity: function ( ledge ) {
    ledge.body.velocity.y = this.ledgeVelocity;
  },

  stopVelocity: function ( ledge ) {
    ledge.body.velocity.y = 0;
  },

  //This funcition is called anytime the player is out of bounds.
  //if the player has fallen below the world, it will take 1 life and respawn him
  //if he is to the right of the world it will put him on the left and vice versa
  putPlayerInWorld: function (player) {
    //if the player is below the world, kill a life and respawn him
    if (player.position.y > game.world.height) {
      this.lives -= 1;
      //If there are 4 ledges that are alive, then we'll put the guy on the 3rd ledge
      var living = this.ledges.countLiving();
      //Put the ledge on the 3rd from the top
      var yArray = [this.ledges.children[0].position.y, this.ledges.children[1].position.y, this.ledges.children[2].position.y, this.ledges.children[3].position.y];
      var xArray = [this.ledges.children[0].position.x, this.ledges.children[1].position.x, this.ledges.children[2].position.x, this.ledges.children[3].position.x];
      var largestX = Math.max.apply(Math, xArray);
      //the y axis starts at 0 at the top of the screen.  so y == roughly 1000 is the bottom of the screen. Therefore we are
      //interested in the lowest value of any living edge. This means the ledge is close to the top of the screen
      var minimumY = Math.min.apply(Math, yArray);
      //If there are 3 ledges then put him on the highest ledge this is very unlikely to ever happen. Most likely when the player
      //dies there will exist 4 ledges on the screen
      if (living == 3) {
        this.player.position.x = largestX;
        this.player.position.y = minimumY;
        //if there are 4 ledges, put him on the 3rd ledge
      } else if (living == 4) {
        //this is also very unlikely to happen. most likely the player will not die when the highest ledge is at the top of the screen
        if (minimumY == 0) {
          this.player.position.x = this.ledges.children[3].position.x + 50;
          this.player.position.y = this.ledges.children[3].position.y;
          //this bit of code will probably be executed every time the player falls out of the screen
        } else {
          this.player.position.y = minimumY - 80;
          //what is the x position of the highest ledge?
          for(var i = 0; i <= 3; i++) {
            if (this.ledges.children[i].position.y == minimumY)
              this.player.position.x = this.ledges.children[i].position.x + 40;
          }
        }
      } else {
        alert ("Not 3 or 4 ledges are alive");
      }
      //if the player is to the left, put him on the right
    } else if (player.position.x < 0 ) {
      player.position.x = game.world.width;
      //if the player is on the right, then put him on the left
    } else if (player.position.x > game.world.width) {
      player.position.x = 0;
    }
  },

  //Make all the falling tempStars fall right into the player
  updateTempStarPositionX: function ( tempStar ) {
    tempStar.body.position.x = this.player.body.position.x;
  },

  recycleRock: function (rock) {
    var rock = this.rocks.getFirstDead();
    rock.reset ( Math.floor (Math.random() * game.world.width ), 0);
    rock.body.gravity.y = 300;
    rock.checkWorldBounds = true;
    rock.outOfBoundsKill = true;
  },

  recycleHeart: function (timer) {
    var heart = this.hearts.getFirstDead();
    if ( Math.floor( Math.random() * 2)) {
      heart.reset ( Math.floor (this.player.position.x) + this.ledgeWidth * Math.random() / 2, 0);
    } else {
      heart.reset  ( Math.floor (this.player.position.x) - this.ledgeWidth * Math.random() / 3, 0);
    }
    //this.heart = this.hearts.create ( Math.floor (Math.random() * game.world.width ), 0, 'heart');
    heart.body.gravity.y = 300;
    heart.checkWorldBounds = true;
    heart.outOfBoundsKill = true;
  },

  recycleDiamond: function (timer) {
    var diamond = this.diamonds.getFirstDead();
    if ( Math.floor( Math.random() * 2)) {
      diamond.reset ( Math.floor (this.player.position.x) + this.ledgeWidth * Math.random() / 2, 0);
    } else {
      diamond.reset ( Math.floor (this.player.position.x) - this.ledgeWidth * Math.random() / 2, 0);
    }
    diamond.body.gravity.y = 300;
    diamond.checkWorldBounds = true;
    diamond.outOfBoundsKill = true;
  },

  deleteGround: function (ground) {
    this.ground.kill();
  },

  //When the star hits the player, kill increase the score
  collectStar: function (player, star) {
    var x = star.position.x - 5;
    var y = star.position.y - 5;
    var yVelocity = star.body.velocity.y;
    star.kill();
    //this.explodingStar.alive = true;
    var explodingStar = this.explodingStars.getFirstDead ();
    explodingStar.reset (x, y);
    explodingStar.body.velocity.y = -200;
    explodingStar.animations.play ('explode', null, false, true);
    this.score += 10;
  },

  //When the star hits the player, kill increase the score
  collectTempStar: function (player, tempStar) {
    tempStar.kill();
    this.score += 10;
  },

  //When the rock hits the player, kill increase the score
  collectRock: function (player, rock) {
    rock.kill();
    this.lives -= 1;
  },

  //make function for collectHeart
  collectHeart: function (player, heart) {
    heart.kill();
    this.lives += 1;
  },

  collectDiamond: function (player, diamond) {
    diamond.kill();
    this.x = Math.floor (player.position.x);
    this.i = 1;
    // if stars already has 50+ stars, recyle 'em. Don't make more.
    this.game.time.events.repeat(100, 15, this.recycleATempStar, this );
  },

  collectRocket: function (player, rocket) {
    //if the player landed on top of the rocket, make the rocket disappear and give the player some points
    if (player.body.touching.down && !player.body.touching.left && !player.body.touching.right) {
      var x = rocket.position.x - 5;
      var y = rocket.position.y - 5;
      //kill the rocket so it can be reused
      rocket.kill();
      var explodingRocket = this.explodingRockets.getFirstDead();
      explodingRocket.reset (x, y);
      //play the explode animation and kill it when finished
      explodingRocket.animations.play ('explode', null, false, true);
      //don't let the rocket fall back down
      rocket.body.gravity.y = 0;
      //increase the score
      this.score += 30;
    } else  { //make the player fall out of the world and subtract one life
      player.position.y = 5000;
    }
    this.numberOfLedgesForNewRocket = Math.ceil (Math.random() * 15);
  },

  ledgeSetWidth: function ( ledge ) {
    ledge.width = this.ledgeWidth;
  },

  //this makes stars fall from the top
  recycleStar: function (timer) {
    var star = this.stars.getFirstDead ();
    if ( Math.floor( Math.random() * 2)) {
      star.reset (this.player.position.x + Math.random() * this.ledgeWidth / 2, 0);
    } else {
      star.reset (this.player.position.x - Math.random() * this.ledgeWidth / 2, 0);
    }
    star.body.gravity.y = 300;
    star.checkWorldBounds = true;
    star.outOfBoundsKill = true;
  },

  //This is the function that is called when the player hits a diamond
  recycleATempStar: function (tempStars) {
    //if there is no original tempStar, create it.
    this.tempStar = this.tempStars.getFirstDead ();
    if (this.x < game.world.width / 2) {
      this.tempStar.reset (this.x + this.i * 20, 0);
    } else if (this.x > game.world.width / 2) {
      this.tempStar.reset (this.x - this.i * 20, 0);
    }
    this.i++;
    this.tempStar.body.gravity.y = 300;
    this.tempStar.checkWorldBounds = true;
    this.tempStar.outOfBoundsKill = true;
  },

  //recycles ledges and rockets
  recycleLedge: function (ledge) {
    //  Move the ledge to the top of the screen again
    switch (this.ledgeXPosition [0]) {
    case "x0":
      if (Math.floor ( Math.random() * 2)) {
        ledge.reset(this.x1, 0);
        //delete the last element of the array. It's no longer on the screen
        this.ledgeXPosition.splice(3, 1);
        //make the first element of the array the reset ledge, because that ledge is the highest now.
        this.ledgeXPosition.unshift( "x1");
      } else {
        //delete the last element of the array. It's no longer on the screen
        this.ledgeXPosition.splice(3, 1);
        this.ledgeXPosition.unshift ("x3");
        ledge.reset(this.x3, 0);
      }
      break;
    case "x1":
      if (Math.floor ( Math.random() * 2)) {
        ledge.reset(this.x0, 0);
        //delete the last element of the array. It's no longer on the screen
        this.ledgeXPosition.splice(3, 1);
        this.ledgeXPosition.unshift("x0");
      } else {
        ledge.reset(this.x2, 0);
        this.ledgeXPosition.splice(3, 1);
        this.ledgeXPosition.unshift("x2");
      }
      break;
    case "x2":
      if (Math.floor ( Math.random() * 2)) {
        ledge.reset(this.x1, 0);
        this.ledgeXPosition.splice(3, 1);
        this.ledgeXPosition.unshift("x1");
      } else {
        ledge.reset(this.x3, 0);
        this.ledgeXPosition.splice(3, 1);
        this.ledgeXPosition.unshift("x3");
      }
      break;
    case "x3":
      if (Math.floor ( Math.random() * 2)) {
        ledge.reset(this.x2, 0);
        this.ledgeXPosition.splice(3, 1);
        this.ledgeXPosition.unshift("x2");
      } else {
        ledge.reset(this.x0, 0);
        this.ledgeXPosition.splice(3, 1);
        this.ledgeXPosition.unshift("x0");
      }
      break;
    default:
      alert ("your switch statement is broken and ledgeXPositon ==".concat(this.ledgeXPosition));
      break;
    }

    this.numberOfLedgesForNewRocket--;
    if (this.numberOfLedgesForNewRocket == 0) {
      this.rocket = this.rockets.getFirstDead ();
      switch (this.ledgeXPosition [0]) {
      case "x0":
        this.rocket.reset (this.x0, -10);
        break;
      case "x1":
        this.rocket.reset (this.x1, -10);
        break;
      case "x2":
        this.rocket.reset (this.x2, -10);
        break;
      case "x3":
        this.rocket.reset (this.x3, -10);
        break;
      }
      this.numberOfLedgesForNewRocket = Math.ceil(Math.random() * 15);
    }
  }
};

//game.state.add('gameState', highStar.gameState);
//game.state.start('gameState');
