// Abstract base for task 
export class Task {
    #task_complete_text;
    #correct_command;
    #correct_value;
    #task_instruction;
    #task_on_completion;

    constructor() {
        this.print_task = "";
    }

    // Validate input command, check if it is correct
    ValidateCommand(command) {};

    GetCompleteText() {
        return this.#task_complete_text;
    }
    OnCompletion() {};
}

export class FireTask extends Task {
    constructor() {
        super();

        this.correct_command = "fire";

        let runway = Math.floor(Math.random() * 5) + 1;
        this.correct_value = runway;
        this.task_instruction = `Put out the fire on runway ${runway}.`;
        this.print_task = this.task_instruction;
        this.task_complete_text = "Fire successfully put out."
    }

    ValidateCommand(command) {
        if(command.split(" ").length == 3) {
            let [task, runway, value] = command.split(" ");
            return task.toLowerCase() == this.correct_command && runway.toLowerCase() == "runway" && parseInt(value) == this.correct_value;
        }
        else 
            return false;
    }
}

export class AltitudeTask extends Task {
    constructor() {
        super();

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
    constructor() {
        super();

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
    constructor() {
        super();
        let random_value = Math.round(Math.random());

        this.correct_command = "landing";

        if(random_value == 0) {
            this.correct_value = "Deny";
            this.task_complete_text = "'s landing was denied!";
        }
        else {
            this.correct_value = "Permit";

            random_value = Math.random();
            if(random_value >= 0.98)
                this.task_complete_text = `'s landing has resulted in an accident. ${Math.floor(Math.random() * 100) + 10} people were involved in the accident.`;
            
            else if(random_value >= 0.90)
                this.task_complete_text = `'s landing has resulted in an accident. ${Math.floor(Math.random() * 100) + 10} people were involved in the accident.`;

            else
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
    constructor() {
        super();
        let random_value = Math.round(Math.random());

        this.correct_command = "takeoff";

        if(random_value == 0) {
            this.correct_value = "Deny";
            this.task_complete_text = "'s takeoff request was denied!";
        }
        else {
            this.correct_value = "Permit";

            random_value = Math.random();
            if(random_value >= 0.98)
                this.task_complete_text = `'s takeoff has resulted in an accident. ${Math.floor(Math.random() * 100) + 10} people were involved in the accident.`;
            
            else if(random_value >= 0.90)
                this.task_complete_text = `'s takeoff has resulted in an accident. ${Math.floor(Math.random() * 100) + 10} people were involved in the accident.`;

            else
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