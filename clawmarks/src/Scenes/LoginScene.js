import Button from "../UI/Button.js"
import { FireTask } from "../Mechanics/Tasks.js";
import Flight from "../Mechanics/Flight.js"

export default class LoginScene extends Phaser.Scene
{
    constructor() {
        // Set key of the scene
        super({key: "LoginScene"});
    }

    preload ()
    {
        this.load.bitmapFont("PixelFont", "assets/fonts/PixelFont.png", "assets/fonts/PixelFont.xml");
        this.Button = new Button("Menu", this.ChangeScene);

        this.Flight = new Flight();
        console.log(this.Flight.print_task);

        this.Fire = new FireTask();
        console.log(this.Fire.ValidateCommand("fire runway 5"));
    }

    create ()
    {
        this.add.bitmapText(0, 0, 'PixelFont', 'Login Scene', 30);
        this.Button.create(this);
    }

    ChangeScene(scene) {
        scene.scene.start("MenuScene");
    }
}