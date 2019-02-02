import Enemy from "./enemy.js";

export default class Player {
    constructor(scene, x, y) {
        this.scene = scene;

        const anims = scene.anims;
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

        // PHYSICS //
        this.sprite = scene.physics.add
            .sprite(x, y, "player", 0)
            .setDrag(500, 0)
            .setMaxVelocity(200, 400)
            .setBounce(0.3);


        // MOVEMENT //
        const { LEFT, RIGHT, UP, W, A, D } = Phaser.Input.Keyboard.KeyCodes;
        this.keys = scene.input.keyboard.addKeys({
            left: LEFT,
            right: RIGHT,
            up: UP,
            w: W,
            a: A,
            d: D
        });

    }

    update() {
        const keys = this.keys;
        const sprite = this.sprite;
        const onGround = sprite.body.blocked.down;
        const acceleration = onGround ? 400 : 200;

        // ACCELERATION //
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

        // IDLE AND RUN
        if (onGround) {
            if (sprite.body.velocity.x !== 0) sprite.anims.play("player-run", true);
            else sprite.anims.play("player-idle", true);
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
    }

    destroy() {
        this.sprite.destroy();
    }
}
