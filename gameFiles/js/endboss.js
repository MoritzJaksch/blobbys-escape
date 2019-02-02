

export default class Endboss {
    constructor(scene, x, y) {
        this.scene = scene;
        // Create the animations we need from the player spritesheet
        const anims = scene.anims;
        // anims.create({
        //     key: "boss-idle",
        //     frames: anims.generateFrameNumbers("endBoss", { start: 0, end: 1 }),
        //     frameRate: 3,
        //     repeat: -1
        // });
        // anims.create({
        //     key: "boss-jump",
        //     frames: anims.generateFrameNumbers("endBoss", { start: 5, end: 8 }),
        //     frameRate: 6,
        // });


        // Create the physics-based sprite that we will move around and animate
        this.sprite = scene.physics.add
            .sprite(x, y, "endBoss", 0)
            .setDrag(500, 0)
            .setMaxVelocity(200, 500)
            .setBounce(0.3);


        this.hitpoints = 5;
        this.exists = true;

        // Track the arrow keys & WASD
        //     const { LEFT, RIGHT, UP, W, A, D } = Phaser.Input.Keyboard.KeyCodes;
        //     this.keys = scene.input.keyboard.addKeys({
        //         left: LEFT,
        //         right: RIGHT,
        //         up: UP,
        //         w: W,
        //         a: A,
        //         d: D
        //     });

        this.blobs = scene.physics.add.group();
        this.lastFired = 0;
        this.lastJumped = 10000;
        this.onGround = true;
        this.exists = true;

    }

    shoot(){
        this.blob = this.blobs.create(this.sprite.x, this.sprite.y, 'shot', 0);
        this.blob.body.allowGravity = false;
        this.blob.setFlipX(true);
        this.blob.scaleY = 3;
        this.blob.scaleX = 3;

        this.blob.setVelocityY(0);
        this.blob.setVelocityX(-100);

    }

    jump(sprite){
        this.onGround = false;
        sprite.anims.stop("boss-idle", true);
        sprite.anims.play("boss-jump", true);
        console.log(sprite.anims.play("boss-jump", true));
        setTimeout(()=>{this.onGround = true;},1500);

    }

    update(time, delta) {
        if(this.exists){



            const sprite = this.sprite;

            // Apply horizontal acceleration when left/a or right/d are applied

            if(this.onGround){
                sprite.anims.play("boss-idle", true);
                if (time > this.lastFired) {
                    this.shoot();
                    this.lastFired = time + 5000;
                }

            }

            // if (time > this.lastFired) {
            //     this.shoot();
            //     this.lastFired = time + 5000;
            // }

            if(time > this.lastJumped) {
                this.jump(sprite);
                this.lastJumped = time + 10000;
                this.lastFired = time + 4000;
            }
        }


    }

    destroy() {
        this.sprite.destroy();
    }
}
