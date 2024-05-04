export default class Clawmarks {
    static Pico8 = {
        yellow: 2,
    };

    static Debug = false;
    static UseShader = true;

    static SetConfig(config) {
        if("Debug" in config)
            Clawmarks.Debug = config.Debug;

        if("UseShader" in config) {
            Clawmarks.UseShader = config.UseShader;
        }
    }
}

export class Vector2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}