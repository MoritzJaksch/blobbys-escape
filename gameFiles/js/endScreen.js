import Player from "./player.js";
import Endboss from "./endboss.js";
import Cutscene from "./cutscene.js";


export default class Endscene extends Phaser.Scene {
    constructor(scene){
        super({key: "endscene"});
    }

    create(){
        this.endMusic = this.sound.add('end');
        this.endMusic.play();


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


        this.endButton = this.add
            .text(140, 100, "YOU ESCAPED YOUR EVIL FATHER", {
                font: "30px monospace",
                fill: "#B57EDC",
            });

        this.endButton = this.add
            .text(200, 200, "(and probably killed him while you were at it...)", {
                font: "12px monospace",
                fill: "#B57EDC",
            });

        this.startButton = this.add
            .text(300, 300, "PLAY AGAIN", {
                font: "34px monospace",
                fill: "#B57EDC",
            })
            .setInteractive()
            .on('pointerdown', () =>{
                this.nextScene = true;
            } );


        this.enemies = this.physics.add.group({
            key: 'enemy',
        });
        
        this.enemies.children.entries[0].x = spawnPoint.x + 30;
        this.enemies.children.entries[0].y = spawnPoint.y;
        this.physics.world.addCollider(this.enemies, this.groundLayer);


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
            this.endMusic.pause();
            this.scene.start("startscene");
            this.scene.pause("endscene");
        }
    }
}
