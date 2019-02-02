import PlatformerScene from "./platformer-scene.js";
import Startscene from "./startScreen.js";
import Cutscene from "./cutscene.js";
import Endscene from "./endScreen.js";



const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 640,
    parent: "game-container",
    pixelArt: true,
    antialias: false,
    backgroundColor: "#1d212d",
    scene: [Startscene, Cutscene, PlatformerScene, Endscene],
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 1000 }
        }
    },

};


const game = new Phaser.Game(config);
