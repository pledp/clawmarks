import CRTShader from "../../assets/shaders/CRTShader.js";
import TimedGameMode from "../Mechanics/GameModes/TimedGameMode.js"


export default class GameScene extends Phaser.Scene
{
    constructor() {
        super({key: "GameScene"});
        
    }

    update(time, delta) {
        this.blink_timer += delta / 1000;
        if(this.blink_timer >= 1) {
            this.text_cursor.visible = !this.text_cursor.visible;
            this.blink_timer = 0;
        }

        if(Phaser.Input.Keyboard.JustDown(this.up_key) && this.cur_task > 0) {
            this.MoveCursor(this.cur_task - 1);
        }
        else if(Phaser.Input.Keyboard.JustDown(this.down_key) && this.cur_task < this.tasks_container.list.length - 1) {
            this.MoveCursor(this.cur_task + 1);
        }

        if(this.game_mode.is_playing) {
            this.game_mode.Update(this, time, delta);

            this.timer.text = this.game_mode.GetTime();
            this.points_text.text = `${parseInt(this.points)}p   ${this.eco_points}ep`;
        }
        else
            this.EndGame();
    }

    preload() {
        this.load.image('map', "assets/world-map.jpg");
    }

    create ()
    {
        const map = this.add.sprite(32, 32, 'map').setOrigin(0,0);
        map.scale = 0.7;

        let pixel_x = (10.90 + 180) * (map.displayWidth / 360);
        let pixel_y = map.displayHeight - ((63.44 + 90) * (map.displayHeight / 180));
        
        let pixel_x2 = (-118.24 + 180) * (map.displayWidth / 360);
        let pixel_y2 = map.displayHeight - ((34.05 + 90) * (map.displayHeight / 180));

        this.add.rectangle(32 + (Math.floor(pixel_x2 / 20) * 20), 32 + map.displayHeight / 2, 30, map.displayHeight, 0xFF004D, 0.5);
        this.add.rectangle(32 + map.displayWidth / 2, 32 + (Math.floor(pixel_y2 / 20) * 20), map.displayWidth, 30, 0xFF004D, 0.5);

        const pin = this.add.rectangle(32 + this.SnapToGrid(pixel_x, 20), 32 + this.SnapToGrid(pixel_y, 20), 20, 20, 0x000000, 1);
        const pin2 = this.add.rectangle(32 + this.SnapToGrid(pixel_x2, 20), 32 + this.SnapToGrid(pixel_y2, 20), 20, 20, 0x000000, 1);
        let pixel_x3 = (pixel_x - pixel_x2);
        let pixel_y3 = (pixel_y - pixel_y2);


        const startPoint = new Phaser.Math.Vector2(pixel_x2, pixel_y2);
        const controlPoint1 = new Phaser.Math.Vector2(pixel_x2 + (pixel_x3 * 0.3), pixel_y2 + (pixel_y3 * 0.3) - 100);
        const controlPoint2 = new Phaser.Math.Vector2(pixel_x2 + (pixel_x3 * 0.6), pixel_y2 + (pixel_y3 * 0.6) - 100);

        const endPoint = new Phaser.Math.Vector2(pixel_x, pixel_y);

        const curve = new Phaser.Curves.CubicBezier(startPoint, controlPoint1, controlPoint2, endPoint);
        const pointOnCurve = new Phaser.Math.Vector2();


        curve.getPoint(0.5, pointOnCurve);
        console.log(pointOnCurve);


        const pin3 = this.add.rectangle(32 + this.SnapToGrid(pointOnCurve.x, 20), 32 + this.SnapToGrid(pointOnCurve.y, 20), 20, 20, 0x000000, 1);




        
        this.up_key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        this.down_key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);

        // Tasks GUI

        this.cur_task = 0;
        this.consecutive_fails = 0;

        this.points = 0;
        this.eco_points = 0;

        this.blink_timer = 0;


        this.game_mode = new TimedGameMode(this.AddTaskWidget.bind(this));
        this.game_mode.StartGame();

        let info_container = this.add.container(this.game.config.width - 400 - 8, 16);

        let border = new Phaser.GameObjects.Rectangle(this, 200, 64, 400, 128, 0xC2C3C7, 1);
        let rect = new Phaser.GameObjects.Rectangle(this, 200, 64, 390, 118, 0x000000, 1);

        info_container.add(border);
        info_container.add(rect);

