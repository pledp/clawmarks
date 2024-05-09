export default class TextField {
    static active = null;

    constructor(text = "", write_callback = null, new_field_callback = null) {
        this.text = text;
        
        if(write_callback)
            this.write_callback = write_callback;

        if(new_field_callback)
            this.new_field_callback = new_field_callback;
    }

    create(scene, x, y, font_size) {
        this.hitbox = scene.add.rectangle(x - 8, y - 8, Math.max(this.text.length * font_size, 128) + 8, font_size + 8, 0x5f574f, 0.5).setOrigin(0, 0);
        this.hitbox.setInteractive();


        // Draw button and make it interactive

        this.text_field = scene.add.bitmapText(x, y, "PixelFont", this.text, font_size);
        this.text_field.setInteractive();

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

                if(this.write_callback)
                    this.write_callback(this);

                this.hitbox.displayWidth = Math.max(this.text.length * font_size, 128) + 8;
            }
        });

        
        this.hitbox.on("pointerdown", () => {
            this.ChangeActiveField();
        });

        this.text_field.on("pointerdown", () => {
            this.ChangeActiveField();
        });
    }

    ChangeActiveField() {
        this.new_field_callback(this);

        if(TextField.active)
            TextField.active.hitbox.fillColor = 0x5f574f;
        TextField.active = this;
        this.hitbox.fillColor = 0x008751;
    }
}