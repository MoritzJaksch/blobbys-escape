import Player from "./player.js";
import Endboss from "./endboss.js";
import Cutscene from "./cutscene.js";


export default class Startscene extends Phaser.Scene {
    constructor(scene){
        super({key: "startscene"});
    }

    preload() {

        // SOUNDS //
        this.load.audio('cutscene', '../assets/sounds/cutscene.mp3', {
            instances: 1
        });

        this.load.audio('jump', '../assets/sounds/jump.wav', {
            instances: 1
        });

        this.load.audio('kill', '../assets/sounds/kill.wav', {
            instances: 1
        });

        this.load.audio('start', '../assets/sounds/start.mp3', {
            instances: 1
        });

        this.load.audio('end', '../assets/sounds/end.mp3', {
            instances: 1
        });

        this.load.audio('bossfight', '../assets/sounds/bossfight.mp3', {
            instances: 1
        });


        this.load.spritesheet(
            "player",
            "../assets/spritesheets/blobby.png",
            {
                frameWidth: 24,
                frameHeight: 20,
                margin: 0,
                spacing: 0
            }
        );

        this.load.spritesheet(
            "endBoss",
            "../assets/spritesheets/endBoss.png",
            {
                frameWidth: 50,
                frameHeight: 60,
                margin: 0,
                spacing: 0
            }
        );

        this.load.spritesheet(
            "bodies",
            "../assets/spritesheets/bodies.png",
            {
                frameWidth: 50,
                frameHeight: 35,
                margin: 0,
                spacing: 0
            }
        );

        this.load.spritesheet(
            "enemy",
            "../assets/spritesheets/enemy.png",
            {
                frameWidth: 24,
                frameHeight: 20,
                margin: 0,
                spacing: 0
            }
        );

        this.load.spritesheet(
            "shot",
            "../assets/spritesheets/shots.png",
            {
                frameWidth: 12,
                frameHeight: 8,
                margin: 0,
                spacing: 0
            });

        this.load.spritesheet(
            "collectibles",
            "../assets/spritesheets/collectibles.png",
            {
                frameWidth: 24,
                frameHeight: 30,
                margin: 0,
                spacing: 0
            }
        );
        this.load.image("tiles", "../assets/tilesets/BW-tiles-full.png");
        this.load.tilemapTiledJSON("map", "../assets/tilemaps/level-full.json");
        this.load.tilemapTiledJSON("cutscene", "../assets/tilemaps/cutscene.json");
        this.load.tilemapTiledJSON("startscene", "../assets/tilemaps/startscene.json");
    }

    create(){
        const anims = this.anims;
        this.music = this.sound.add('start');

        anims.create({
            key: "boss-idle",
            frames: anims.generateFrameNumbers("endBoss", { start: 0, end: 1 }),
            frameRate: 3,
            repeat: -1
        });
        anims.create({
            key: "boss-jump",
            frames: anims.generateFrameNumbers("endBoss", { start: 5, end: 8 }),
            frameRate: 6,
        });

        anims.create({
            key: "player-idle",
            frames: anims.generateFrameNumbers("player", { start: 0, end: 1 }),
            frameRate: 2,
            repeat: -1
        });
        anims.create({
            key: "player-run",
            frames: anims.generateFrameNumbers("player", { start: 0, end: 5 }),
            frameRate: 20,
            repeat: -1
        });
        anims.create({
            key: "player-shoot",
            frames: anims.generateFrameNumbers("player", 6),
            frameRate: 1,
            repeat: -1
        });

        anims.create({
            key: "enemy-idle",
            frames: anims.generateFrameNumbers("enemy", { start: 0, end: 2 }),
            frameRate: 3,
            repeat: -1
        });

        anims.create({
            key: "enemy-round-idle",
            frames: anims.generateFrameNumbers("enemy", { start: 6, end: 9 }),
            frameRate: 8,
            repeat: -1
        });

        const map = this.make.tilemap({ key: "startscene" });
        const tiles = map.addTilesetImage("BW-tiles-full", "tiles");

        map.createStaticLayer("Background", tiles);
        const spawnPoint = map.findObject("spawnpoint", obj => obj.name === "Spawn");

        this.player = new Player(this, spawnPoint.x, spawnPoint.y);
        this.king = new Endboss(this, spawnPoint.x, spawnPoint.y);

        this.groundLayer = map.createStaticLayer("Playground", tiles);
        this.groundLayer.setCollisionByProperty({ collides: true });
        this.physics.world.addCollider(this.player.sprite, this.groundLayer);
        this.physics.world.addCollider(this.king.sprite, this.groundLayer);



        this.startPointX = spawnPoint.x;
        this.startPointY = spawnPoint.y;

        this.nextScene = false;
        this.scene.stop("firstCutscene");


        this.startButton = this.add
            .text(200, 50, `PRINCE BLOBBY'S ESCAPE
 FROM THE BLOB KINGDOM`, {
                font: "34px monospace",
                fill: "#B57EDC",
            });

        this.startButton = this.add
            .text(300, 200, "START GAME", {
                font: "34px monospace",
                fill: "#B57EDC",
            })
            .setInteractive()
            .on('pointerdown', () =>{
                this.nextScene = true;
            } );

        console.log(this.player);
        console.log(this.player.sprite.body.x);

        this.enemies = this.physics.add.group({
            key: 'enemy',
        });
        this.enemies.children.entries[0].x = spawnPoint.x + 30;
        this.enemies.children.entries[0].y = spawnPoint.y;
        this.physics.world.addCollider(this.enemies, this.groundLayer);

        this.music.play();


    }

    update(time, delta){

        this.player.sprite.anims.play("player-run", true);
        this.player.sprite.body.velocity.x = -100;
        this.player.sprite.setFlipX(true);

        this.enemies.children.entries[0].anims.play("enemy-idle", true);
        this.enemies.children.entries[0].body.velocity.x = -80;
        this.enemies.children.entries[0].setFlipX(true);

        if(this.player.sprite.body.x < 0) {
            this.player.sprite.body.x = this.startPointX;
        }


        if(this.nextScene){
            this.music.pause();
            this.scene.start("firstCutscene");
            this.scene.pause("startscene");
        }
    }
}
