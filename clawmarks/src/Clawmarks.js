export default class Clawmarks {
    static Pico8 = {
        yellow: 2,
    };

    static Debug = false;

    static SetConfig(config) {
        Clawmarks.Debug = config.Debug;
    }
}

export class Vector2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}