import TimedGameMode from "../Mechanics/GameModes/TimedGameMode.js"

export default class GameScene extends Phaser.Scene
{
    constructor() {
        super({key: "GameScene"});
    }

    preload ()
    {
        this.game_mode = new TimedGameMode();
        this.tasks = [];

        for(let i = 0; i < 10; i++) {
            this.game_mode.AddTask(this.tasks);
        }
    }

    update() {
        
    }

    create ()
    {
        /*
        const graphics = this.add.graphics();

        graphics.fillStyle(0xffff00, 1);
        graphics.fillRect(0, 100, this.game.config.width -10, 200);
        */

        for(let i = 0; i < this.tasks.length; i++) {
            let text = this.add.bitmapText(0, 50 + i * 50, 'PixelFont', this.tasks[i].print_task);
            text.setTint(0xff0000);
        }

        this.add.bitmapText(0, 0, 'PixelFont', 'GameScene');

    }
}