        let mode_name = new Phaser.GameObjects.BitmapText(this, 400 - this.game_mode.mode_name.length * 20 - 16, 16, 'PixelFont', this.game_mode.mode_name, 20);
        this.timer = new Phaser.GameObjects.BitmapText(this, 16, 16, 'PixelFont', this.game_mode.GetTime(), 30);
        this.timer.setTint(0x5F574F)
        this.points_text = new Phaser.GameObjects.BitmapText(this, 16, 80, 'PixelFont', `${this.points}p  ${this.eco_points}ep`, 20);

        info_container.add(mode_name);
        info_container.add(this.timer);
        info_container.add(this.points_text);

        this.tasks_container = this.add.container(0, 200);

        let tasks_text = this.add.bitmapText(this.game.config.width - 200 - 8 - 2.5 * 20, 170, 'PixelFont', "TASKS\n-----", 20)
        tasks_text.setTint(0x5F574F)

        
        // Input fields
        const input_text = this.add.bitmapText(0, this.game.config.height - 26, 'PixelFont', '>', 25);
        const input_field = this.add.bitmapText(input_text.width, this.game.config.height - 26, 'PixelFont', "", 25);

        this.text_cursor = this.add.rectangle(input_field.x + input_field.width + 8, this.game.config.height - 13, 10, 25, 0xfff1e8, 1);

        // Input field imput
        this.input.keyboard.on('keydown', event =>
        {
            // Submit command
            if(event.keyCode === Phaser.Input.Keyboard.KeyCodes.ENTER) {
                this.HandleCommand(input_field.text);
                
                input_field.text = "";
            }

            if (event.keyCode === 8 && input_field.text.length > 0) 
                input_field.text = input_field.text.substr(0, input_field.text.length - 1);
            else if (event.keyCode === 32 || (event.keyCode >= 48 && event.keyCode <= 90))
                input_field.text += event.key;

            this.text_cursor.x = input_field.x + input_field.width + 8;

        });



        this.cameras.main.setPostPipeline(CRTShader);

    }

    EndGame() {
        this.scene.start("MenuScene");
    }

    // Move task cursor
    MoveCursor(to) {
        let list = this.tasks_container.list;

        // If element we're moving away from exists
        if(list[this.cur_task] && list[this.cur_task].is_highlighted) {
            list[this.cur_task].list[0].fillColor = 0xfff1e8
            list[this.cur_task].x = this.game.config.width - 400 - 8;
            list[this.cur_task].is_highlighted = false;
        }

        // If element we're moving to exists
        if(list[to]) {
            list[to].x = list[to].x - 50;

            list[to].list[0].fillColor = 0x00E436;
            
            list[to].is_highlighted = true;
        }

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
    }

    HandleCommand(command) {
        if(this.game_mode.tasks[this.cur_task]) {
            if(this.game_mode.tasks[this.cur_task].ValidateCommand(command)) {
                this.RemoveTask();
                this.MoveCursor(0);
                this.game_mode.OnCompletion();
            }

            // On fail
            else {
                this.consecutive_fails += 1;
                this.game_mode.OnFail();
            }

            // On crash
            if(this.consecutive_fails >= 3) {
                this.game_mode.OnCrash();
                this.consecutive_fails = 0;
            }
        }
    }

    AddTaskWidget(spot = null) {
        let flight_task = this.game_mode.tasks[this.game_mode.tasks.length - 1];

        if(spot != null) 
            flight_task = this.game_mode.tasks[spot];
        else 
            spot = this.tasks_container.list.length;


        // Container for individual task
        let task = this.add.container(this.game.config.width - 400 - 8, (spot - 1) * 128 + spot * 16);
        task.is_highlighted = false;


        // Background for task
        let border = new Phaser.GameObjects.Rectangle(this, 200, 64, 400, 128, 0xfff1e8, 1);
        let rect = new Phaser.GameObjects.Rectangle(this, 200, 64, 390, 118, 0x000000, 1);

        let flight_text = new Phaser.GameObjects.BitmapText(this, 16, 16, 'PixelFont', `${flight_task.airliner}${flight_task.flight_number}`, 30);
        let airport_text = new Phaser.GameObjects.BitmapText(this, 16, flight_text.height + 16, 'PixelFont', `${flight_task.origin_airport} -> ${flight_task.destination_airport}`, 20);
        let task_text = new Phaser.GameObjects.BitmapText(this, 16,  128 - 30, 'PixelFont', `${flight_task.task.task_instruction}`, 16);

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

    SnapToGrid(pixel, grid_element_size, padding = 0) {
        return (Math.floor((pixel / grid_element_size) + padding) * grid_element_size)
    }
}