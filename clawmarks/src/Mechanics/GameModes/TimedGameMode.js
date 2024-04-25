import GameMode from "./GameMode.js"
import Flight from "../Flight.js"

export default class TimedGameMode extends GameMode {

    constructor(widget_callback = null) {
        super();

        this.add_task_time = 0;
        this.widget_callback = widget_callback;

        this.random_time = Math.floor(Math.random() * 6) + 3;
        this.timer = 0;

        this.mode_name = "Timed";

    }

    StartGame() {
        this.is_playing = true;
    }

    Update(time, delta) {
        // Convert MS to S
        this.add_task_time += delta / 1000;
        this.timer += delta / 1000;

        if(this.timer > 300) {
            this.is_playing = false
        }
            

        if(this.add_task_time >= this.random_time) {
            if(this.tasks.length < 6)
                this.AddTask(0);
            this.add_task_time = 0;
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
}