import GameMode from "./GameMode.js"
import Flight from "../Flight.js"
import { FireTask } from "../Tasks.js";
import LogItem from "../../UI/LogItem.js";

import { AltitudeTask, LandingTask, TakeoffTask } from "../Tasks.js";

class TutorialText {
    constructor(text, pause = false, init_callback = undefined, check_callback = undefined) {
        this.text = text;
        this.pause = pause;

        this.init_callback = init_callback;
        this.check_callback = check_callback;
    }

    Init() {
        if(this.init_callback)
            this.init_callback();
    }
    Check() {
        return this.check_callback();
    }
}

export default class Tutorial extends GameMode {

    constructor(log_callback) {
        super();

        this.num_completed_tasks = 0;
        this.can_continue = true;
        this.add_task_listeners = [];
        this.log_callback = log_callback;

        this.tutorial_text = [
            new TutorialText("Welcome to your new job as a Air Traffic Controller!"),
            new TutorialText("I'm Log, hi. I'm the action log of this tower, and today I'll be giving you a quick run-down on how to do things here."),
            new TutorialText("Here your job is to guide airplanes in anything they may need."),
            new TutorialText("Flights show up on the table on the right, it's your job to fullfill their request."),
            new TutorialText("Let's start with an easy one, here your job is to alter the altitude of a craft."),
            new TutorialText("You have to specify which aircraft you are referring to, so if the table says 'AY2417', you must say 'AY2417' before stating your command."),
            new TutorialText("To change the altitude, you say 'altitude x', so to change altitude to 2000, you say 'AY2417 altitude 2000'."),
            new TutorialText("Let's give it a try now!", true, () => {
                this.AddTask(AltitudeTask);
            },
            () => {
                return this.num_completed_tasks == 1;
            }),
            new TutorialText("Just... Fantastic work."),
            new TutorialText("In reality, more than 1 task are available at a time, you can use your arrow keys to navigate which one to solve."),
            new TutorialText("Each task gives you between 1 and 3 points, maybe you want to ditch low rewarding jobs, and only go for the big bucks."),
            new TutorialText("There is also a landing task, which you can solve by going:"),
            new TutorialText("AY2417 deny landing HEL"),
            new TutorialText("Let's try it out!", true, () => {
                this.AddTask(TakeoffTask);
                this.AddTask(LandingTask);
            },
            () => {
                return this.num_completed_tasks == 3;
            }),
            new TutorialText("Fantastic! There are also other tasks available, but if you use your bright braincells you'll be able to solve them with no problemos!"),
            new TutorialText("Now, get out of here and go get a new World-Record in the Timed mode."),
        ]

        this.cur_text_index = 0;

        this.timer = 0;
        this.mode_name = "Tutorial";
    }

    AddTaskListener(listener) {
        this.add_task_listeners.push(listener);
    }

    StartGame() {
        this.is_finishing = false;
        this.is_playing = true;

        this.log_callback(new LogItem("TUTORIAL", 0x5f574f))
        this.log_callback(new LogItem(" ", 0x5f574f))


    }

    Update(scene, time, delta) {
    
        if(!this.is_finishing) {
            if(this.cur_text_index < this.tutorial_text.length) {
                if(this.can_continue){
                    // Convert MS to S
                    this.timer += delta / 1000;

                    if(this.timer >= 3) {
                        this.tutorial_text[this.cur_text_index].Init();
                        this.log_callback(new LogItem(this.tutorial_text[this.cur_text_index].text, 0xffffff));
                        this.can_continue = !this.tutorial_text[this.cur_text_index].pause;
                        
                        this.timer = 0;
                        this.cur_text_index++;
                    }
                }
                else if(this.tutorial_text[this.cur_text_index-1].Check()) {
                    console.log("test");
                    this.can_continue = true;
                }
            }
            else {
                this.timer += delta / 1000;
                if(this.timer >= 10) {
                    this.is_finishing = true;
                }
            }
        }
        else {
            this.UpdateEndScene(scene, time, delta);
        }
    }

    UpdateEndScene(scene, time, delta) {
        this.is_playing = false;
    }

    OnCompletion(task) {
        this.num_completed_tasks++;
    }

    AddTask(force_task = null, make_flight = true, spot = null) {
        let flight = Flight.CreateFlight(force_task);
        this.tasks.push(flight);

        this.NotifyNewTask(spot);
    }

    NotifyNewTask(spot = null) {
        for(let i = 0; i < this.add_task_listeners.length; i++) {
            this.add_task_listeners[i](spot);
        }
    }
}