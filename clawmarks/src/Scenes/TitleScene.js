import Clawmarks from "../Clawmarks.js";
import CRTShader from "../../assets/shaders/CRTShader.js";


export default class TitleScene extends Phaser.Scene
{
    constructor() {
        super({key: "TitleScene"});
    }

    preload ()
    {
        this.cur_text_index = 0;
        this.cur_char_index = 0;
        this.is_playing = true;

        this.char_time = 0;

        this.console_text = [
            "Initializing HEL Industries (TM) terminal v0.2 ............................................",
            " ",
            "Initializing core system... Done",
            "Compiling electroacoustic binaries... Done",
            "Crashing planes... Done",
            "Synchronizing graphical drivers... Done",
            "Calibrating systems for maximum cooperative behaviour... Done",
            "Fired up and ready to serve.",
            " ",
            "(c) HEL Industries (TM). All rights reserved.",


        ]
        this.load.bitmapFont("PixelFont", "assets/fonts/PixelFont.png", "assets/fonts/PixelFont.xml");
    }

    update(time, delta) {
        this.char_time += delta / 1000;

        if(this.char_time > 0.01 && this.is_playing) {

            if(this.cur_text_index < this.console_text.length) {
                this.cur_text.text += this.console_text[this.cur_text_index][this.cur_char_index];
                this.cur_char_index++;
                this.char_time = 0;

                if(this.cur_char_index >= this.console_text[this.cur_text_index].length) {
                    if(this.cur_text_index == 5) {
                        this.cameras.main.setPostPipeline(CRTShader);
                    }

                    this.cur_text_index += 1;
                    this.cur_text = this.add.bitmapText(8, this.cur_text_index * (16 + 2) + 8, 'PixelFont', "", 16)
                    this.cur_char_index = 0;
                }
            }
            else {
                this.is_playing = false;
                this.time.delayedCall(3000, () => {
                    this.scene.start("LoginScene");
                }, [], this);
            }
        }
    }

    create ()
    {
        if(Clawmarks.Debug) {
            this.scene.start("LoginScene");
        }

        this.cur_text = this.add.bitmapText(8, this.cur_text_index * (16 + 2) + 8, 'PixelFont', "", 16);
    }
}