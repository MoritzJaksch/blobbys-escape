import Player from "./player.js";

/**
 * A class that extends Phaser.Scene and wraps up the core logic for the platformer level.
 */

export default class PlatformerSceneTwo extends Phaser.Scene {
    constructor(){
        super({key: "PlatformerSceneTwo"});
    }

    create() {
        const map = this.make.tilemap({ key: "mapTwo" });
        const tiles = map.addTilesetImage("BW-tiles-2", "tiles");

        map.createDynamicLayer("Background", tiles);
        this.groundLayer = map.createDynamicLayer("Playground", tiles);
        map.createDynamicLayer("Foreground", tiles);

        // Instantiate a player instance at the location of the "Spawn Point" object in the Tiled map.
        // Note: instead of storing the player in a global variable, it's stored as a property of the
        // scene.
        const spawnPoint = map.findObject("spawnpoint", obj => obj.name === "Spawn");
        this.player = new Player(this, spawnPoint.x, spawnPoint.y);

        // Collide the player against the ground layer - here we are grabbing the sprite property from
        // the player (since the Player class is not a Phaser.Sprite).
        this.groundLayer.setCollisionByProperty({ collides: true });
        this.physics.world.addCollider(this.player.sprite, this.groundLayer);

        this.cameras.main.startFollow(this.player.sprite);
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        // Help text that has a "fixed" position on the screen
        this.add
            .text(16, 16, "Arrow keys or WASD to move & jump", {
                font: "18px monospace",
                fill: "#000000",
                padding: { x: 20, y: 10 },
                backgroundColor: "#ffffff"
            })
            .setScrollFactor(0);
    }

    update(time, delta) {
    // Allow the player to respond to key presses and move itself
        this.player.update();

        if (this.player.sprite.y > this.groundLayer.height) {
            this.player.destroy();
            this.scene.restart();
        }
    }
}
