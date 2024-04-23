import TimedGameMode from "../Mechanics/GameModes/TimedGameMode.js"

export default class GameScene extends Phaser.Scene
{
    constructor() {
        super({key: "GameScene"});
    }

    preload ()
    {
        this.cur_task = 0;

        this.game_mode = new TimedGameMode();
        this.tasks = [];

        for(let i = 0; i < 10; i++) {
            this.game_mode.AddTask(this.tasks);
        }
    }

    update() {
        if(Phaser.Input.Keyboard.JustDown(this.up_key) && this.cur_task > 0) {
            this.MoveCursor(this.cur_task - 1);
        }
        if(Phaser.Input.Keyboard.JustDown(this.down_key) && this.cur_task < this.tasks_container.list.length - 1) {
            this.MoveCursor(this.cur_task + 1)
        }
    }

    create ()
    {
        this.up_key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        this.down_key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);

        // Tasks GUI
        this.tasks_container = this.add.container(0, 0);
        let padding = 0;
        for(let i = 0; i < this.tasks.length; i++) {

            if(i > 0)
                padding += 16;

            // Container for individual task
            let task = this.add.container(this.game.config.width - 400 - 8, i * 128 + 16 + padding);

            // Background for task
            let border = new Phaser.GameObjects.Rectangle(this, 200, 64, 400, 128, 0xfff1e8, 1);
            let rect = new Phaser.GameObjects.Rectangle(this, 200, 64, 390, 118, 0x000000, 1);

            let flight_text = new Phaser.GameObjects.BitmapText(this, 16, 16, 'PixelFont', `${this.tasks[i].airliner}${this.tasks[i].flight_number}`, 30);
            let airport_text = new Phaser.GameObjects.BitmapText(this, 16, flight_text.height + 16, 'PixelFont', `${this.tasks[i].origin_airport} -> ${this.tasks[i].destination_airport}`, 20);
            let task_text = new Phaser.GameObjects.BitmapText(this, 16,  128 - 30, 'PixelFont', `${this.tasks[i].task.task_instruction}`, 16);


            // Set text color
            flight_text.setTint(0xfff1e8);
            airport_text.setTint(0xfff1e8);
            task_text.setTint(0xfff1e8);


            task.add(border);
            task.add(rect);
            task.add(flight_text);
            task.add(airport_text);
            task.add(task_text);

            this.tasks_container.add(task);
        }
        
        // Input fields
        const input_text = this.add.bitmapText(0, this.game.config.height - 16, 'PixelFont', '>', 16);
        const input_field = this.add.bitmapText(input_text.width, this.game.config.height - 16, 'PixelFont', "", 16);

        // Input field imput
        this.input.keyboard.on('keydown', event =>
        {
            // Submit command
            if(event.keyCode === Phaser.Input.Keyboard.KeyCodes.ENTER) {
                if(this.tasks[this.cur_task].ValidateCommand(input_field.text)) {
                    this.RemoveTask();
                    this.MoveCursor(0);
                }
                
                input_field.text = "";
            }

            if (event.keyCode === 8 && input_field.text.length > 0)
                input_field.text = input_field.text.substr(0, input_field.text.length - 1);
            else if (event.keyCode === 32 || (event.keyCode >= 48 && event.keyCode <= 90))
                input_field.text += event.key;
        });
    }

    // Move task cursor
    MoveCursor(to) {
        this.cur_task = to;
    }

    // Remove task
    RemoveTask() {
        let list = this.tasks_container.list

        this.tasks.splice(this.cur_task, 1);
        this.tasks_container.removeAt(this.cur_task, true);
        
        for(let i = this.cur_task; i < list.length; i++) {
            list[i].y -= 128 + 16;
        }
    }
}