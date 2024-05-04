import Button from "../UI/Button.js"
import CRTShader from "../../assets/shaders/CRTShader.js";
import GameConfig from "../Clawmarks.js";

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

        // Add button objects
        this.game_button = new Button("| TIMED >", () => {
            this.scene.start("GameScene");
        }, this.HoverMenuItem.bind(this));

        this.tutorial_button = new Button("| TUTORIAL >", () => {
            this.scene.start("GameScene");
        }, this.HoverMenuItem.bind(this));

        this.settings_button = new Button("SETTINGS ~", () => {
            this.SettingsMenuButton();
        }, this.HoverMenuItem.bind(this));

        this.login_button = new Button("LOGOUT @", () => {
            this.scene.start("LoginScene");
        }, this.HoverMenuItem.bind(this));

        let shader_setting = new Button("SHADER", () => {
            // Turn off shaders
            GameConfig.UseShader = !GameConfig.UseShader;

            if(!GameConfig.UseShader) {
                this.cameras.main.removePostPipeline("CRTShader");
                this.shader_setting_checkmark.GetTextField().text = "OFF";
                this.shader_setting_checkmark.GetTextField().setTint(0xFF004D);
            }
            else {
                this.cameras.main.setPostPipeline(CRTShader);
                this.shader_setting_checkmark.GetTextField().text = "ON";
                this.shader_setting_checkmark.GetTextField().setTint(0x00e436);

            }

        });

        this.border = this.add.rectangle(16, 16, this.game.config.width - 32, this.game.config.height - 32, 0x008751).setOrigin(0, 0)
        this.add.rectangle(21, 21, this.game.config.width - 47, this.game.config.height - 47, 0x000000).setOrigin(0, 0)

        this.game_button.create(this, 128, 128, 50, 0x00E346);
        this.tutorial_button.create(this, 128, 228, 30, 0x00E346);



        this.settings_button.create(this, 64, 464, 30, 0xFFFFFF);
        this.settings_menu = this.add.container(this.settings_button.button_field.x + this.settings_button.button_field.width + 50, 464 - 100);

        let settings_border = this.add.rectangle(0, 0, 500, 200 + 30, 0x008751).setOrigin(0, 0)
        let settings_rect = this.add.rectangle(5, 5, 490, 190 + 30, 0x000000).setOrigin(0, 0)

        shader_setting.create(this, 16, 16, 30, 0xFFFFFF);
        this.shader_setting_checkmark = new Button(GameConfig.UseShader ? "ON" : "OFF");
        this.shader_setting_checkmark.create(this, 500 - this.shader_setting_checkmark.text.length * 30 - 16, 16, 30, GameConfig.UseShader ? 0x00E436 : 0xFF004D);

        this.settings_menu.add(settings_border);
        this.settings_menu.add(settings_rect);
        this.settings_menu.add(shader_setting.GetTextField());
        this.settings_menu.add(this.shader_setting_checkmark.GetTextField());
        this.settings_menu.visible = false;

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

        if(GameConfig.UseShader)
            this.cameras.main.setPostPipeline(CRTShader);

    }

    HoverMenuItem(item) {
        this.cursor.y = item.button_field.y;
        this.cursor.x = item.button_field.x - item.button_field.fontSize;

        this.cursor.fontSize = item.button_field.fontSize;
    }

    SettingsMenuButton() {
        this.settings_menu.visible = !this.settings_menu.visible;
    }
}