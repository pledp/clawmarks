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
        if(Phaser.Input.Keyboard.JustDown(this.down_key) && this.cur_task < this.text_container.list.length - 1) {
            this.MoveCursor(this.cur_task + 1)
        }
    }

    create ()
    {
        this.up_key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        this.down_key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);

        this.text_container = this.add.container(0, 0);

        let padding = 0;

        for(let i = 0; i < this.tasks.length; i++) {

            if(i > 0)
                padding += 8;

            let task_container = this.add.container(i * 230 + 8 + padding, 8);
            let rect = new Phaser.GameObjects.Rectangle(this, 115, 32, 230, 64, 0xfff1e8, 1);
            let flight_text = new Phaser.GameObjects.BitmapText(this, 4, 4, 'PixelFont', `${this.tasks[i].airliner}${this.tasks[i].flight_number}`);
            let airport_text = new Phaser.GameObjects.BitmapText(this, 0, 0, 'PixelFont', `${this.tasks[i].origin_airport} -> ${this.tasks[i].destination_airport}`);

            airport_text = new Phaser.GameObjects.BitmapText(this, 230 - 4 - airport_text.width, 4, 'PixelFont', `${this.tasks[i].origin_airport} -> ${this.tasks[i].destination_airport}`);

            task_container.add(rect);
            task_container.add(flight_text);
            task_container.add(airport_text);

            this.text_container.add(task_container);
        }
        
        const input_text = this.add.bitmapText(0, this.game.config.height - 16, 'PixelFont', '> ');

        const input_field = this.add.bitmapText(input_text.width, this.game.config.height - 16, 'PixelFont', "");

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

    MoveCursor(to) {
        let list = this.text_container.list

        if(list[to])
            list[this.cur_task].clearTint();
        
        list[to].setTint(0xff0000);

        this.cur_task = to;
    }

    RemoveTask() {
        let list = this.text_container.list

        this.tasks.splice(this.cur_task, 1);
        this.text_container.removeAt(this.cur_task, true);
        
        for(let i = this.cur_task; i < list.length; i++) {
            list[i].y -= 25;
        }
    }
}