import {Task, AltitudeTask, HeadingTask, TakeoffTask, LandingTask} from "./Tasks.js"

class Test {

}

export default class Flight extends Task {
    static airliners = ["AX", "AY"];
    static available_tasks = [AltitudeTask, HeadingTask, TakeoffTask, LandingTask];

    static async CreateFlight(force_task = null) {
        let flight = new Flight();

        flight.airliner = this.airliners[Math.floor(Math.random() * Flight.airliners.length)]
        flight.flight_number = Math.floor(Math.random() * 9999) + 100

        const response = await fetch(`http://127.0.0.1:3000/RandomAirport`);
        let random_airport = await response.json();
        
        flight.lat = random_airport.lat;
        flight.lon = random_airport.lon;
        
        if(force_task) 
            flight.task = new force_task();
        else {
            let random_task = Math.floor(Math.random() * Flight.available_tasks.length);
            flight.task = new Flight.available_tasks[random_task]();
        }

        flight.type = flight.task.type;
        
        let random = Math.round(Math.random());
        
        if(flight.task instanceof TakeoffTask)
            random = 0;
        else if (flight.task instanceof LandingTask) 
            random = 1;

        if(random == 0) {
            flight.origin_airport = "HEL";
            flight.destination_airport = random_airport.icao;
        }
        else {
            flight.origin_airport = random_airport.icao;
            flight.destination_airport = "HEL";
        }

        flight.task_complete_text = flight.airliner + flight.flight_number + flight.task.task_complete_text;
        flight.task_instruction = flight.task.task_instruction;
        flight.points_to_award = flight.task.points_to_award;

        return flight;
    }

    constructor() {
        super();
    }

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