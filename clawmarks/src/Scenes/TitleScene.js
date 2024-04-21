import Clawmarks from "../Clawmarks.js";

export default class TitleScene extends Phaser.Scene
{
    constructor() {
        super({key: "TitleScene"});
    }

    preload ()
    {
        this.cur_text_index = 0;
        this.console_text = [
            "Initializing HEL Industries (TM) terminal v0.2 ............................................",
            "",
            "Initializing core system... Done",
            "Compiling electroacoustic binaries... Done",
            "Crashing planes... Done",
            "Synchronizing graphical drivers... Done",
            "Calibrating systems for maximum cooperative behaviour... Done",
            "Fired up and ready to serve.",
            "",
            "(c) HEL Industries (TM). All rights reserved.",


        ]
        this.load.bitmapFont("PixelFont", "assets/fonts/PixelFont.png", "assets/fonts/PixelFont.xml");
    }

    create ()
    {
        if(Clawmarks.Debug) {
            this.scene.start("LoginScene");
        }

        this.timed_console = this.time.addEvent({
            delay: 500,
            callback: this.AddConsoleText, 
            callbackScope: this, 
            loop: true,
        });

    }

    AddConsoleText() {
        if(this.cur_text_index < this.console_text.length) {
            this.add.bitmapText(0, this.cur_text_index * 20, 'PixelFont', this.console_text[this.cur_text_index], 16);
            this.cur_text_index++;
        }
        else {
            this.timed_console.remove(false);

            this.time.delayedCall(3000, () => {
                this.scene.start("LoginScene");
            }, [], this);
        }

    }
}