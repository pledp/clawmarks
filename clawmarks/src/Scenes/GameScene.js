import CRTShader from "../../assets/shaders/CRTShader.js";
import TimedGameMode from "../Mechanics/GameModes/TimedGameMode.js"
import FlightPin from "../UI/FlightPin.js"
import { Types } from "../Mechanics/Tasks.js"
import LogItem from "../UI/LogItem.js"

import { Vector2, SnapToGrid } from "../Clawmarks.js";
import GameConfig from "../Clawmarks.js";


export default class GameScene extends Phaser.Scene
{
    constructor() {
        super({key: "GameScene"});
    }

    init(data) {
        this.game_mode = new data.GameMode(this.Log.bind(this));
        this.game_mode.AddTaskListener(this.AddTaskWidget.bind(this));
    }

    update(time, delta) {
        this.blink_timer += delta / 1000;
        if(this.blink_timer >= 1) {
            this.text_cursor.visible = !this.text_cursor.visible;
            this.blink_timer = 0;
        }

        
        
        if(this.game_mode.is_playing) {
            this.game_mode.Update(this, time, delta);

            this.timer.text = this.game_mode.GetTime();
            this.points_text.text = `${parseInt(this.points)}p   ${this.eco_points}ep`;
        }
        else
            this.EndGame();

        this.points_text.text = `${this.points}p  ${this.eco_points}ep`;
        
        // Move planes on map
        for(let i = 0; i < this.flights_to_be_moved.length; i++) {
            
            this.flights_to_be_moved[i].UpdateEnding(delta, this);

            if(this.flights_to_be_moved[i].t >= 1) {
                this.flights_to_be_moved.splice(i, 1);
            }
        }
        
        this.log_timer += delta / 1000
        
        if(this.log_timer >= 0.01) {
            for(let i = 0; i < this.log.length; i++) {
                if(this.log[i].cur_index < this.log[i].item.message.length) {
                    this.log[i].text += this.log[i].item.message[this.log[i].cur_index];
                    this.log[i].cur_index++;
                }
            }

            this.log_timer = 0;
        }
        
        if(Phaser.Input.Keyboard.JustDown(this.up_key) && this.cur_task > 0) {
            this.MoveCursor(this.cur_task - 1);
        }
        else if(Phaser.Input.Keyboard.JustDown(this.down_key) && this.cur_task < this.tasks_container.list.length - 1) {
            this.MoveCursor(this.cur_task + 1);
        }
        if(Phaser.Input.Keyboard.JustDown(this.esc_key)) {
            this.EndGame();
        }
    }

    async preload() {
        this.load.image('map', "assets/world-map.png");
        this.load.image('airplane', "assets/airplane.png");

        this.load.audio('task-success', 'assets/sounds/task-success.wav');
        this.load.audio('task-fail', 'assets/sounds/task-fail.mp3');
        this.load.audio('new-task', 'assets/sounds/new-task.wav');
        this.load.audio('plane-crash', 'assets/sounds/plane-crash.wav');
        this.load.audio('game-start', 'assets/sounds/game-start.mp3');

        this.load.aseprite("explosion", "assets/explosion.png", "assets/explosion.json")
    }

    create()
    {

        this.flights_to_be_moved = [];
        this.log = [];
        this.log_arrows = [];
        this.log_timer = 0;

        this.t = 0

        this.home_x = 10.90;
        this.home_y = 63.44;

        
        this.cur_task = 0;
        this.num_of_fails = 0;

        this.points = 0;
        this.eco_points = 0;

        this.blink_timer = 0;

        // Set map width to 1400.
        this.map = this.add.sprite(0, 0, 'map').setOrigin(0,0);
        this.map.scale = 4.66666666667;

        let home_x = (this.home_x + 180) * (this.map.displayWidth / 360);
        let home_y = this.map.displayHeight - ((this.home_y + 90) * (this.map.displayHeight / 180));

        this.cursor_x = this.add.rectangle((Math.floor(home_x / 20) * 20), this.map.displayHeight / 2, 30, this.map.displayHeight, 0xFF004D, 0.5);
        this.cursor_y = this.add.rectangle(this.map.displayWidth / 2, (Math.floor(home_y / 20) * 20), this.map.displayWidth, 30, 0xFF004D, 0.5);

        this.AddAirportPin(new Vector2(this.home_x, this.home_y));


        this.up_key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        this.down_key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        this.esc_key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

        if(!this.anims.exists("explosion"))
            this.anims.createFromAseprite("explosion")

        // Toista käynnistysääni
        //this.sound.play('game-start');

        // Pelin alustuksen jatkaminen
        //this.setupGame();

        // Start gamemode

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

        if(GameConfig.UseShader)
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

            list[this.cur_task].pin.HighlightPins(0x000000, 0x5f574f);
        }

