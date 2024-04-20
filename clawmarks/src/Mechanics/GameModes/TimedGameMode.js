import GameMode from "./GameMode.js"
import Flight from "../Flight.js"

export default class TimedGameMode extends GameMode {
    AddTask(task_list, spot = null) {
        task_list.push(Flight.CreateFlight());
    }
}