
export default class Player extends Phaser.Scene{
    constructor(scene, x, y) {
        super({key: "player"});


        // PHYSICS //
        this.sprite = scene.physics.add
            .sprite(x, y, "player", 0)
            .setDrag(500, 0)
            .setMaxVelocity(200, 400)
            .setBounce(0.3);

        this.blobs = scene.physics.add.group();
        this.lastFired = 0;



        // MOVEMENT //
        const { LEFT, RIGHT, DOWN, UP, W, A, S, D, Q } = Phaser.Input.Keyboard.KeyCodes;
        this.keys = scene.input.keyboard.addKeys({
            left: LEFT,
            right: RIGHT,
            down: DOWN,
            up: UP,
            w: W,
            a: A,
            s: S,
            d: D,
            q: Q
        });

    }


    shoot(){
        this.blob = this.blobs.create(this.sprite.x, this.sprite.y, 'shot', 0);
        this.blob.body.allowGravity = false;
        this.blob.setVelocityY(0);

        if(this.sprite.flipX){
            this.blob.setFlipX(true);
            this.blob.setVelocityX(-100);
        } else {
            this.blob.setVelocityX(100);
        }
    }


    update(time, delta) {
        const keys = this.keys;
        const sprite = this.sprite;
        const onGround = sprite.body.blocked.down;
        const acceleration = onGround ? 200 : 200;

        if(keys != null){        // ACCELERATION //
            if (keys.left.isDown || keys.a.isDown) {
                sprite.setAccelerationX(-acceleration);
                sprite.setFlipX(true);
            } else if (keys.right.isDown || keys.d.isDown) {
                sprite.setAccelerationX(acceleration);
                sprite.setFlipX(false);
            } else {
                sprite.setAccelerationX(0);
            }

            // JUMPING //
            if (onGround && (keys.up.isDown || keys.w.isDown)) {

                sprite.setVelocityY(-400);
            }

            // ATTACKING //
            if ((keys.down.isDown || keys.s.isDown) && time > this.lastFired) {
                this.shoot();
                this.lastFired = time + 200;
                console.log("SPRITE: ", sprite);
                sprite.setTexture("player", 6);

            }
        }
        // IDLE AND RUN
        if (onGround) {
            if (sprite.body.velocity.x !== 0){
                sprite.anims.play("player-run", true);
            } else {sprite.anims.play("player-idle", true);}
        } else {
            if(sprite.body.velocity.y > 0){
                sprite.anims.stop();
                sprite.setTexture("player", 4);
            }
            if(sprite.body.velocity.y == 0){
                sprite.anims.stop();
                sprite.setTexture("player", 3);
            }
            if(sprite.body.velocity.y < 0){
                sprite.anims.stop();
                sprite.setTexture("player", 2);
            }

        }


        this.score = 1000000 - time;

    }

    destroy() {
        this.sprite.destroy();
    }
}
