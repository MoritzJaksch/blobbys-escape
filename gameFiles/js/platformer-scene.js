import Player from "./player.js";
import Endboss from "./endboss.js";


export default class PlatformerScene extends Phaser.Scene {
    constructor(){
        super({key: "levelOne"});
    }

    create() {
        this.spawnTimer = 0;
        this.grow = false;
        this.lastFired = 0;
        this.gravityReverse = false;
        this.gravityReversed = false;
        this.lastGravity = 0;


        const map = this.make.tilemap({ key: "map" });
        const tiles = map.addTilesetImage("BW-tiles-full", "tiles");

        this.waterGroup = this.physics.add.staticGroup();

        this.waterArea = map.createStaticLayer("Water", tiles);
        this.waterArea.forEachTile(tile => {
            if (tile.index != -1) {
                const x = tile.getCenterX();
                const y = tile.getCenterY();
                this.waterGroup.create(x, y);
            }
        });

        this.spikeGroup = this.physics.add.staticGroup();

        this.spikeArea = map.createStaticLayer("Spikes", tiles);
        this.spikeArea.forEachTile(tile => {
            if (tile.index != -1) {
                const x = tile.getCenterX();
                const y = tile.getCenterY();
                this.spikeGroup.create(x, y);
            }
        });



        map.createStaticLayer("BackgroundColor", tiles);
        map.createStaticLayer("Background", tiles);
        this.groundLayer = map.createStaticLayer("Playground", tiles);

        this.spawnPoint = map.findObject("spawnpoint", obj => obj.name === "Spawn");
        this.spawnPointBoss = map.findObject("spawnpoint", obj => obj.name === "BossSpawn");
        this.checkPoint = map.findObject("spawnpoint", obj => obj.name === "Checkpoint");
        this.checkPointTwo = map.findObject("spawnpoint", obj => obj.name === "Checkpoint_two");
        this.checkPointThree = map.findObject("spawnpoint", obj => obj.name === "Checkpoint_three");
        this.checkPointFour = map.findObject("spawnpoint", obj => obj.name === "Checkpoint_four");
        this.checkPointFive = map.findObject("spawnpoint", obj => obj.name === "Checkpoint_five");
        this.checkPointPassed = false;
        this.checkPointTwoPassed = false;
        this.checkPointThreePassed = false;
        this.checkPointFourPassed = false;
        this.checkPointFivePassed = false;
        let playerSpawnPointX;
        let playerSpawnPointY;
        if(localStorage.getItem("CP") == 1){
            this.checkPointPassed = true;
            playerSpawnPointX = this.checkPoint.x;
            playerSpawnPointY = this.checkPoint.y;
        } else if(localStorage.getItem("CP") == 2){
            playerSpawnPointX = this.checkPointTwo.x;
            playerSpawnPointY = this.checkPointTwo.y;

        } else if(localStorage.getItem("CP") == 3){
            playerSpawnPointX = this.checkPointThree.x;
            playerSpawnPointY = this.checkPointThree.y;
        } else if(localStorage.getItem("CP") == 4){
            playerSpawnPointX = this.checkPointFour.x;
            playerSpawnPointY = this.checkPointFour.y;
        } else {
            playerSpawnPointX = this.spawnPoint.x;
            playerSpawnPointY = this.spawnPoint.y;
        }

        this.player = new Player(this, playerSpawnPointX, playerSpawnPointY);
        this.endBoss = new Endboss(this, this.spawnPointBoss.x, this.spawnPointBoss.y);

        this.player.sprite.body.friction.x = 10;
        this.player.blobs.children.scaleX = 2;
        this.player.blobs.children.scaleY = 2;
        map.createStaticLayer("Foreground", tiles);




        // COLLECTIBLES //

        this.gravityCrystal = map.findObject("collectibles", obj => obj.name === "crystal");
        this.crystal = this.physics.add.group({
            key: 'collectibles',
            frame: 0,
            repeat: this.gravityCrystal.length
        });

        this.crystal.children.entries[0].x = this.gravityCrystal.x;
        this.crystal.children.entries[0].y = this.gravityCrystal.y - 10;
        this.crystal.children.entries[0].body.gravity.y = -995;
        this.crystal.children.entries[0].body.bounce.y = 1;

        console.log(this.crystal.children.entries);
        this.physics.world.addCollider(this.crystal.children.entries[0], this.groundLayer);

        this.crystalText = this.add.text(this.gravityCrystal.x - 100, this.gravityCrystal.y - 100, "", {
            font: "12px monospace",
            fill: "#ffffff",
        }).setScrollFactor(1);

        // COLLISION OF PLAYER WITH "MAP" //

        this.groundLayer.setCollisionByProperty({ collides: true });
        this.physics.world.addCollider(this.player.sprite, this.groundLayer);
        this.physics.world.addCollider(this.endBoss.sprite, this.groundLayer);

        // CAMERA SETTINGS //
        this.cameras.main.startFollow(this.player.sprite);
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);


