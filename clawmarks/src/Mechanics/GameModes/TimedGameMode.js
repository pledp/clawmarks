import GameMode from "./GameMode.js"
import Flight from "../Flight.js"

export default class TimedGameMode extends GameMode {

    constructor(widget_callback = null) {
        super();

        this.letters = [];
        this.char_time = 0;
        this.cur_char_index = 0;

        this.add_task_time = 0;
        this.widget_callback = widget_callback;

        this.random_time = Math.floor(Math.random() * 6) + 3;
        this.timer = 0;

        this.mode_name = "Timed";

    }

    StartGame() {
        this.is_finishing = false;
        this.is_playing = true;
    }

    Update(scene, time, delta) {
        // Convert MS to S
        if(!this.is_finishing) {
            this.add_task_time += delta / 1000;
            this.timer += delta / 1000;

            if(this.timer > 2) {
                this.is_finishing = true;
            }
                

            if(this.add_task_time >= this.random_time) {
                if(this.tasks.length < 6)
                    this.AddTask(0);
                this.add_task_time = 0;
            }
        }
        else {
            this.UpdateEndScene(scene, time, delta);
        }
    }

    UpdateEndScene(scene, time, delta) {
        let reg = new RegExp('^[0-9]+$');



        let end_text = `The game ended with ${scene.points} points.`;
        this.char_time += delta / 1000;

        if(this.char_time > 0.3) {
            if(this.cur_char_index >= end_text.length) {
                scene.time.delayedCall(3000, () => {
                    this.is_playing = false;
                }, [], this);
            }
            else {
                let letter = scene.add.bitmapText(scene.game.config.width / 2 - (end_text.length / 2) * 26 + this.cur_char_index * 26, scene.game.config.height / 2 - 13, 'PixelFont', end_text[this.cur_char_index], 26);

                if(reg.test(end_text[this.cur_char_index])) {
                    letter.setTint(0x00E436);
                }

                this.cur_char_index++;
                this.char_time = 0;

                this.letters.push(letter);
            }
        }

        for(let i = 0; i < this.letters.length; i++) {
            this.letters[i].y = scene.game.config.height / 2 - 13 + Math.sin((time / 500) + i) * 20;
        }
    }

    AddTask(spot = null) {
        if(spot != null) 
            this.tasks.splice(spot, 0, Flight.CreateFlight());
        else 
            this.tasks.push(Flight.CreateFlight());

        this.widget_callback(spot);
    }

    GetTime() {
        let text = "";
        if (this.timer >= 60) {
            text = `${text}${Math.floor(this.timer / 60).toString()}.`;
        }
        
        return `${text}${(this.timer % 60).toFixed(2)}`;
    }

    OnCrash() {
        this.is_finishing = true;
        
    }
}