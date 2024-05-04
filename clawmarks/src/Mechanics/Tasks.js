// Abstract base for task 
export const Types = {
    Fire: "fire",
    Landing: "landing",
    Takeoff: "takeoff",
    Heading: "heading",
    Altitude: "altitude",
}

export class Task {

    type;
    #task_complete_text;
    #correct_command;
    #correct_value;
    task_instruction;
    #task_on_completion;

    constructor(on_completion_callback = undefined) {
        this.print_task = "";
        this.points_to_award = Math.floor(Math.random() * 3) + 1
        this.draw_pin = false;
    }

    // Validate input command, check if it is correct
    ValidateCommand(command) {};

    GetCompleteText() {
        return this.#task_complete_text;
    }
    OnCompletion() {};

    GetHeader() {
        return "";
    }
    GetSecondHeader() {
        return "";
    }
    GetDescription() {
        return "";
    }
}

export class FireTask extends Task {
    constructor(on_completion_callback = undefined) {
        super();
        this.type = Types.Fire;

        this.correct_command = "fire";

        let runway = Math.floor(Math.random() * 5) + 1;
        this.correct_value = runway;
        this.task_instruction = `Put out the fire on runway ${runway}.`;
        this.print_task = this.task_instruction;
        this.task_complete_text = "Fire successfully put out."

        this.lon = 10.90;
        this.lat = 63.44;
        this.draw_pin = true;
        this.draw_flight = false;
    }

    ValidateCommand(command) {
        if(command.split(" ").length == 3) {
            let [task, runway, value] = command.split(" ");
            return task.toLowerCase() == this.correct_command && runway.toLowerCase() == "runway" && parseInt(value) == this.correct_value;
        }
        else 
            return false;
    }

    GetHeader() {
        return "FIRE";
    }
    GetDescription() {
        return this.task_instruction;
    }
}

export class AltitudeTask extends Task {
    constructor(on_completion_callback = undefined) {
        super();
        this.type = Types.Altitude;


        this.correct_command = "altitude";

        // Get random altitude from 500 to 9999
        this.correct_value = Math.floor(Math.random() * 9999) + 500;
        this.task_instruction = `Set altitude to ${this.correct_value}.`;
        this.task_complete_text = "'s altitude was changed successfully."
    }

    ValidateCommand(command) {
        if(command.split(" ").length == 2) {
            let [task, value] = command.split(" ");
            return task.toLowerCase() == this.correct_command && parseInt(value) == this.correct_value;
        }
        else 
            return false;
    }
}

export class HeadingTask extends Task {
    constructor(on_completion_callback = undefined) {
        super();
        this.type = Types.Heading;

        this.correct_command = "heading";

        // Get random heading from 0 to 360
        this.correct_value = Math.floor(Math.random() * 360);
        this.task_instruction = `Set heading to ${this.correct_value}.`;
        this.task_complete_text = "'s heading was changed."
    }

    ValidateCommand(command) {
        if(command.split(" ").length == 2) {
            let [task, value] = command.split(" ");
            return task.toLowerCase() == this.correct_command && parseInt(value) == this.correct_value;
        }
        else 
            return false;
    }
}

export class LandingTask extends Task {
    constructor(on_completion_callback = undefined) {
        super();
        this.type = Types.Landing;

        let random_value = Math.round(Math.random());

        this.correct_command = "landing";

        if(random_value == 0) {
            this.correct_value = "Deny";
            this.task_complete_text = "'s landing was denied!";
        }
        else {
            this.correct_value = "Permit";
            this.task_complete_text = " has landed without issue!";
        }

        this.task_instruction = `${this.correct_value} landing.`
        
        
    }

    ValidateCommand(command) {
        if(command.split(" ").length == 3) {
            let [value, task, airport] = command.split(" ");
            return value.toLowerCase() == this.correct_value.toLowerCase() && task == this.correct_command.toLowerCase() && airport.toLowerCase() == "hel";
        }
        else 
            return false;
    }
}

export class TakeoffTask extends Task {
    constructor(on_completion_callback = undefined) {
        super();
        this.type = Types.Takeoff;


        let random_value = Math.round(Math.random());

        this.correct_command = "takeoff";

        if(random_value == 0) {
            this.correct_value = "Deny";
            this.task_complete_text = "'s takeoff request was denied!";
        }
        else {
            this.correct_value = "Permit";
            this.task_complete_text = " is on route to her destination!";
        }

        this.task_instruction = `${this.correct_value} takeoff.`
        
        
    }

    ValidateCommand(command) {
        if(command.split(" ").length == 3) {
            let [value, task, airport] = command.split(" ");
            return value.toLowerCase() == this.correct_value.toLowerCase() && task == this.correct_command.toLowerCase() && airport.toLowerCase() == "hel";
        }
        else 
            return false;
    }
}