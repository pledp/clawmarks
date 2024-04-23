export default class Button {
    constructor(text, callback = undefined) {
        this.text = text;
        this.callback = callback;
    }

    create(scene, x, y, font_size) {
        // Draw button and make it interactive
        let buttonImage = scene.add.bitmapText(x, y, "PixelFont", this.text, font_size);
        buttonImage.setInteractive();

        buttonImage.on("pointerdown", () => {
            this.callback(scene);
        });
    }
}