import Button from "../UI/Button.js"
import CRTShader from "../../assets/shaders/CRTShader.js";
import TextField from "../UI/TextField.js";

export default class LoginScene extends Phaser.Scene
{
    constructor() {
        // Set key of the scene
        super({key: "LoginScene"});
    }

    preload() {
        this.random_chars = [
            "%", "@", "!", "(", ")", "{", "}", ">", "?", "...---...", "SyntaxError: Unexpected token", "SyntaxError: missing ; before statement", 
            'Error: Permission denied to access property "x"', 'RangeError: invalid array length', 'SyntaxError: illegal character',
            'SyntaxError: missing variable name', 'ReferenceError: reference to undefined property "x"'
        ]
        this.lag_texts = [];
    }

    update(time, delta) {
        this.blink_timer += delta / 1000;
        if(this.blink_timer >= 1) {
            this.text_cursor.visible = !this.text_cursor.visible;
            this.blink_timer = 0;
        }

        if(Math.random() <= 0.001) {
            this.border.x += 20;
        }
        if(Math.random() <= 0.0005) {
            this.border.x = 16;
        }

        if(Math.random() <= 0.001) {
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
                        this.lag_texts[i].visible = !this.lag_texts[i].visible;
                        break;
                    case 2:
                        this.lag_texts[i].y -= 100; 
                    case 3:
                        this.lag_texts[i].x = Math.floor(Math.random() * this.game.config.width);
                        this.lag_texts[i].y = Math.floor(Math.random() * this.game.config.height);

                }
            }
        }
    } 


    create ()
    {

        this.blink_timer = 0;

        this.border = this.add.rectangle(16, 16, this.game.config.width - 32, this.game.config.height - 32, 0x008751).setOrigin(0, 0)
        this.add.rectangle(21, 21, this.game.config.width - 47, this.game.config.height - 47, 0x000000).setOrigin(0, 0)

        this.login_button = new Button("LOGIN >", () => {
            this.scene.start("MenuScene");
        });
        this.register_button = new Button("REGISTER @", () => {
            this.scene.start("MenuScene");
        });

        this.login_field = new TextField(undefined, this.UpdateCursor.bind(this), this.NewField.bind(this));
        this.register_field = new TextField(undefined, this.UpdateCursor.bind(this), this.NewField.bind(this));

        this.text_field = this.add.bitmapText(64, 64, "PixelFont", ">", 30);
        this.login_field.create(this, 104, 64, 30, 0x00E346);
        this.login_button.create(this, 64, 114, 30, 0x00E346);

        this.text_field = this.add.bitmapText(64, 364, "PixelFont", ">", 30);
        this.register_field.create(this, 104, 364, 30, 0x00E346);
        this.register_button.create(this, 64, 414, 30, 0x00E346);

        this.text_cursor = this.add.rectangle(104 + (this.login_field.text.length) * 30 + 8, 64, 10, 30, 0xfff1e8, 1).setOrigin(0, 0);


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

    NewField(field) {
        this.text_cursor.y = field.text_field.y;
        this.text_cursor.x = field.text_field.x + field.text_field.width + 8;
    }

    UpdateCursor(field) {
        this.text_cursor.x = field.text_field.x + field.text_field.width + 8;
    }
}