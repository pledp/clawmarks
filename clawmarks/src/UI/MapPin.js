export default class FlightPin {
    constructor(airport, flight = null) {
        this.airport = airport;
        if(flight)
            this.flight = flight;
    }
}