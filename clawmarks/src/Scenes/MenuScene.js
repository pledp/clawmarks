import Button from "../UI/Button.js"
import { FireTask } from "../Mechanics/Tasks.js";
import Flight from "../Mechanics/Flight.js"

export default class MenuScene extends Phaser.Scene
{
    constructor() {
        // Set key of the scene
        super({key: "MenuScene"});
    }

    preload ()
    {
        this.game_button = new Button("Play Game", () => {
            this.scene.start("GameScene");
        });

        this.login_button = new Button("Login", () => {
            this.scene.start("LoginScene");
        });
    }

    create ()
    {
        this.add.bitmapText(0, 0, 'PixelFont', 'Menu Scene', 50);
        this.game_button.create(this, 0, 100);
        this.login_button.create(this, 0, 200);

    }
}