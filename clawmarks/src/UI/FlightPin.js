import Clawmarks from "../Clawmarks.js";
import { Vector2, SnapToGrid } from "../Clawmarks.js";

export default class FlightPin {
    constructor(from, to, map) {
        this.airport_pin = undefined;
        this.flight_pin = undefined;
        this.points_container = undefined;
        this.t = undefined;

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

    CleanUp() {
        if(this.airport_pin)
            this.airport_pin.destroy();

        if(this.flight_pin)
            this.flight_pin.destroy();

        if(this.points_container)
            this.points_container.destroy();
    }

    SetCrashCurve() {

        const start_point = this.curve.getPoint(this.t);
        let crash_curve_x = 100;
        if(this.to.x > start_point.x) {
            crash_curve_x = -100
        }

        const control_point1 = new Phaser.Math.Vector2(start_point.x - crash_curve_x, start_point.y + 25);
        const control_point2 =  new Phaser.Math.Vector2(start_point.x - crash_curve_x * 2, start_point.y + 50);

        const end_point = new Phaser.Math.Vector2(start_point.x - crash_curve_x * 2, Clawmarks.height);

        this.curve = new Phaser.Curves.CubicBezier(start_point, control_point1, control_point2, end_point);
        this.t = 0;
    }

    GetPinToHighlight() {
        if(this.flight_pin) {
            return this.flight_pin;
        }
        else 
            return this.airport_pin;
    }

    HighlightPins(color, path_color = undefined) {
        if(!path_color)
            path_color = color;

        if(this.flight_pin)
            this.flight_pin.fillColor = color;

        if(this.airport_pin)
            this.airport_pin.fillColor = color;

        if(this.points_container) {
            for(let i = 0; i < this.points_container.list.length; i++){
                this.points_container.list[i].fillColor = path_color;
            }
        }
    }

    UpdateEnding(delta) {
        this.t += 0.0001 * delta; 
        this.flight_pin.x = SnapToGrid(this.GetOnCurve(this.t).x, 20)
        this.flight_pin.y = SnapToGrid(this.GetOnCurve(this.t).y, 20)

        this.flight_pin.angle = this.GetAngle();
        
        if(this.t >= 1) {
            this.airport_pin.destroy();
            this.flight_pin.destroy();
            this.points_container.destroy();
        }
    }

    GetAngle() {
        let tangent = new Phaser.Math.Vector2();
        this.curve.getTangent(this.t, tangent);

        let theta = Math.atan2(tangent.y, tangent.x);
        theta *= 180 / Math.PI;

        return theta;
    }
}