        //SOUNDS//
        this.slime = this.sound.add("slime_5");


        //HELPTEXT; //
        this.score = 1000000;
        this.add
            .text(200, 16, "Arrow keys or WASD to move & jump", {
                font: "18px monospace",
                fill: "#ffffff",
            })
            .setScrollFactor(1);
        this.scoreText = this.add
            .text(600, 16, "Points: "+ this.score , {
                font: "18px monospace",
                fill: "#ffffff",
            })
            .setScrollFactor(0);

        this.checkPointFourText = this.add.text(this.checkPointFour.x - 50, this.checkPointFour.y -40, "", {
            font: "12px monospace",
            fill: "#ffffff",
        }).setScrollFactor(1);
        this.checkPointThreeText = this.add.text(this.checkPointThree.x - 50, this.checkPointThree.y -40, "", {
            font: "12px monospace",
            fill: "#ffffff",
        }).setScrollFactor(1);
        this.checkPointTwoText = this.add.text(this.checkPointTwo.x - 50, this.checkPointTwo.y - 40, "", {
            font: "12px monospace",
            fill: "#ffffff",
        }).setScrollFactor(1);
        this.checkPointText = this.add.text(this.checkPoint.x - 50, this.checkPoint.y -40, "", {
            font: "12px monospace",
            fill: "#ffffff",
        }).setScrollFactor(1);

        this.bossMusic = this.sound.add("bossfight");


        this.input.keyboard.on('keyup', function(e){if(e.key == "6"){
            if(!this.bossMusicPlaying){
                this.bossMusic.play();
                this.bossMusicPlaying = true;
            } else {
                this.bossMusic.pause();
                this.bossMusicPlaying = false;

            }

        }}, this);




        this.input.keyboard.on('keyup', function(e){if(e.key == "5"){
            this.growing();
            setTimeout(this.shrinking, 20);
            setTimeout(this.growing, 40);
            setTimeout(this.shrinking, 60);
            setTimeout(this.growing, 80);
        }}, this);


        this.input.keyboard.on('keyup', function(e){if(e.key == "1"){
            localStorage.setItem("CP", 1);
        }}, this);

        this.input.keyboard.on('keyup', function(e){if(e.key == "2"){
            localStorage.setItem("CP", 2);
        }}, this);

        this.input.keyboard.on('keyup', function(e){if(e.key == "3"){
            localStorage.setItem("CP", 3);
        }}, this);

        this.input.keyboard.on('keyup', function(e){if(e.key == "4"){
            localStorage.setItem("CP", 4);
        }}, this);

        this.input.keyboard.on('keyup', function(e){if(e.key == "5"){
            this.growing();
            setTimeout(this.shrinking, 20);
            setTimeout(this.growing, 40);
            setTimeout(this.shrinking, 60);
            setTimeout(this.growing, 80);
        }}, this);





        // ENEMIES //
        const enemySpawnPoint = map.filterObjects("enemiesSquare", obj => obj.name === "square");
        this.enemySpawnPointTwo = map.filterObjects("enemiesSquare", obj => obj.name === "square_one");
        this.enemySpawnPointThree = map.filterObjects("enemiesRound", obj => obj.name === "round_one");
        console.log("ENEMY SPAWN POINT TWO: ", this.enemySpawnPointTwo.length, this.enemySpawnPointTwo);

