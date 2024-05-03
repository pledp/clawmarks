import Button from "../UI/Button.js"
import CRTShader from "../../assets/shaders/CRTShader.js";

export default class MenuScene extends Phaser.Scene
{
    constructor() {
        // Set key of the scene
        super({key: "MenuScene"});
    }

    preload() {
        this.random_chars = [
            "%", "@", "!", "(", ")", "{", "}", ">", "?", "...---...", "SyntaxError: Unexpected token", "SyntaxError: missing ; before statement", 
            'Error: Permission denied to access property "x"', 'RangeError: invalid array length', 'SyntaxError: illegal character',
            'SyntaxError: missing variable name', 'ReferenceError: reference to undefined property "x"'
        ]
        this.lag_texts = [];
    }

    update() {        
        // Add random buggy text to the screen
        if(Math.random() <= 0.001 && this.lag_texts.length < 50) {
            this.border.x += 20;

            for(let i = 0; i < Math.floor(Math.random() * 3) + 1; i++) {
                this.lag_texts.push(this.add.bitmapText(
                    Math.floor(Math.random() * this.game.config.width), 
                    Math.floor(Math.random() * this.game.config.height), 
                    'PixelFont', 
                    this.random_chars[Math.floor(Math.random() * this.random_chars.length)],
                    Math.floor(Math.random() * 12) + 5
                ).setTint(0x5f574f).setAlpha(Math.random()));
            }
        }
        if(Math.random() <= 0.0001) {
            this.border.x = 16;
            for(let i = 0; i < this.lag_texts.length; i++) {
                let random = Math.floor(Math.random() * 4);

                switch(random) {
                    case 0:
                        this.lag_texts[i].x += 100;
                        break;
                    case 1:
                        this.lag_texts[i].destroy();
                        break;
                    case 2:
                        this.lag_texts[i].y -= 100; 
                    case 3:
                        this.lag_texts[i].x = Math.floor(Math.random() * this.game.config.width);
                        this.lag_texts[i].y = Math.floor(Math.random() * this.game.config.height);

                }
            }
        }
        if(Math.random() <= 0.00001) {
            for(let i = 0; i < this.lag_texts.length; i++) {
                this.lag_texts[i].destroy();
            }
            this.lag_texts = [];
        }
    }

    create ()
    {
        this.game_button = new Button("| TIMED >", () => {
            this.scene.start("GameScene");
        }, this.HoverMenuItem.bind(this));

        this.tutorial_button = new Button("| TUTORIAL >", () => {
            this.scene.start("GameScene");
        }, this.HoverMenuItem.bind(this));

        this.options_button = new Button("OPTIONS ~", () => {
            this.scene.start("GameScene");
        }, this.HoverMenuItem.bind(this));

        this.login_button = new Button("LOGOUT @", () => {
            this.scene.start("LoginScene");
        }, this.HoverMenuItem.bind(this));


        this.border = this.add.rectangle(16, 16, this.game.config.width - 32, this.game.config.height - 32, 0x008751).setOrigin(0, 0)
        this.add.rectangle(21, 21, this.game.config.width - 47, this.game.config.height - 47, 0x000000).setOrigin(0, 0)

        this.game_button.create(this, 128, 128, 50, 0x00E346);
        this.tutorial_button.create(this, 128, 228, 30, 0x00E346);

        this.options_button.create(this, 64, 464, 30, 0xFFFFFF);
        this.login_button.create(this, 64, 564, 30, 0xFFFFFF);

        this.cursor = this.add.bitmapText(128 - 50, 128, 'PixelFont', ">", 50);

        let string = "HEL-Industries (TM) Terminal (TM) v. 0.2";
        this.add.bitmapText(
            this.game.config.width - string.length * 16 - 64, 
            this.game.config.height - 64, 
            'PixelFont', 
            string,
            16
        )

        this.cameras.main.setPostPipeline(CRTShader);

    }

    HoverMenuItem(item) {
        this.cursor.y = item.button_field.y;
        this.cursor.x = item.button_field.x - item.button_field.fontSize;

        this.cursor.fontSize = item.button_field.fontSize;
    }
}