function preload(){
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
    this.load.image("tiles", "../assets/tilesets/BW-tiles-2.png");
    this.load.tilemapTiledJSON("map", "../assets/tilemaps/level_cave.json");
    this.load.tilemapTiledJSON("mapTwo", "../assets/tilemaps/level_cave_2.json");

}
