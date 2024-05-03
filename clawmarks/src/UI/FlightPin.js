import { Vector2 } from "../Clawmarks.js";

export default class FlightPin {
    constructor(from, to, map) {
        this.from = new Vector2((from.x + 180) * (map.displayWidth / 360), map.displayHeight - ((from.y + 90) * (map.displayHeight / 180)));
        this.to = new Vector2((to.x + 180) * (map.displayWidth / 360), map.displayHeight - ((to.y + 90) * (map.displayHeight / 180)))

        let flight = new Vector2(this.to.x  - this.from.x, this.to.y - this.from.y);

        const startPoint = new Phaser.Math.Vector2(this.from.x, this.from.y);
        const controlPoint1 = new Phaser.Math.Vector2(this.from.x + (flight.x * 0.3), this.from.y + (flight.y * 0.3) - 50);
        const controlPoint2 = new Phaser.Math.Vector2(this.from.x + (flight.x * 0.6), this.from.y + (flight.y * 0.6) - 200);

        const endPoint = new Phaser.Math.Vector2(this.to.x, this.to.y);

        this.curve = new Phaser.Curves.CubicBezier(startPoint, controlPoint1, controlPoint2, endPoint);
    }

    GetOnCurve(t) {
        let point_on_curve = new Phaser.Math.Vector2();
        this.curve.getPoint(t, point_on_curve);
        
        return point_on_curve;
    }
}