export default class Button {
    constructor(text, callback = undefined, hover_callback = undefined) {
        this.text = text;

        if(callback)
            this.callback = callback;

        if(hover_callback)
            this.hover_callback = hover_callback;
    }

    create(scene, x, y, font_size, color = 0xffffff) {

        this.button_field = scene.add.bitmapText(x, y, "PixelFont", this.text, font_size);
        

        // Draw button and make it interactive
        this.button_field.setTint(color);
        this.button_field.setInteractive();

        if(this.callback)
            this.button_field.on("pointerdown", () => {
                this.callback(this);
            });

        if(this.hover_callback)
            this.button_field.on("pointerover", () => {
                this.hover_callback(this);
            });
    }

    GetTextField() {
        return this.button_field;
    }
}