        this.enemies = this.physics.add.group({
            key: 'enemy',
            repeat: enemySpawnPoint.length -1
        });

        for (let i = 0; i < enemySpawnPoint.length; i++) {
            this.enemies.children.entries[i].x = enemySpawnPoint[i].x;
            this.enemies.children.entries[i].y = enemySpawnPoint[i].y;
        }

        this.enemies.children.iterate((child)=>{
            child.hitpoints = 3;
        });

        this.physics.world.addCollider(this.enemies, this.groundLayer);





        const enemySpawnPointRound = map.filterObjects("enemiesRound", obj => obj.name === "round");

        this.enemySpawnPointRoundTwo = map.filterObjects("enemiesRound", obj => obj.name === "round_one");


        this.enemiesRound = this.physics.add.group({
            key: 'enemy',
            frame: 6,
            repeat: enemySpawnPointRound.length -1,
        });

        for (var j = 0; j < enemySpawnPointRound.length; j++) {
            this.enemiesRound.children.entries[j].x = enemySpawnPointRound[j].x;
            this.enemiesRound.children.entries[j].y = enemySpawnPointRound[j].y;
        }
        this.enemiesRound.children.iterate((child)=>{
            child.hitpoints = 10;
        });
        this.enemyTwoSpawned = false;


        this.rocksSpawnPoint = map.filterObjects("rocks", obj => obj.name === "Rock");
        console.log("ROCKS SPAWNPOINT: ",this.rocksSpawnPoint);
        this.rocks = this.physics.add.group({
            key: "enemy",
            frame: 12,
            maxSize: 2
        });



        console.log("THIS.ENEMIES.Round GROUP: ", this.enemiesRound);


        this.physics.add.overlap(this.enemiesRound, this.player.sprite, this.hitRoundEnemy, null, this);

        this.physics.add.overlap(this.enemies, this.player.blobs, this.shootEnemy, null, this);

        this.physics.add.collider(this.player.sprite, this.enemies, this.hitEnemyChild, null, this);

        this.physics.add.overlap(this.player.sprite, this.crystal, this.collectCrystal, null, this);

        this.physics.add.collider(this.endBoss.blobs, this.groundLayer, this.bossBlobHit, null, this);
        this.physics.add.collider(this.endBoss.blobs, this.player.sprite, this.overlap, null, this);
        this.physics.add.collider(this.rocks, this.player.sprite, this.overlap, null, this);
        this.physics.add.collider(this.rocks, this.groundLayer, this.rockHit, null, this);
        this.physics.add.overlap(this.endBoss.sprite, this.player.blobs, this.shootEndboss, null, this);
        this.physics.add.collider(this.endBoss.sprite, this.player.sprite);




        this.hoverGravity = 0;
        this.jumpSound = this.sound.add("jump", {volume: 0.5});
        this.killSound = this.sound.add("kill");



