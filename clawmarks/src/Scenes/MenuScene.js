export default class MenuScene extends Phaser.Scene
{
    constructor() {
        super({key: "MenuScene"});
    }

    preload ()
    {


    }

    create ()
    {
        this.add.bitmapText(0, 0, 'PixelFont', 'Lorem ipsum\ndolor sit amet');

    }
}