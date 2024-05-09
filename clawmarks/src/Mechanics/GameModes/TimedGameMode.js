import GameMode from "./GameMode.js"
import Flight from "../Flight.js"
import { FireTask } from "../Tasks.js";
import LogItem from "../../UI/LogItem.js";

import Clawmarks from "../../Clawmarks.js";

export default class TimedGameMode extends GameMode {

    constructor(log_callback) {
        super();

        this.add_task_listeners = [];

        this.log_callback = log_callback;
        this.remove_task_on_crash = true;

        this.letters = [];
        this.char_time = 0;
        this.cur_char_index = 0;

        this.add_task_time = 0;

        this.random_time = Math.floor(Math.random() * 5) + 2;
        this.timer = -4;

        this.mode_name = "Timed";

        this.countdown_timer = 0;

        this.end_text = "";
    }

    AddTaskListener(listener) {
        this.add_task_listeners.push(listener);
    }

    StartGame() {
        this.is_finishing = false;
        this.is_starting = true;
        this.is_playing = true;

        this.log_callback(new LogItem("TIMED-mode", 0xFF004D))
        this.log_callback(new LogItem("You have 5 minutes to get as many points as possible!", 0x5f574f))
        this.log_callback(new LogItem(" ", 0x5f574f))


    }

    Update(scene, time, delta) {
        
        if(this.is_starting) {
            this.timer += delta / 1000;
            this.countdown_timer += delta / 1000;

            if(this.countdown_timer >= 1) {
                this.log_callback(new LogItem(`Starting in ${Math.abs(this.timer)}...`, 0x5f574f))
                this.countdown_timer = 0;
            }


            if(this.timer >= 0) {
                this.is_starting = false
                this.timer = 0;
            }
        }

        else if(!this.is_finishing) {
            // Convert MS to S
            this.add_task_time += delta / 1000;
            this.timer += delta / 1000;

            // End game at 5 minutes
            if(this.timer > 300) {
                this.is_finishing = true;
                if(scene.points > Clawmarks.user.high_score) {
                    this.end_text = `New high-score! ${scene.points} points!`;
                    Clawmarks.user.high_score = scene.points;
                    let response = fetch(`http://127.0.0.1:3000/SaveUserChanges/${Clawmarks.user.username}/${scene.points}`);
                }
                else {
                    this.end_text = `The game ended with ${scene.points} points.`;
                }
            }
                
            // After a period, add a new flight
            if(this.add_task_time >= this.random_time) {
                if(this.tasks.length < 6)
                    this.AddTask();
                this.add_task_time = 0;
            }
        }

        else {
            this.UpdateEndScene(scene, time, delta);
        }
    }

    UpdateEndScene(scene, time, delta) {
        let reg = new RegExp('^[0-9]+$');

        this.char_time += delta / 1000;

        if(this.char_time > 0.3) {
            if(this.cur_char_index >= this.end_text.length) {
                scene.time.delayedCall(3000, () => {
                    this.is_playing = false;
                }, [], this);
            }
            else {
                let letter = scene.add.bitmapText(scene.game.config.width / 2 - (this.end_text.length / 2) * 26 + this.cur_char_index * 26, scene.game.config.height / 3, 'PixelFont', this.end_text[this.cur_char_index], 26);

                if(reg.test(this.end_text[this.cur_char_index])) {
                    letter.setTint(0x00E436);
                }

                this.cur_char_index++;
                this.char_time = 0;

                this.letters.push(letter);
            }
        }

        for(let i = 0; i < this.letters.length; i++) {
            this.letters[i].y = scene.game.config.height / 3 + Math.sin((time / 500) + i) * 20;
        }
    }

    async AddTask(force_task = null, make_flight = true, spot = null) {
        let flight = await Flight.CreateFlight(force_task);

        if (!make_flight) {
            flight = new FireTask(); 
        }

        if(spot != null) 
            this.tasks.splice(spot, 0, flight);
        else 
            this.tasks.push(flight);

        this.NotifyNewTask(spot);

        this.random_time = Math.floor(Math.random() * 5) + 2;
    }

    GetTime() {
        let text = "";
        if (this.timer >= 60) {
            text = `${text}${Math.floor(this.timer / 60).toString()}.`;
        }
        
        return `${text}${(this.timer % 60).toFixed(2)}`;
    }

    async OnCompletion(task) {
        if(Math.random() > 0.80) {
            await this.AddTask(FireTask, false, 0);

        }
    }

    NotifyNewTask(spot = null) {
        for(let i = 0; i < this.add_task_listeners.length; i++) {
            this.add_task_listeners[i](spot);
        }
    }
}