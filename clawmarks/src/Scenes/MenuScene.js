import Button from "../UI/Button.js"
import { FireTask } from "../Mechanics/Tasks.js";
import Flight from "../Mechanics/Flight.js"
import CRTShader from "../../assets/shaders/CRTShader.js";

export default class MenuScene extends Phaser.Scene
{
    constructor() {
        // Set key of the scene
        super({key: "MenuScene"});
    }

    preload ()
    {
        this.game_button = new Button("| TIMED >", () => {
            this.scene.start("GameScene");
        });

        this.tutorial_button = new Button("| TUTORIAL >", () => {
            this.scene.start("GameScene");
        });

        this.options_button = new Button("OPTIONS ~", () => {
            this.scene.start("GameScene");
        });

        this.login_button = new Button("LOGOUT @", () => {
            this.scene.start("LoginScene");
        });
    }

    update() {
        console.log("test")
    }

    create ()
    {
        this.add.rectangle(16, 16, this.game.config.width - 32, this.game.config.height - 32, 0x008751).setOrigin(0, 0)
        this.add.rectangle(21, 21, this.game.config.width - 47, this.game.config.height - 47, 0x000000).setOrigin(0, 0)


        this.game_button.create(this, 64, 64, 50, 0x00E346);
        this.tutorial_button.create(this, 64, 164, 40, 0x00E346);

        this.options_button.create(this, 64, 464, 30, 0x7E2553);
        this.login_button.create(this, 64, 564, 30, 0x7E2553);

        this.cameras.main.setPostPipeline(CRTShader);

    }
}