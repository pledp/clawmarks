export default class Clawmarks {
    static Pico8 = {
        yellow: 2,
    };

    static Debug = false;
    static UseShader = true;
    static airports;
    static width;
    static height;

    static user;

    static SetConfig(config) {
        if("Debug" in config)
            Clawmarks.Debug = config.Debug;

        if("UseShader" in config) {
            Clawmarks.UseShader = config.UseShader;
        }

        Clawmarks.width = config.width;
        Clawmarks.height = config.height;
    }

    static SetUser(user) {
        Clawmarks.user = user;
    }

    static async GetAirports() {
        Clawmarks.airports = [];

        let response = await fetch(`http://127.0.0.1:3000/RandomAirport/100`);
        response = await response.json();
        Clawmarks.airports = response;
    }
}

export class User {
    constructor(username, high_score) {
        this.username = username;
        this.high_score = high_score;
    }
}

export class Vector2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

export function SnapToGrid(pixel, grid_element_size, padding = 0) {
    return (Math.round((pixel / grid_element_size) + padding) * grid_element_size)
}