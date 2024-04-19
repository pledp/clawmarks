export default class Button {
    constructor(text, callback = undefined) {
        this.text = text;
        this.callback = callback;
    }

    create(scene, x, y) {
        // Draw button and make it interactive
        let buttonImage = scene.add.bitmapText(x, y, "PixelFont", this.text);
        buttonImage.setInteractive();

        buttonImage.on("pointerdown", () => {
            this.callback(scene);
        });
    }
}