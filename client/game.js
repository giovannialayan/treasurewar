//const Phaser = require('phaser');

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
const letters = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Z', 'X', 'C', 'V', 'B', 'N', 'M'];
const totalNumTreasures = 10;

let cursors;
let spacebar;
let score;
let scoreText;
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
    this.load.image('player', '/assets/img/robot.png');
    this.load.image('treasure', '/assets/img/treasure-mound.png');
    this.load.image('amogus', '/assets/img/sus.png');
}

function create() {
    const scene = this;
    this.socket = io();
    this.otherPlayers = this.physics.add.group();

    this.socket.on('currentPlayers', (players) => {
        Object.keys(players).forEach((id) => {
            if(players[id].playerId === scene.socket.id) {
                addPlayer(scene, players[id]);
            }
            else {
                addOtherPlayer(scene, players[id]);
            }
        });
    });

    this.socket.on('newPlayer', (playerInfo) => {
        addOtherPlayer(scene, playerInfo);
    });

    this.socket.on('playerDisconnected', (playerId) => {
        scene.otherPlayers.getChildren().forEach((otherPlayer) => {
            if(playerId === otherPlayer.playerId) {
                otherPlayer.destroy();
            }
        });
    });

    cursors = this.input.keyboard.createCursorKeys();

    this.socket.on('playerMoved', (playerInfo) => {
        scene.otherPlayers.getChildren().forEach((otherPlayer) => {
            if(playerInfo.playerId === otherPlayer.playerId) {
                otherPlayer.setPosition(playerInfo.x, playerInfo.y);
            }
        });
    });

    this.gameTimer = 240;

    this.socket.on('timerTicked', (time) => {
        scene.gameTimer = time;
        gameTimerText.setText(secToMinSec(scene.gameTimer));
    });

    this.treasures = this.physics.add.group();

    this.socket.on('placeTreasures', (treasures) => {
        treasures.forEach((treasureData) => {addTreasure(scene, treasureData);});
    });

    this.socket.on('treasureRemoved', (treasureData) => {
        const treasureToDestroy = scene.treasures.getChildren().find(treasure => treasure._id === treasureData._id);

        if(challengeActive && currentChallengeTreasure === treasureToDestroy) {
            challengeActive = false;
            challengeText.setText('');
        }

        treasureToDestroy.destroy();
    });

    this.playerWinText = this.add.text(0, 0, '', {fontSize: '32px', fill: '#000', align: 'center'});
    this.playerWinText.setOrigin(.5, 0);
    this.playerWinText.setDepth(1);
    this.gameOver = false;

    this.socket.on('playerWon', (players) => {
        console.log(players);
        let scoreboard = '';
        players.forEach((player) => {
            scoreboard += `${player.playerId}: ${player.score}\n`;
        });
        scene.playerWinText.setText(scoreboard);
        scene.playerWinText.x = this.player.body.position.x;
        scene.playerWinText.y = this.player.body.position.y - 200;

        scene.gameOver = true;
    });

    this.add.image(500, 500, 'background');

    this.cameras.main.setBackgroundColor('#863b00');

    this.physics.world.setBounds(0, 0, worldWidth, worldHeight);

    score = 0;

    scoreText = this.add.text(16, 16, score, {fontSize: '32px', fill: '#000'});
    scoreText.setDepth(1);

    gameTimerText = this.add.text(500, 245, secToMinSec(this.gameTimer), {fontSize: '32px', fill: '#000'});
    gameTimerText.setDepth(1);

    challengeText = this.add.text(532, 600, '', {fontSize: '40px', fill: '#000', align: 'center'});
    challengeText.setDepth(1);

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
    if(!this.player || this.gameOver) {
        return;
    }

    if(cursors.left.isDown && !challengeActive) {
        this.player.setVelocityX(-playerSpeed);
    }
    else if(cursors.right.isDown && !challengeActive) {
        this.player.setVelocityX(playerSpeed);
    }
    else {
        this.player.setVelocityX(0);
    }

    if(cursors.up.isDown && !challengeActive) {
        this.player.setVelocityY(-playerSpeed);
    }
    else if(cursors.down.isDown && !challengeActive) {
        this.player.setVelocityY(playerSpeed);
    }
    else {
        this.player.setVelocityY(0);
    }

    if(Phaser.Input.Keyboard.JustDown(spacebar) && !challengeActive) {
        this.treasures.children.iterate((treasure) => {
            this.physics.world.overlap(this.player, treasure, startChallenge);
        });
    }

    if(challengeActive) {
        if(Phaser.Input.Keyboard.JustDown(letterKeys[currentChallengeTreasure.challenge[currentKeyIndex]])) {
            currentKeyIndex++;
            challengeText.setText(challengeText.text + " " + letters[currentChallengeTreasure.challenge[currentKeyIndex]]);

            if(currentKeyIndex >= currentChallengeTreasure.challenge.length) {
                collectTreasure(this, currentChallengeTreasure);
            }
        }
    }

    // this.gameTimer -= dt;
    // if(this.gameTimer < 0)
    // {
    //     this.gameTimer = 0;
    // }
    // gameTimerText.setText(secToMinSec(this.gameTimer));

    scoreText.x = this.player.body.position.x - 350;
    scoreText.y = this.player.body.position.y - 255;

    gameTimerText.x = this.player.body.position.x;
    gameTimerText.y = this.player.body.position.y - 255;

    challengeText.x = this.player.body.position.x + this.player.body.width / 2 - challengeText.displayWidth / 2;
    challengeText.y = this.player.body.position.y + 100;

    // if(score >= totalNumTreasures || this.gameTimer <= 0) {
    //     this.scene.restart();
    // }

    if(this.player.oldPosition && (this.player.body.position.x !== this.player.oldPosition.x || this.player.body.position.y !== this.player.oldPosition.y)) {
        this.socket.emit('playerMovement', {x: this.player.body.position.x, y: this.player.body.position.y});
    }

    this.player.oldPosition = {
        x: this.player.body.position.x,
        y: this.player.body.position.y,
    };
}

function collectTreasure(scene, treasure) {
    score++;
    scoreText.setText(score);

    challengeActive = false;
    challengeText.setText('');

    scene.socket.emit('treasureCollected', {x: treasure.x, y: treasure.y, challenge: treasure.challenge, _id: treasure._id});
    treasure.destroy();
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

function addPlayer(scene, playerInfo) {
    scene.player = scene.physics.add.sprite(playerInfo.x, playerInfo.y, 'player');

    scene.player.setBounce(0);
    scene.player.setCollideWorldBounds(true);

    scene.cameras.main.startFollow(scene.player);
}

function addOtherPlayer(scene, playerInfo) {
    const otherPlayer = scene.physics.add.sprite(playerInfo.x, playerInfo.y, 'amogus').setOrigin(0.25);
    otherPlayer.playerId = playerInfo.playerId;
    otherPlayer.setPosition(playerInfo.x, playerInfo.y);
    scene.otherPlayers.add(otherPlayer);
}

function addTreasure(scene, treasureData) {
    const newTreasure = scene.physics.add.sprite(treasureData.x, treasureData.y, 'treasure');
    newTreasure._id = treasureData._id;
    newTreasure.challenge = treasureData.challenge;
    scene.treasures.add(newTreasure);
}