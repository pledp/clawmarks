export default class GameScene extends Phaser.Scene
{
    constructor() {
        super({key: "GameScene"});
    }

    preload ()
    {


    }

    create ()
    {
        const graphics = this.add.graphics();

        graphics.fillStyle(0xffff00, 1);
        graphics.fillRect(0, 100, this.game.config.width -10, 200);

        this.add.bitmapText(0, 0, 'PixelFont', 'GameScene');

    }
}