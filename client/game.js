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
const minChallengeLen = 5;
const maxChallengeLen = 8;
const letters = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'z', 'x', 'c', 'v', 'b', 'n', 'm'];

let player;
let treasures;
let cursors;
let spacebar;
let score;
let scoreText;
let gameTimer;
let gameTimerText;
let letterKeys;
let challengeActive;
let currentChallengeTreasure;
let currentKeyIndex;
let challengeText;
let dt = 1/60;
let game = new Phaser.Game(config);

function preload() {
    this.load.setBaseURL('');

    this.load.image('background', '/assets/img/background.png');
    this.load.image('player', '/assets/img/player.png');
    this.load.image('treasure', '/assets/img/treasure.png');
}

function create() {
    this.add.image(500, 500, 'background');

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
        treasure.challenge = createChallenge();
    });

    score = 0;

    scoreText = this.add.text(16, 16, score, {fontSize: '32px', fill: '#000'});

    gameTimer = 120;
    gameTimerText = this.add.text(player.body.position.x, player.body.position.y - 255, secToMinSec(gameTimer), {fontSize: '32px', fill: '#000'});

    challengeText = this.add.text(player.body.position.x, player.body.position.y + 50, '', {fontSize: '40px', fill: '#000', align: 'center'});

    spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    challengeActive = false;

    letterKeys = [];
    letterKeys.push(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q));
    letterKeys.push(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W));
    letterKeys.push(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E));
    letterKeys.push(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R));
    letterKeys.push(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.T));
    letterKeys.push(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Y));
    letterKeys.push(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.U));
    letterKeys.push(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.I));
    letterKeys.push(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.O));
    letterKeys.push(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P));
    letterKeys.push(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A));
    letterKeys.push(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S));
    letterKeys.push(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D));
    letterKeys.push(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F));
    letterKeys.push(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.G));
    letterKeys.push(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.H));
    letterKeys.push(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.J));
    letterKeys.push(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.K));
    letterKeys.push(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.L));
    letterKeys.push(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z));
    letterKeys.push(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X));
    letterKeys.push(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C));
    letterKeys.push(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.V));
    letterKeys.push(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.B));
    letterKeys.push(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.N));
    letterKeys.push(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M));
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

    if(Phaser.Input.Keyboard.JustDown(spacebar) && !challengeActive) {
        treasures.children.iterate((treasure) => {
            this.physics.world.overlap(player, treasure, startChallenge);
        });
    }

    if(challengeActive) {
        if(Phaser.Input.Keyboard.JustDown(letterKeys[currentChallengeTreasure.challenge[currentKeyIndex]])) {
            currentKeyIndex++;
            challengeText.setText(challengeText.text + " " + letters[currentChallengeTreasure.challenge[currentKeyIndex]]);

            if(currentKeyIndex >= currentChallengeTreasure.challenge.length) {
                collectTreasure(currentChallengeTreasure);
            }
        }
    }

    gameTimer -= dt;
    gameTimerText.setText(secToMinSec(gameTimer));

    scoreText.x = player.body.position.x - 350;
    scoreText.y = player.body.position.y - 255;

    gameTimerText.x = player.body.position.x;
    gameTimerText.y = player.body.position.y - 255;

    challengeText.x = player.body.position.x;
    challengeText.y = player.body.position.y + 50;
}

function collectTreasure(treasure) {
    treasure.disableBody(true, true);

    score++;
    scoreText.setText(score);

    challengeActive = false;
    challengeText.setText('');
}

function createChallenge() {
    let challengeArr = [];
    let challengeLen = Phaser.Math.Between(minChallengeLen, maxChallengeLen);

    for(let i = 0; i < challengeLen; i++) {
        challengeArr.push(Phaser.Math.Between(0, letters.length - 1));
    }

    return challengeArr;
}

function startChallenge(player, treasure) {
    currentChallengeTreasure = treasure;
    challengeActive = true;
    currentKeyIndex = 0;
    challengeText.setText(letters[currentChallengeTreasure.challenge[currentKeyIndex]]);
}

function secToMinSec(secs) {
    let min = Math.floor(secs/60);
    let sec = Math.floor(secs % 60);
    return `${min}:${sec < 10 ? '0' + sec : sec}`;
}