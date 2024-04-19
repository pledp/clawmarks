export default class TitleScene extends Phaser.Scene
{
    constructor() {
        super({key: "TitleScene"});
    }

    preload ()
    {
        this.load.bitmapFont("PixelFont", "assets/fonts/PixelFont.png", "assets/fonts/PixelFont.xml");
    }

    create ()
    {
        this.scene.start("LoginScene");

    }
}