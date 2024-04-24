import GameMode from "./GameMode.js"
import Flight from "../Flight.js"

export default class TimedGameMode extends GameMode {

    constructor(widget_callback = null) {
        super();

        this.random_time = Math.floor(Math.random() * 6) + 3;
        this.add_task_time = 0;

        this.widget_callback = widget_callback;
    }

    AddTask(spot = null) {
        if(spot != null) {
            this.tasks.splice(spot, 0, Flight.CreateFlight());
        }
        else 
            this.tasks.push(Flight.CreateFlight());

        this.widget_callback(spot);
    }

    Update(time, delta) {
        // Convert MS to S
        this.add_task_time += delta / 1000;

        if(this.add_task_time >= this.random_time) {
            this.AddTask(0);
            this.add_task_time = 0;
        }
    }
}