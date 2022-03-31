const Phaser = require('phaser');

const gameWidth = 800;
const gameHeight = 600;

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

const playerSpeed = 270;

let player;
let treasures;
let cursors;
let spacebar;
let game = new Phaser.Game(config);

function preload() {
    this.load.setBaseURL('');

    this.load.image('background', '/assets/img/background.png');
    this.load.image('player', '/assets/img/player.png');
    this.load.image('treasure', '/assets/img/treasure.png');
}

function create() {
    this.add.image(400, 300, 'background');
    player = this.physics.add.sprite(400, 300, 'player');

    player.setBounce(0);
    player.setCollideWorldBounds(true);
    
    cursors = this.input.keyboard.createCursorKeys();

    treasures = this.physics.add.group({
        key: 'treasure',
        repeat: 8

    });

    treasures.children.iterate((treasure) => {
        treasure.x = Phaser.Math.Between(0, this.game.config.width - treasure.displayWidth / 2);
        treasure.y = Phaser.Math.Between(0, this.game.config.height - treasure.displayHeight / 2);
    });

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
}

function collectTreasure(player, treasure) {
    treasure.disableBody(true, true);
}