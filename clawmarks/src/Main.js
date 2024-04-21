import GameScene from "./Scenes/GameScene.js";
import LoginScene from "./Scenes/LoginScene.js"
import MenuScene from "./Scenes/MenuScene.js"
import TitleScene from "./Scenes/TitleScene.js"
import Clawmarks from "./Clawmarks.js";


// Phaser (Game framework config)
const config = {
    type: Phaser.WEBGL,

    scale: {
        width: 640,
        height: 480,
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        parent: "game-container",
    },
    scene: [TitleScene, LoginScene, MenuScene, GameScene],

    pixelArt: true,
};

// Set game config (Debug mode etc)
Clawmarks.SetConfig({
    Debug: true,
});

const game = new Phaser.Game(config);