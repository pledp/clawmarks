export default class TextField {
    static active = null;

    constructor(text) {
        this.text = text;
    }

    create(scene, x, y, font_size) {
        // Draw button and make it interactive
        this.text_field = scene.add.bitmapText(x, y, "PixelFont", this.text, font_size);

        scene.input.keyboard.on('keydown', event =>
        {
            if(TextField.active == this) {
                // Submit command
                if(event.keyCode === Phaser.Input.Keyboard.KeyCodes.ENTER) {

                }

                if (event.keyCode === 8 && this.text_field.text.length > 0) 
                    this.text = this.text.substr(0, this.text.length - 1);
                else if (event.keyCode === 32 || (event.keyCode >= 48 && event.keyCode <= 90))
                    this.text += event.key;

                this.text_field.text = this.text;
            }
        });

        this.text_field.setInteractive();

        this.text_field.on("pointerdown", () => {
            TextField.active = this;
        });
    }
}