        console.log("THIS PHYSICS: ", this.physics);
        console.log("THIS PLAYER: ", this.player);
        console.log("THIS ENDBOSS: ", this.endBoss);
        console.log("THIS CRYSTAL: ", this.crystal.children.entries[0]);




    }

    updateScore(timer){
        this.score = 1000000 - timer;
    }

    collectCrystal(){
        this.gravityReverse = true;
        this.crystal.children.entries[0].disableBody(true, true);
        this.crystalText.text = `you feel a strange power
coming from the crystal...

press Q to reverse gravity!`;

    }

    bossBlobHit(){
        console.log("HIT ENDBOSS BLOB");
        this.endBoss.blobs.children.iterate((child)=>{
            child.disableBody(true, true);
        });
    }

    rockHit(){
        this.rocks.children.iterate(child=>{
            child.destroy();
        });
    }

    shootEndboss(){
        this.player.blobs.children.iterate((child)=>{
            if(child.body.touching.left || child.body.touching.right){

                child.disableBody(true, true);
            }
        });
        this.endBoss.hitpoints --;
        console.log(this.endBoss.hitpoints);
        if(this.endBoss.hitpoints <= 0){
            this.endBoss.exists = false;
            this.endBoss.sprite.body.active = false;
            this.endBoss.sprite.anims.stop();
            this.endBoss.sprite.body.height = 35;

            this.endBoss.sprite.setTexture("bodies", 0);

        }
    }

    shootEnemy(){
        // console.log("HITPOINTS: ", this.enemies);
        this.player.blobs.children.iterate((child)=>{
            if(child.body.touching.left || child.body.touching.right){

                child.disableBody(true, true);
            }

        });

        this.enemies.children.iterate((child)=>{
            if(child.body.touching.left || child.body.touching.right){
                console.log("CHILD: ",child);
                child.hitpoints --;
                if(child.hitpoints <= 0){
                    child.destroy();
                }
            }

        });
    }

    hitRoundEnemy(){
        this.overlap(this.player.sprite);
    }

    hitEnemyChild(){
        console.log("THIS ENEMY: ",this.enemies);

        this.enemies.children.iterate((child)=>{
            if (child.body.touching.up) {
                this.player.sprite.body.velocity.y = -200;
                this.killSound.play();
                // child.exists = false;

                this.overlap(child);
                console.log("enemy child hit", child);
            }
            if (child.body.touching.left || child.body.touching.right) {
                console.log("PLAYER HIT!!!!");
                if(this.grow){
                    this.player.sprite.scaleX = 1;
                    this.player.sprite.scaleY = 1;
                    this.overlap(child);
                } else {
                    this.overlap(this.player.sprite);
                }
            }

        });}
    beGone() {
        this.bullet.disableBody(true, true);

    }


    growing(){
        this.grow = true;
        this.player.sprite.scaleX = 2;
        this.player.sprite.scaleY = 2;
    }
    shrinking(){
        this.grow = false;
        this.player.sprite.scaleX = 1;
        this.player.sprite.scaleY = 1;
    }
    overlap(entity){
        entity.body.checkCollision.down = false;
        entity.body.checkCollision.left = false;
        entity.body.checkCollision.right = false;
        entity.body.checkCollision.up = false;
        entity.body.velocity.x = 0;
        entity.body.velocity.y = 200;
        entity.setFlipY(true);
    }



    update(time, delta) {
        this.player.update(time, delta);
        this.endBoss.update(time, delta);

        if(this.player.sprite.anims.currentAnim){
            let that = this;
            this.player.sprite.on('animationrepeat', function () {

                if(that.player.sprite.anims.currentAnim.key == "player-run") {
                    that.jumpSound.play();
                }
            });}





        if(this.physics.world.overlap(this.player.sprite, this.waterGroup)){

            this.player.sprite.body.gravity.y = -2000;
        } else {
            this.player.sprite.body.gravity.y = 0;
        }

        if(this.physics.world.overlap(this.player.sprite, this.spikeGroup)){
            this.overlap(this.player.sprite);
        }


        this.enemies.children.iterate((child)=>{
            if(child.body.x > this.player.sprite.x){
                child.body.setAccelerationX(Phaser.Math.Between(-10, -30));
                child.setFlipX(true);
            }else{
                child.body.setAccelerationX(Phaser.Math.Between(10, 30));
                child.setFlipX(false);
            }
            child.anims.play("enemy-idle", true);

        });

        //CHECKPOINT AND NEW ENEMY SPAWN///

        // FIRST CHECKPOINT //
        if(this.player.sprite.body.x > this.checkPoint.x && !this.checkPointPassed){
            this.checkPointPassed = true;
            localStorage.setItem("CP", 1);
            localStorage.setItem("x", this.checkPoint.x);
            localStorage.setItem('y', this.checkPoint.y);
            this.checkPointText.text = "checkpoint <3";
            console.log("CHECKPOINT PASSED!");

        }
        if(this.player.sprite.body.x > this.checkPoint.x && !this.enemyTwoSpawned){
            for (var i = 0; i < this.enemySpawnPointTwo.length; i++) {
                this.enemies.create(this.enemySpawnPointTwo[i].x, this.enemySpawnPointTwo[i].y, 'enemy');
            }
            this.enemyTwoSpawned = true;
        }

        // SECOND CHECKPOINT //
        if(this.player.sprite.body.x > this.checkPointTwo.x && !this.checkPointTwoPassed){
            this.checkPointTwoPassed = true;
            localStorage.setItem("CP", 2);
            localStorage.setItem("x", this.checkPointTwo.x);
            localStorage.setItem('y', this.checkPointTwo.y);
            this.checkPointTwoText.text = "checkpoint <3";

            console.log("CHECKPOINT TWO PASSED!");

        }

        if(this.player.sprite.body.x > this.checkPointThree.x && !this.checkPointThreePassed){
            this.checkPointThreePassed = true;
            localStorage.setItem("CP", 3);
            localStorage.setItem("x", this.checkPointThree.x);
            localStorage.setItem('y', this.checkPointThree.y);
            this.checkPointThreeText.text = "checkpoint <3";

            console.log("CHECKPOINT TWO PASSED!");

        }

        if(this.player.sprite.body.x > this.checkPointFour.x && !this.checkPointFourPassed){
            this.checkPointFourPassed = true;
            localStorage.setItem("CP", 4);
            localStorage.setItem("x", this.checkPointFour.x);
            localStorage.setItem('y', this.checkPointFour.y);
            this.checkPointFourText.text = "The power of the crystal has depleted...";

            console.log("CHECKPOINT TWO PASSED!");

        }

        if(this.player.sprite.body.x > this.checkPointFive.x && this.player.sprite.body.y < this.checkPointFive.y){
            this.checkPointFivePassed = true;
            localStorage.setItem("CP", 0);
            localStorage.setItem("x", this.checkPoint.x);
            localStorage.setItem('y', this.checkPoint.y);
            this.scene.pause("levelOne");
            this.scene.start("endscene");

            console.log("CHECKPOINT TWO PASSED!");

        }


        if(this.player.sprite.body.x > this.checkPointTwo.x && this.player.sprite.body.x < this.checkPointTwo.x + 300 && time > this.spawnTimer){
            console.log("ENEMY CREATED!");
            for (var k = 0; k < this.enemySpawnPointThree.length; k++) {
                this.enemiesRound.create(this.enemySpawnPointThree[k].x, this.enemySpawnPointThree[k].y, 'enemy');
            }
            console.log("ENEMIES IN CHECKPOINT TWO: ", this.enemiesRound, "ENEMY SPAWNPOINT THREE: ", this.enemySpawnPointThree);
            this.spawnTimer = time + 3500;
        }



        if (this.player.sprite.y > this.groundLayer.height) {
            this.bossMusicPlaying = false;
            this.bossMusic.pause();
            this.player.destroy();
            this.scene.restart();
        }



        this.physics.world.collide(this.enemiesRound, this.groundLayer, ()=>{
            this.enemiesRound.children.iterate((child=>{
                if(child.body.blocked.right){
                    child.flipX = true;
                }
                if(child.body.blocked.left){
                    child.flipX = false;
                }


                child.body.velocity.x = Phaser.Math.Between(50, 80)*(child.flipX ? -1 : 1);
                child.anims.play("enemy-round-idle", true);
            }));

        }, null, this);

        this.enemiesRound.children.iterate(child=>{
            if (child.y > this.groundLayer.height) {
                child.destroy();
                console.log("ROUND CHILD DESTROYED!!");
            }
        });

        this.enemies.children.iterate(child=>{
            if (child.y > this.groundLayer.height) {
                child.destroy();
                console.log("SQUARE CHILD DESTROYED!!");
            }
        });




        // ENDBOSS STUFF //

        if (this.endBoss.sprite.body.touching.up && this.player.sprite.body.touching.down) {
            this.player.sprite.body.velocity.y = -2000;
            this.player.sprite.body.gravity.y = -500;
        }

        if(!this.endBoss.onGround){
            setTimeout(()=>{
                for (let i = 0; i < this.rocksSpawnPoint.length; i++) {
                    this.rocks.create(this.rocksSpawnPoint[i].x, this.rocksSpawnPoint[i].y, 'enemy', 12);
                }
            }, 1200);
        }

        this.score = 1000000 - time;
        this.scoreText.text = "Points: "+ this.score;

        if (this.player.keys.q.isDown){
            this.player.sprite.body.gravity.y = -2000;
            this.lastGravity = time + 100;
        }

    }
}
