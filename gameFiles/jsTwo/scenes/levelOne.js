import Player from "../player.js";
import Enemy from "../enemy.js";

/**
 * A class that extends Phaser.Scene and wraps up the core logic for the platformer level.
 */
export default class LevelOne extends Phaser.Scene {
    constructor(){
        super({key: "levelOne"});
    }




    create() {
        console.log("Level One created");

        this.lastFired = 0;

        const map = this.make.tilemap({ key: "map" });
        const tiles = map.addTilesetImage("BW-tiles-2", "tiles");

        map.createStaticLayer("BackgroundColor", tiles);
        map.createStaticLayer("Background", tiles);
        this.groundLayer = map.createStaticLayer("Playground", tiles);

        // Instantiate a player instance at the location of the "Spawn Point" object in the Tiled map.
        // Note: instead of storing the player in a global variable, it's stored as a property of the
        // scene.
        const spawnPoint = map.findObject("spawnpoint", obj => obj.name === "Spawn");
        this.player = new Player(this, spawnPoint.x, spawnPoint.y);
        this.enemy = new Enemy(this, spawnPoint.x + 100, spawnPoint.y);

        map.createStaticLayer("Foreground", tiles);





        // COLLISION OF PLAYER WITH "MAP" //
        this.groundLayer.setCollisionByProperty({ collides: true });
        this.physics.world.addCollider(this.player.sprite, this.groundLayer);
        this.physics.world.addCollider(this.enemy.sprite, this.groundLayer);




        // CAMERA SETTINGS //
        this.cameras.main.startFollow(this.player.sprite);
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);




        // HELPTEXT //
        this.add
            .text(16, 16, "Arrow keys or WASD to move & jump", {
                font: "18px monospace",
                fill: "#000000",
                padding: { x: 20, y: 10 },
                backgroundColor: "#ffffff"
            })
            .setScrollFactor(0);



        // ENEMIES //
        this.bullets = this.physics.add.group();

        this.physics.add.overlap(this.enemy.sprite, this.bullets, shootEnemy, null, this);

        this.physics.add.overlap(this.player.sprite, this.enemy.sprite, hitEnemy, null, this);



        function shootEnemy(){
            this.bullet.disableBody(true, true);
            this.enemy.hitpoints --;
            if(this.enemy.hitpoints == 0){
                this.enemy.sprite.disableBody(true,true);
            }
        }

        function hitEnemy(){
            this.physics.pause();

            this.player.sprite.setTint(0xff0000);

            this.player.destroy();

            this.scene.restart();
        }
    }

    beGone() {
        this.bullet.disableBody(true, true);

    }

    shoot(){
        this.bullet = this.bullets.create(this.player.sprite.x, this.player.sprite.y, 'shot', 0);
        this.physics.add.collider(this.groundLayer, this.bullet, this.beGone, null, this);
        this.bullet.setVelocityX(100);
        this.bullet.setVelocityY(0);
        this.bullet.body.allowGravity = false;
        this.player.sprite.setTexture("player", 6);
    }
    // update(time, delta) {
    //     // Allow the player to respond to key presses and move itself
    //     this.player.update();
    //     this.enemy.update();
    //     if(this.enemy.sprite.x > this.player.sprite.x){
    //         this.enemy.sprite.setAccelerationX(-5);
    //         this.enemy.sprite.setFlipX(true);
    //     } else {
    //         this.enemy.sprite.setAccelerationX(5);
    //         this.enemy.sprite.setFlipX(false);
    //
    //     }
    //
    //     if (this.player.sprite.y > this.groundLayer.height) {
    //         this.player.destroy();
    //         this.scene.restart();
    //     }
    //     this.input.keyboard.on('keyup', function(e){if(e.key == "5" && time > this.lastFired){
    //         this.shoot();
    //         this.lastFired = time + 200;
    //     }}, this);
    //
    // }
}
