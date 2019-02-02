

export default class Enemy {
    constructor(scene, x, y) {
        this.scene = scene;

        // Create the animations we need from the player spritesheet
        const anims = scene.anims;
        anims.create({
            key: "enemy-idle",
            frames: anims.generateFrameNumbers("enemy", { start: 0, end: 2 }),
            frameRate: 3,
            repeat: -1
        });
        anims.create({
            key: "enemy-run",
            frames: anims.generateFrameNumbers("enemy", { start: 0, end: 2 }),
            frameRate: 4,
            repeat: -1
        });

        // Create the physics-based sprite that we will move around and animate
        this.sprite = scene.physics.add
            .sprite(x, y, "enemy", 0)
            .setDrag(0, 0)
            .setMaxVelocity(800, 400)
            .setBounce(0.2);


        this.hitpoints = 3;

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
    }

    update() {
        const sprite = this.sprite;
        const onGround = sprite.body.blocked.down;
        const acceleration = onGround ? 600 : 200;

        // Apply horizontal acceleration when left/a or right/d are applied
        sprite.setAccelerationX(1);

        // Update the animation/texture based on the state of the player
        sprite.anims.play("enemy-idle", true);


    }

    destroy() {
        this.sprite.destroy();
    }
}
