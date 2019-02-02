import Player from "./player.js";
import Endboss from "./endboss.js";


export default class Cutscene extends Phaser.Scene {
    constructor(scene){
        super({key: "firstCutscene"});
    }

    create(){
        this.jumpSound = this.sound.add("jump");
        this.backGroundMusic = this.sound.add("cutscene");
        this.backGroundMusic.play();
        const map = this.make.tilemap({ key: "cutscene" });
        const tiles = map.addTilesetImage("BW-tiles-full", "tiles");

        map.createStaticLayer("BackgroundColor", tiles);
        this.groundLayer = map.createStaticLayer("Playground", tiles);


        const spawnPoint = map.findObject("spawnpoints", obj => obj.name === "spawnBlobby");
        const spawnPointReal = map.findObject("spawnpoints", obj => obj.name === "spawnBlobbyReal");
        const spawnPointKing = map.findObject("spawnpoints", obj => obj.name === "spawnKing");
        this.player = new Player(this, spawnPointReal.x, spawnPointReal.y);

        this.king = new Endboss(this, spawnPointKing.x, spawnPointKing.y);
        this.groundLayer.setCollisionByProperty({ collides: true });
        this.physics.world.addCollider(this.player.sprite, this.groundLayer);
        this.physics.world.addCollider(this.king.sprite, this.groundLayer);
        this.king.sprite.setFlipX(false);
        this.player.sprite.setFlipX(false);
        map.createStaticLayer("Background", tiles);

        console.log(this.scene);

        this.blobbyText = this.add
            .text(spawnPoint.x - 50, spawnPoint.y - 50, "", {
                font: "24px monospace",
                fill: "#B57EDC",
            })
            .setScrollFactor(1);

        this.kingText = this.add
            .text(spawnPointKing.x - 50, spawnPointKing.y -100, "", {
                font: "24px monospace",
                fill: "#FF6347",
            })
            .setScrollFactor(1);


        this.nextScene = false;
        this.playerMove = false;
        this.playerIdle = true;
        this.playerShout = false;
        this.kingShout = false;
        this.kingIdle = true;
        this.newTime = 1;
        setInterval(() => {
            this.newTime++;
        }, 1000);
        console.log(this.player.sprite.anims);
    }

    update(time, delta){


        if(this.player.sprite.anims.currentAnim){
            let that = this;
            this.player.sprite.on('animationrepeat', function () {

                if(that.player.sprite.anims.currentAnim.key == "player-run") {
                    that.jumpSound.play();
                }
            });}


        if(this.playerMove){
            this.player.sprite.anims.play("player-run", true);
        }

        if(this.playerIdle){
            this.player.sprite.anims.play("player-idle", true);
        }

        if(this.playerShout){
            this.player.sprite.setTexture("player", 6);
        }

        if(this.kingShout){
            this.king.sprite.anims.play("boss-jump", true);
        }
        if(this.kingIdle){
            this.king.sprite.anims.play("boss-idle", true);
        }
        if(this.newTime){
            this.playerIdle = false;
            this.playerMove = true;
            this.player.sprite.body.velocity.x = 100;
        }
        if(this.newTime > 3){
            this.playerIdle = true;
            this.playerMove = false;
            this.player.sprite.body.velocity.x = 0;
            this.player.sprite.setFlipX(true);

            this.blobbyText.text = "FATHER!";
            this.king.sprite.setFlipX(true);
        }

        if(this.newTime > 5){
            this.kingText.text = "Blobby! ...my least favourite son...";
        }

        if(this.newTime > 8){
            this.king.sprite.setFlipX(false);
            this.king.sprite.body.velocity.x = -30;
            this.kingText.text = "...";
            this.blobbyText.text = "YOU ATE MOTHER! FOR DINNER!!!!";
            this.playerIdle = false;
            this.playerShout = true;
        }

        if(this.newTime > 10){
            this.king.sprite.body.velocity.x = 0;
            this.playerIdle = true;
            this.playerShout = false;
        }

        if(this.newTime > 11){
            this.king.sprite.setFlipX(true);
            this.blobbyText.text = "I CAN NOT FORGIVE THAT!";
            this.player.sprite.body.velocity.x = -40;
            this.playerIdle = false;
            this.playerMove = true;
        }

        if(this.newTime > 13){
            this.player.sprite.body.velocity.x = 0;
            this.playerIdle = true;
            this.playerMove = false;
        }

        if(this.newTime > 14){
            this.blobbyText.text = `I WILL LEAVE BLOB KINGDOM
AND NEVER RETURN!!`;
            this.playerIdle = false;
            this.playerShout = true;
        }

        if(this.newTime > 15){
            this.playerShout = false;
            this.playerMove = true;
            this.player.sprite.setFlipX(false);
            this.player.sprite.body.velocity.x = 40;
        }

        if(this.newTime > 17){
            this.playerIdle = true;
            this.playerMove = false;
            this.player.sprite.body.velocity.x = 0;
            this.kingIdle = false;
            this.kingShout = true;
            this.kingText.text = "YOU WILL DO NO SUCH THING!";
            this.blobbyText.text = "";
        }

        if(this.newTime > 18){
            this.blobbyText.text = "try and stop me... I DARE YOU!";
        }

        if(this.newTime > 19){
            this.player.sprite.setFlipX(true);
            this.playerIdle = false;
            this.playerShout = true;
        }

        if(this.newTime > 20){
            this.playerShout = false;
            this.playerIdle = true;
            this.kingText.text = "!!!";
        }

        if(this.newTime > 21){
            this.playerIdle = false;
            this.playerMove = true;
            this.player.sprite.setFlipX(false);
            this.player.sprite.body.velocity.x = 100;
            this.kingText.text = "!!!!!!";
            this.blobbyText.text = "";

        }
        if(this.newTime > 23){
            this.kingShout = false;
            this.kingIdle = true;
            this.kingText.text = "...";

        }

        if(this.newTime > 24){
            this.playerMove = false;
            this.playerIdle = true;


            this.kingText.text = "Oh, believe me...";
        }

        if(this.newTime > 25){
            this.king.sprite.setFlipX(false);
            this.kingText.text = "I will!!";
        }

        if(this.newTime > 26){
            this.king.sprite.body.velocity.x = -50;
        }

        if(this.king.sprite.body.y > 640){
            this.nextScene = true;
        }

        if(this.nextScene){
            this.backGroundMusic.pause();
            this.scene.start("levelOne");
            this.scene.pause("cutscene");
        }

    }
}
