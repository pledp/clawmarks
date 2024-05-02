import CRTShader from "../../assets/shaders/CRTShader.js";
import TimedGameMode from "../Mechanics/GameModes/TimedGameMode.js"
import FlightPin from "../UI/FlightPin.js"
import { Types } from "../Mechanics/Tasks.js"
import LogItem from "../UI/LogItem.js"

import { Vector2 } from "../Clawmarks.js";


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

        this.points_text.text = `${this.points}p  ${this.eco_points}ep`;

        if(this.t <= 1) {
            this.t += 0.001
        }

        this.flight_on_curve.x = this.SnapToGrid(this.flight.GetOnCurve(this.t).x, 20)
        this.flight_on_curve.y = this.SnapToGrid(this.flight.GetOnCurve(this.t).y, 20)

        this.cursor_x.x = this.SnapToGrid(this.flight_on_curve.x, 20);
        this.cursor_y.y = this.SnapToGrid(this.flight_on_curve.y, 20);


    }

    preload() {
        this.load.image('map', "assets/world-map.png");
    }

    create ()
    {
        this.log = [];
        this.t = 0

        this.map = this.add.sprite(0, 0, 'map').setOrigin(0,0);
        this.map.scale = 4.66666666667;

        this.airport_pins = [];

        let home_x = 10.90;
        let home_y = 63.44;
        this.home_x = (home_x + 180) * (this.map.displayWidth / 360);
        this.home_y = this.map.displayHeight - ((home_y + 90) * (this.map.displayHeight / 180));

        this.cursor_x = this.add.rectangle((Math.floor(this.home_x / 20) * 20), this.map.displayHeight / 2, 30, this.map.displayHeight, 0xFF004D, 0.7);
        this.cursor_y = this.add.rectangle(this.map.displayWidth / 2, (Math.floor(this.home_y / 20) * 20), this.map.displayWidth, 30, 0xFF004D, 0.7);

        this.AddAirportPin(home_x, home_y);
        this.AddAirportPin(-118.24, -60.05, true);




        this.up_key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        this.down_key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);

        // Tasks GUI

        this.cur_task = 0;
        this.num_of_fails = 0;

        this.points = 0;
        this.eco_points = 0;

        this.blink_timer = 0;


        this.game_mode = new TimedGameMode(this.AddTaskWidget.bind(this), this.Log.bind(this));
        this.game_mode.StartGame();

        let info_container = this.add.container(this.game.config.width - (this.game.config.width - this.map.displayWidth) + ((this.game.config.width - this.map.displayWidth - 400) / 2), 16);

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

        let tasks_text = this.add.bitmapText(this.game.config.width - (this.game.config.width - this.map.displayWidth) + ((this.game.config.width - this.map.displayWidth) / 2) - 2.5 * 20, 170, 'PixelFont', "TASKS\n-----", 20)
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

            list[this.cur_task].x = this.game.config.width - list[this.cur_task].max_width;
            
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

    HandleCommand(command) {
        if(this.game_mode.tasks[this.cur_task]) {
            if(this.game_mode.tasks[this.cur_task].ValidateCommand(command)) {
                this.Log(new LogItem(this.game_mode.tasks[this.cur_task].task_complete_text, 0x00E436));
                this.game_mode.OnCompletion(this.cur_task);
                this.points += this.game_mode.tasks[this.cur_task].points_to_award;


                this.RemoveTask();
                this.MoveCursor(0);
            }

            // On fail
            else {
                this.Log(new LogItem("Faulty command!", 0xFF004D));

                this.num_of_fails += 1;
                this.game_mode.OnFail();
            }

            // On crash
            if(this.num_of_fails >= 3) {
                switch(this.game_mode.tasks[this.cur_task].type) {
                    case Types.Fire:
                        this.Log(new LogItem("HEL'S FIRE HAS SPREAD.", 0xFF004D));
                        this.points -= 10;
                        break;
                    default:
                        this.Log(new LogItem("CRASH!", 0xFF004D));
                        this.points -= 3;
                        break;
                }

                this.RemoveTask();

                this.eco_points += 1;

                this.game_mode.OnCrash();
                this.num_of_fails = 0;
            }
        }
        else {
            this.Log(new LogItem("No planes on the radar!", 0x5F574F));
        }
    }

    RemoveTask() {
        let list = this.tasks_container.list

        this.game_mode.tasks.splice(this.cur_task, 1);
        this.tasks_container.removeAt(this.cur_task, true);
        
        for(let i = this.cur_task; i < list.length; i++) {
            list[i].y -= 128 + 16;
        }
    }

    AddTaskWidget(spot = null) {
        let flight_task = this.game_mode.tasks[this.game_mode.tasks.length - 1];

        if(spot != null) 
            flight_task = this.game_mode.tasks[spot];
        else 
            spot = this.tasks_container.list.length;


        // Container for individual task
        let max_width = Math.max(flight_task.task_instruction.length * 16 + 16, 400);
        let task = this.add.container(this.game.config.width - max_width, (spot - 1) * 128 + spot * 16);
        task.is_highlighted = false;

        task.max_width = max_width;

        // Background for task
        let border = new Phaser.GameObjects.Rectangle(this, 0, 0, max_width + 100, 128, 0xfff1e8, 1).setOrigin(0, 0);
        let rect = new Phaser.GameObjects.Rectangle(this, 5, 5, max_width + 100, 118, 0x000000, 1).setOrigin(0, 0);
        
        let flight_text = new Phaser.GameObjects.BitmapText(this, 16, 16, 'PixelFont', flight_task.GetHeader(), 30);
        let airport_text = new Phaser.GameObjects.BitmapText(this, 16, flight_text.height + 16, 'PixelFont', flight_task.GetSecondHeader(), 20);
        let task_text = new Phaser.GameObjects.BitmapText(this, 16,  128 - 30, 'PixelFont', flight_task.GetDescription(), 16);
        let point_text = new Phaser.GameObjects.BitmapText(this, max_width - (flight_task.points_to_award.toString().length + 2) * 16, 16, 'PixelFont', `${flight_task.points_to_award}p`, 16);

        task.add(border);
        task.add(rect);
        task.add(flight_text);
        task.add(airport_text);
        task.add(task_text);
        task.add(point_text);

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

    AddAirportPin(lat, lon, draw_flight = false) {
        this.flight = new FlightPin(new Vector2(lat, lon), new Vector2(this.home_x, this.home_y), this.map);        
        const pin = this.add.rectangle(this.SnapToGrid(this.flight.from.x, 20), this.SnapToGrid(this.flight.from.y, 20), 20, 20, 0x000000, 1);

        if(draw_flight) {
            this.flight_on_curve = this.add.rectangle(this.SnapToGrid(this.flight.GetOnCurve(0.20).x, 20), this.SnapToGrid(this.flight.GetOnCurve(0.20).y, 20), 20, 20, 0x000000, 1);
        }
    }

    Log(log_item) {
        if(this.log.length >= 10) {
            this.log[0].visible = false;
            this.log.splice(0, 1);
        }

        for(let i = 0; i < this.log.length; i++) {
            this.log[i].y -= 30;
        }

        this.log.push(this.add.bitmapText(0, this.game.config.height - 80, 'PixelFont', `> ${log_item.message}`, 20).setTint(log_item.color))
        
    }
}