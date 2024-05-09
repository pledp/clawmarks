export default class GameMode {
    #time;
    #game_end_text;

    remove_task_on_crash = false;
    is_playing = false;
    tasks = [];

    constructor(log_callback = undefined) {}
    
    StartGame() {}
    Update(scene, time, delta) {}
    AddTask(force_task, make_flight, spot) {}
    OnCrash() {}
    OnFail() {}
    OnCompletion(task) {}

    GetTime() {}
    GetMode() {}
    IsPlaying() {}
}