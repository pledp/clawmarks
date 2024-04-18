import LoginScene from "./Scenes/LoginScene.js"
import MenuScene from "./Scenes/MenuScene.js"


const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: [LoginScene, MenuScene],
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 200 }
        }
    }
};

const game = new Phaser.Game(config);