export default class Preloader extends Phaser.Scene{
    constructor(){
        super({key: "preloader"});
    }
    preload(){
        console.log("Preloader preload");

        //GAME CHARACTERS//

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


        //MAPS & LEVELS//
        this.load.image("tiles", "../assets/tilesets/BW-tiles-2.png");
        this.load.tilemapTiledJSON("map", "../assets/tilemaps/level_cave.json");
        this.load.tilemapTiledJSON("mapTwo", "../assets/tilemaps/level_cave_2.json");

        this.scene.start("levelOne");
    }
}
//     this.load.spritesheet(
//         "player",
//         "../assets/spritesheets/blobby.png",
//         {
//             frameWidth: 24,
//             frameHeight: 20,
//             margin: 0,
//             spacing: 0
//         }
//     );
//     this.load.image("tiles", "../assets/tilesets/BW-tiles-2.png");
//     this.load.tilemapTiledJSON("map", "../assets/tilemaps/level_cave.json");
//     this.load.tilemapTiledJSON("mapTwo", "../assets/tilemaps/level_cave_2.json");
//
// }
