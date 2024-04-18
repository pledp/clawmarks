export default class Button {
    constructor(text, callback = undefined) {
        this.text = text;
        this.callback = callback;
    }

    create(scene) {
        // Draw button and make it interactive
        let buttonImage = scene.add.bitmapText(0, 100, "PixelFont", this.text);
        buttonImage.setInteractive();

        buttonImage.on("pointerdown", () => {
            this.callback(scene);
        });
    }
}