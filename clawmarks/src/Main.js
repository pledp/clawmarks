import GameScene from "./Scenes/GameScene.js";
import LoginScene from "./Scenes/LoginScene.js"
import MenuScene from "./Scenes/MenuScene.js"
import TitleScene from "./Scenes/TitleScene.js"


const config = {
    type: Phaser.WEBGL,

    scale: {
        width: 800,
        height: 600,
        parent: "game-container",
    },
    scene: [TitleScene, LoginScene, MenuScene, GameScene],
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 200 }
        }
    }
};

const game = new Phaser.Game(config);