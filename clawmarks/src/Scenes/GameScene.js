import TimedGameMode from "../Mechanics/GameModes/TimedGameMode.js"

export default class GameScene extends Phaser.Scene
{
    constructor() {
        super({key: "GameScene"});
    }

    update(time, delta) {
        if(Phaser.Input.Keyboard.JustDown(this.up_key) && this.cur_task > 0) {
            this.MoveCursor(this.cur_task - 1);
        }
        else if(Phaser.Input.Keyboard.JustDown(this.down_key) && this.cur_task < this.tasks_container.list.length - 1) {
            this.MoveCursor(this.cur_task + 1)
        }

        this.game_mode.Update(time, delta);
    }

    create ()
    {
        
        this.up_key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        this.down_key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);

        // Tasks GUI
        this.tasks_container = this.add.container(0, 0);

        this.cur_task = 0;

        this.game_mode = new TimedGameMode(this.AddTaskWidget.bind(this));
        
        // Input fields
        const input_text = this.add.bitmapText(0, this.game.config.height - 20, 'PixelFont', '>', 20);
        const input_field = this.add.bitmapText(input_text.width, this.game.config.height - 20, 'PixelFont', "", 20);

        // Input field imput
        this.input.keyboard.on('keydown', event =>
        {
            // Submit command
            if(event.keyCode === Phaser.Input.Keyboard.KeyCodes.ENTER) {
                if(this.game_mode.tasks[this.cur_task].ValidateCommand(input_field.text)) {
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
        let list = this.tasks_container.list;

        list[this.cur_task].list[0].fillColor = 0xfff1e8
        list[this.cur_task].x = this.game.config.width - 400 - 8;

        list[to].x = list[to].x - 50;

        list[to].list[0].fillColor = 0xff003d;

        this.cur_task = to;
    }

    // Remove task
    RemoveTask() {
        let list = this.tasks_container.list

        this.game_mode.tasks.splice(this.cur_task, 1);
        this.tasks_container.removeAt(this.cur_task, true);
        
        for(let i = this.cur_task; i < list.length; i++) {
            list[i].y -= 128 + 16;
        }

        this.padding -= 16;
    }

    AddTaskWidget(spot = null) {
        let flight_task = this.game_mode.tasks[this.game_mode.tasks.length - 1];

        if(spot != null) 
            flight_task = this.game_mode.tasks[spot];
        else 
            spot = this.tasks_container.list.length;


        // Container for individual task
        let task = this.add.container(this.game.config.width - 400 - 8, (spot - 1) * 128 + 16 + spot * 16);

        // Background for task
        let border = new Phaser.GameObjects.Rectangle(this, 200, 64, 400, 128, 0xfff1e8, 1);
        let rect = new Phaser.GameObjects.Rectangle(this, 200, 64, 390, 118, 0x000000, 1);

        let flight_text = new Phaser.GameObjects.BitmapText(this, 16, 16, 'PixelFont', `${flight_task.airliner}${flight_task.flight_number}`, 30);
        let airport_text = new Phaser.GameObjects.BitmapText(this, 16, flight_text.height + 16, 'PixelFont', `${flight_task.origin_airport} -> ${flight_task.destination_airport}`, 20);
        let task_text = new Phaser.GameObjects.BitmapText(this, 16,  128 - 30, 'PixelFont', `${flight_task.task.task_instruction}`, 16);


        // Set text color
        flight_text.setTint(0xfff1e8);
        airport_text.setTint(0xfff1e8);
        task_text.setTint(0xfff1e8);


        task.add(border);
        task.add(rect);
        task.add(flight_text);
        task.add(airport_text);
        task.add(task_text);

        if(spot != null)
            this.tasks_container.addAt(task, spot);
        else
            this.tasks_container.add(task);

        // If first element, highlight
        if(this.tasks_container.list.length == 1) {
            this.MoveCursor(0);
        }

        // Handle insert to above current highlighted task
        for(let i = spot; i < this.tasks_container.list.length; i++) {
            this.tasks_container.list[i].y += 128 + 16;
        }

        // If inserted element is above other tasks, move other tasks
        if(spot <= this.cur_task && this.tasks_container.list.length > 1) {
            this.cur_task += 1;
        }

        this.padding += 16
    }
}