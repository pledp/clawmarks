import Button from "../UI/Button.js"
import { FireTask } from "../Mechanics/Tasks.js";
import Flight from "../Mechanics/Flight.js"
import TextField from "../UI/TextField.js";

export default class LoginScene extends Phaser.Scene
{
    constructor() {
        // Set key of the scene
        super({key: "LoginScene"});
    }

    preload ()
    {

    }

    create ()
    {
        this.login_field = new TextField("Login");
        this.register_field = new TextField("Register");

        this.menu_button = new Button("Menu", () => {
            this.scene.start("MenuScene");
        });
        this.add.bitmapText(0, 0, 'PixelFont', 'Login Scene');

        this.login_field.create(this, 0, 300, 30);
        this.register_field.create(this, 0, 400, 30);

        this.menu_button.create(this, 0, 100, 30);
    }
}