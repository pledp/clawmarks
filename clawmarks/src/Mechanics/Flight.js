import {Task, AltitudeTask, HeadingTask, TakeoffTask, LandingTask} from "./Tasks.js"

class Test {

}

export default class Flight extends Task {
    static airliners = ["AX", "AY"];
    static available_tasks = [AltitudeTask, HeadingTask, TakeoffTask, LandingTask];

    static CreateFlight(force_task = null) {
        return new Flight(force_task);
    }

    constructor(force_task = null) {
        super();

        this.airliner = Flight.airliners[Math.round(Math.random())];
        this.flight_number = Math.floor(Math.random() * 999) + 100;
        
        if(force_task) 
            this.task = new force_task();
        else {
            let random_task = Math.floor(Math.random() * Flight.available_tasks.length);
            this.task = new Flight.available_tasks[random_task]();
        }

        this.type = this.task.type;
        
        let random_airport = Math.round(Math.random());
        
        if(this.task instanceof TakeoffTask)
            random_airport = 0;
        else if (this.task instanceof LandingTask) 
            random_airport = 1;

        if(random_airport == 0) {
            this.origin_airport = "HEL";
            this.destination_airport = "SOME";
        }
        else {
            this.origin_airport = "SOME";
            this.destination_airport = "HEL";
        }

        this.task_complete_text = this.airliner + this.flight_number + this.task.task_complete_text;
        this.task_instruction = this.task.task_instruction;
        this.points_to_award = this.task.points_to_award;
    }
s
    ValidateCommand(command) {
        // Check flight number and pass rest of command to task
        return command.substring(0, command.indexOf(' ')) && this.task.ValidateCommand(command.substring(command.indexOf(' ') + 1));
    }

    OnCompletion() {
        this.task.OnCompletion();
    }

    GetHeader() {
        return `${this.airliner}${this.flight_number}`;
    }
    GetSecondHeader() {
        return `${this.origin_airport} -> ${this.destination_airport}`;
    }
    GetDescription() {
        return this.task.task_instruction;
    }

}