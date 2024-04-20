import GameScene from "./Scenes/GameScene.js";
import LoginScene from "./Scenes/LoginScene.js"
import MenuScene from "./Scenes/MenuScene.js"
import TitleScene from "./Scenes/TitleScene.js"


const config = {
    type: Phaser.WEBGL,

    scale: {
        width: 1280,
        height: 800,
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        parent: "game-container",
    },
    scene: [TitleScene, LoginScene, MenuScene, GameScene],
    pixelArt: true,

};

const game = new Phaser.Game(config);