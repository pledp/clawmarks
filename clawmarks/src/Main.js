import GameScene from "./Scenes/GameScene.js";
import LoginScene from "./Scenes/LoginScene.js"
import MenuScene from "./Scenes/MenuScene.js"
import TitleScene from "./Scenes/TitleScene.js"
import Clawmarks from "./Clawmarks.js";
import CRTShader from "../assets/shaders/CRTShader.js";



// Phaser (Game framework config)
const config = {
    type: Phaser.WEBGL,

    scale: {
        width: 1920,
        height: 1080,
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        parent: "game-container",
    },
    scene: [TitleScene, LoginScene, MenuScene, GameScene],

    pipeline: { CRTShader }, 

    pixelArt: true,
};

// Set game config (Debug mode etc)
Clawmarks.SetConfig({
    Debug: true,
});

const game = new Phaser.Game(config);