        // If element we're moving to exists
        if(list[to]) {
            list[to].x = list[to].x - 50;

            list[to].list[0].fillColor = 0x00E436;
            
            list[to].is_highlighted = true;

            list[to].pin.HighlightPins(0x00E436);
            
            this.cursor_x.x = SnapToGrid(list[to].pin.GetPinToHighlight().x, 20);
            this.cursor_y.y = SnapToGrid(list[to].pin.GetPinToHighlight().y, 20);
        }

        this.cur_task = to;
    }

    // Remove task

    HandleCommand(command) {
        let list = this.tasks_container.list;

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
            if(this.num_of_fails >= 3 && this.game_mode.remove_task_on_crash) {
                switch(this.game_mode.tasks[this.cur_task].type) {
                    case Types.Fire:
                        this.Log(new LogItem("FIRE has... crashed?.", 0xFF004D));
                        this.points -= 10;
                        break;
                    default:
                        this.Log(new LogItem("CRASH!", 0xFF004D));
                        list[this.cur_task].pin.SetCrashCurve();
                        this.points -= 3;
                        break;
                }

                this.RemoveTask();
                this.MoveCursor(0);

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

        if(list[this.cur_task].pin.flight_pin) {
            this.flights_to_be_moved.push(list[this.cur_task].pin)
        }
        else {
            list[this.cur_task].pin.CleanUp();
        }

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

        if(flight_task.log_on_init) {
            this.Log(flight_task.log_on_init)
        }


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


        if(flight_task.draw_pin) 
            task.pin = this.AddAirportPin(new Vector2(flight_task.lon, flight_task.lat), new Vector2(this.home_x, this.home_y), flight_task.draw_flight);
        
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
        return (Math.round((pixel / grid_element_size) + padding) * grid_element_size)
    }

    AddAirportPin(from, to = undefined, draw_flight = false) {
        // Create airport pin on map

        if(!to)
            to = from;

        let flight = new FlightPin(from, to, this.map);        
        let pin = this.add.rectangle(SnapToGrid(flight.from.x, 20), SnapToGrid(flight.from.y, 20), 20, 20, 0x000000, 1);
        flight.airport_pin = pin;

        // Draw flight if needed
        if(draw_flight) {
            const points = flight.curve.getPoints(16);

            let points_container = this.add.container(0, 0);

            for(let i = 0; i < points.length; i++) {
                let dot = new Phaser.GameObjects.Rectangle(this, SnapToGrid(points[i].x, 20), SnapToGrid(points[i].y, 20), 5, 5, 0x5f574f, 1);
                points_container.add(dot);
            }

            flight.points_container = points_container;

            flight.t = Math.random();

            let flight_on_curve = this.add.sprite(SnapToGrid(flight.GetOnCurve(flight.t).x, 20), SnapToGrid(flight.GetOnCurve(flight.t).y, 20), "airplane");

            if(flight.to.x < flight.from.x) 
                flight_on_curve.setFlipY(true);
            

            flight_on_curve.scale = Math.random() * 2 + 0.8;

            flight_on_curve.angle = flight.SnapAngle(flight.GetAngle(), 45);
            flight.flight_pin = flight_on_curve;

            return flight;
        }

        return flight;


    }

    Log(log_item) {
        if(this.log.length >= 10) {
            this.log[0].destroy();
            this.log.splice(0, 1);
            this.log_arrows[0].destroy();
            this.log_arrows.splice(0, 1);
        }

        let offset = log_item.height * 22 + 40;
        for(let i = 0; i < this.log.length; i++) {
            this.log[i].y -= offset;
            this.log_arrows[i].y -= offset;
        }

        this.log_arrows.push(this.add.bitmapText(0, this.game.config.height - 80 - log_item.height * 22, 'PixelFont', `>`, 20).setTint(log_item.color).setLineSpacing(2))
        this.log.push(this.add.bitmapText(30, this.game.config.height - 80 - log_item.height * 22, 'PixelFont', `${""}`, 20).setTint(log_item.color).setLineSpacing(2))

        this.log[this.log.length - 1].cur_index = 0;
        this.log[this.log.length - 1].item = log_item;
    }
}