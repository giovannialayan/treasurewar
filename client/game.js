const Phaser = require('phaser');

const gameWidth = 800;
const gameHeight = 600;

const worldWidth = 1000;
const worldHeight = 1000;

let config = {
    type: Phaser.AUTO,
    width: gameWidth,
    height: gameHeight,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const playerSpeed = 300;

let player;
let treasures;
let cursors;
let spacebar;
let score;
let scoreText;
let walls;
let gameTimer;
let gameTimerText;
let game = new Phaser.Game(config);

function preload() {
    this.load.setBaseURL('');

    this.load.image('background', '/assets/img/background.png');
    this.load.image('player', '/assets/img/player.png');
    this.load.image('treasure', '/assets/img/treasure.png');
    //this.load.image('wall', '/assets/img/wall.png');
}

function create() {
    this.add.image(500, 500, 'background');

    //walls = this.physics.add.staticGroup();
    //walls.create(800, 0, 'wall');

    this.cameras.main.setBackgroundColor('#863b00');

    this.physics.world.setBounds(0, 0, 1000, 1000);

    player = this.physics.add.sprite(500, 500, 'player');

    player.setBounce(0);
    player.setCollideWorldBounds(true);

    this.cameras.main.startFollow(player);
    
    cursors = this.input.keyboard.createCursorKeys();

    treasures = this.physics.add.group({
        key: 'treasure',
        repeat: 8
    });

    treasures.children.iterate((treasure) => {
        treasure.x = Phaser.Math.Between(0 + treasure.displayWidth / 2, worldWidth - treasure.displayWidth / 2);
        treasure.y = Phaser.Math.Between(0 + treasure.displayHeight / 2, worldHeight - treasure.displayHeight / 2);
    });

    score = 0;

    scoreText = this.add.text(16, 16, score, {fontSize: '32px', fill: '#000'});

    gameTimer = 120;
    gameTimerText = this.add.text(player.body.position.x, player.body.position.y - 255, );

    spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
}

function update() {
    if(cursors.left.isDown) {
        player.setVelocityX(-playerSpeed);
    }
    else if(cursors.right.isDown) {
        player.setVelocityX(playerSpeed);
    }
    else {
        player.setVelocityX(0);
    }

    if(cursors.up.isDown) {
        player.setVelocityY(-playerSpeed);
    }
    else if(cursors.down.isDown) {
        player.setVelocityY(playerSpeed);
    }
    else {
        player.setVelocityY(0);
    }

    if(Phaser.Input.Keyboard.JustDown(spacebar)) {
        treasures.children.iterate((treasure) => {
            this.physics.world.overlap(player, treasure, collectTreasure);
        });
    }

    scoreText.x = player.body.position.x - 350;
    scoreText.y = player.body.position.y - 255;
}

function collectTreasure(player, treasure) {
    treasure.disableBody(true, true);

    score++;
    scoreText.setText(score);
}

function secToMinSec(secs) {
    return `${Math.floor(secs/60)}:${secs % 60}`;
}