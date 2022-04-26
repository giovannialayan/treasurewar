//const Phaser = require('phaser');

const gameWidth = 800;
const gameHeight = 600;

let worldWidth = 1000;
let worldHeight = 1000;

let config = {
    type: Phaser.AUTO,
    parent: 'game',
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
const letters = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Z', 'X', 'C', 'V', 'B', 'N', 'M'];

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
let game;
let roomId;
let hardMode = false;
let leaveButton;
let skin;
let name;
let mapSize;

const startGame = (room, hard, size, worldDims, skinChroma, username) => {
    roomId = room
    hardMode = hard;
    worldWidth = worldDims.width;
    worldHeight = worldDims.height;
    mapSize = size;
    skin = skinChroma;
    name = username;
    game = new Phaser.Game(config);
    leaveButton = document.querySelector('#leaveRoomButton');
};

function preload() {
    this.load.setBaseURL('');

    this.load.image('background', `/assets/img/background_${mapSize}.png`);
    this.load.image('treasure', '/assets/img/treasure-mound.png');

    this.load.image('J1m_white',  '/assets/img/robot/robot_white.png');
    this.load.image('J1m_red',    '/assets/img/robot/robot_red.png');
    this.load.image('J1m_blue',   '/assets/img/robot/robot_blue.png');
    this.load.image('J1m_yellow', '/assets/img/robot/robot_yellow.png');
    this.load.image('J1m_green',  '/assets/img/robot/robot_green.png');
    this.load.image('J1m_pink',   '/assets/img/robot/robot_pink.png');
    this.load.image('J1m_purple', '/assets/img/robot/robot_purple.png');
    this.load.image('J1m_orange', '/assets/img/robot/robot_orange.png');

    this.load.image('K3vin_white',  '/assets/img/robot2/robot2_white.png');
    this.load.image('K3vin_red',    '/assets/img/robot2/robot2_red.png');
    this.load.image('K3vin_blue',   '/assets/img/robot2/robot2_blue.png');
    this.load.image('K3vin_yellow', '/assets/img/robot2/robot2_yellow.png');
    this.load.image('K3vin_green',  '/assets/img/robot2/robot2_green.png');
    this.load.image('K3vin_pink',   '/assets/img/robot2/robot2_pink.png');
    this.load.image('K3vin_purple', '/assets/img/robot2/robot2_purple.png');
    this.load.image('K3vin_orange', '/assets/img/robot2/robot2_orange.png');
    
    this.load.image('C4rla_white',  '/assets/img/robot3/robot3_white.png');
    this.load.image('C4rla_red',    '/assets/img/robot3/robot3_red.png');
    this.load.image('C4rla_blue',   '/assets/img/robot3/robot3_blue.png');
    this.load.image('C4rla_yellow', '/assets/img/robot3/robot3_yellow.png');
    this.load.image('C4rla_green',  '/assets/img/robot3/robot3_green.png');
    this.load.image('C4rla_pink',   '/assets/img/robot3/robot3_pink.png');
    this.load.image('C4rla_purple', '/assets/img/robot3/robot3_purple.png');
    this.load.image('C4rla_orange', '/assets/img/robot3/robot3_orange.png');

    this.load.image('B3th_white',  '/assets/img/robot4/robot4_white.png');
    this.load.image('B3th_red',    '/assets/img/robot4/robot4_red.png');
    this.load.image('B3th_blue',   '/assets/img/robot4/robot4_blue.png');
    this.load.image('B3th_yellow', '/assets/img/robot4/robot4_yellow.png');
    this.load.image('B3th_green',  '/assets/img/robot4/robot4_green.png');
    this.load.image('B3th_pink',   '/assets/img/robot4/robot4_pink.png');
    this.load.image('B3th_purple', '/assets/img/robot4/robot4_purple.png');
    this.load.image('B3th_orange', '/assets/img/robot4/robot4_orange.png');

    this.load.image('S0nny_white',  '/assets/img/robot5/robot5_white.png');
    this.load.image('S0nny_red',    '/assets/img/robot5/robot5_red.png');
    this.load.image('S0nny_blue',   '/assets/img/robot5/robot5_blue.png');
    this.load.image('S0nny_yellow', '/assets/img/robot5/robot5_yellow.png');
    this.load.image('S0nny_green',  '/assets/img/robot5/robot5_green.png');
    this.load.image('S0nny_pink',   '/assets/img/robot5/robot5_pink.png');
    this.load.image('S0nny_purple', '/assets/img/robot5/robot5_purple.png');
    this.load.image('S0nny_orange', '/assets/img/robot5/robot5_orange.png');

    this.load.image('5u5bot_white',  '/assets/img/susbot/susbot_white.png');
    this.load.image('5u5bot_red',    '/assets/img/susbot/susbot_red.png');
    this.load.image('5u5bot_blue',   '/assets/img/susbot/susbot_blue.png');
    this.load.image('5u5bot_yellow', '/assets/img/susbot/susbot_yellow.png');
    this.load.image('5u5bot_green',  '/assets/img/susbot/susbot_green.png');
    this.load.image('5u5bot_pink',   '/assets/img/susbot/susbot_pink.png');
    this.load.image('5u5bot_purple', '/assets/img/susbot/susbot_purple.png');
    this.load.image('5u5bot_orange', '/assets/img/susbot/susbot_orange.png');

    this.load.image('Pr1ck_white',  '/assets/img/cactus/cactus_white.png');
    this.load.image('Pr1ck_red',    '/assets/img/cactus/cactus_red.png');
    this.load.image('Pr1ck_blue',   '/assets/img/cactus/cactus_blue.png');
    this.load.image('Pr1ck_yellow', '/assets/img/cactus/cactus_yellow.png');
    this.load.image('Pr1ck_green',  '/assets/img/cactus/cactus_green.png');
    this.load.image('Pr1ck_pink',   '/assets/img/cactus/cactus_pink.png');
    this.load.image('Pr1ck_purple', '/assets/img/cactus/cactus_purple.png');
    this.load.image('Pr1ck_orange', '/assets/img/cactus/cactus_orange.png');

    this.load.image('P3nny_white',  '/assets/img/penguin/penguin_white.png');
    this.load.image('P3nny_red',    '/assets/img/penguin/penguin_red.png');
    this.load.image('P3nny_blue',   '/assets/img/penguin/penguin_blue.png');
    this.load.image('P3nny_yellow', '/assets/img/penguin/penguin_yellow.png');
    this.load.image('P3nny_green',  '/assets/img/penguin/penguin_green.png');
    this.load.image('P3nny_pink',   '/assets/img/penguin/penguin_pink.png');
    this.load.image('P3nny_purple', '/assets/img/penguin/penguin_purple.png');
    this.load.image('P3nny_orange', '/assets/img/penguin/penguin_orange.png');
}

function create() {
    const scene = this;
    this.socket = io(`/?room=${roomId}&skin=${skin}&name=${name}`, {autoConnect: false});
    this.socket.open();

    leaveButton.addEventListener('click', () => {leaveGame(scene);});
    leaveButton.classList.remove('hidden');

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
                otherPlayer.flipX = playerInfo.flip;
            }
        });
    });

    this.gameTimer = 0;

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

    this.playerWinText = this.add.text(0, 0, '', {fontSize: '32px', fill: '#000', align: 'center', fontFamily: 'Dosis, Arial, sans-serif'});
    this.playerWinText.setDepth(1);
    this.gameOver = false;

    this.socket.on('playerWon', (players) => {
        //console.log(players);
        let scoreboard = '';
        players.forEach((player) => {
            scoreboard += `${player.name}: ${player.score}\n`;
        });
        scene.playerWinText.setText(scoreboard);
        scene.playerWinText.x = this.player.body.position.x - scene.playerWinText.width / 2;
        scene.playerWinText.y = this.player.body.position.y - 200;

        scene.gameOver = true;
    });

    this.gameStarted = false;

    this.socket.on('startGame', (start) => {
        this.gameStarted = start;
    });

    this.add.image(worldWidth / 2, worldHeight / 2, 'background');

    this.cameras.main.setBackgroundColor('#863b00');

    this.physics.world.setBounds(0, 0, worldWidth, worldHeight);

    score = 0;

    scoreText = this.add.text(worldWidth / (20 / 3), worldHeight / 4.0816, score, {fontSize: '32px', fill: '#000', fontFamily: 'Dosis, Arial, sans-serif'});
    scoreText.setDepth(1);

    gameTimerText = this.add.text(worldWidth / 2, worldHeight / 4.0816, secToMinSec(this.gameTimer), {fontSize: '32px', fill: '#000', fontFamily: 'Dosis, Arial, sans-serif'});
    gameTimerText.setDepth(1);

    challengeText = this.add.text(worldWidth / 1.8796, worldHeight / (5 / 3), '', {fontSize: '40px', fill: '#000', align: 'center', fontFamily: 'Dosis, Arial, sans-serif'});
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
    if(!this.player || this.gameOver || !this.gameStarted) {
        return;
    }

    if(cursors.left.isDown && !challengeActive) {
        this.player.setVelocityX(-playerSpeed);
        this.player.flipX = true;
    }
    else if(cursors.right.isDown && !challengeActive) {
        this.player.setVelocityX(playerSpeed);
        this.player.flipX = false;
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

    if(Phaser.Input.Keyboard.JustDown(spacebar)) {
        if(challengeActive) {
            challengeActive = false;
            challengeText.setText('');
        }
        else {
            this.treasures.children.iterate((treasure) => {
                this.physics.world.overlap(this.player, treasure, startChallenge);
            });
        }
    }

    if(challengeActive) {
        if(Phaser.Input.Keyboard.JustDown(letterKeys[currentChallengeTreasure.challenge[currentKeyIndex]])) {
            currentKeyIndex++;
            challengeText.setText(challengeText.text + " " + letters[currentChallengeTreasure.challenge[currentKeyIndex]]);

            if(currentKeyIndex >= currentChallengeTreasure.challenge.length) {
                collectTreasure(this, currentChallengeTreasure);
            }
        }
        else if(hardMode) {
            let otherLetterPressed = false;
            for(let i = 0; i < letterKeys.length; i++) {
                otherLetterPressed = otherLetterPressed ? otherLetterPressed : Phaser.Input.Keyboard.JustDown(letterKeys[i]);
            }

            if(otherLetterPressed) {
                challengeActive = false;
                challengeText.setText('');
            }
        }
    }

    scoreText.x = this.player.body.position.x - 350;
    scoreText.y = this.player.body.position.y - 255;

    gameTimerText.x = this.player.body.position.x;
    gameTimerText.y = this.player.body.position.y - 255;

    challengeText.x = this.player.body.position.x + this.player.body.width / 2 - challengeText.displayWidth / 2;
    challengeText.y = this.player.body.position.y + 100;

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
    scene.player = scene.physics.add.sprite(playerInfo.x, playerInfo.y, playerInfo.skin);

    scene.player.setBounce(0);
    scene.player.setCollideWorldBounds(true);

    scene.cameras.main.startFollow(scene.player);
}

function addOtherPlayer(scene, playerInfo) {
    const otherPlayer = scene.physics.add.sprite(playerInfo.x, playerInfo.y, playerInfo.skin).setOrigin(0.25);
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

const leaveGame = (scene) => {
    scene.socket.disconnect();
    leaveButton.classList.add('hidden');
    game.destroy(true, false);
    document.querySelector('#gameSetup').classList.remove('hidden');
    document.querySelector('#roomList').classList.remove('hidden');
};

export {startGame};