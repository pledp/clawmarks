export default class GameMode {
    #time;
    #game_end_text;

    is_playing = false;
    tasks = [];

    constructor() {}
    
    StartGame() {}
    Update() {}
    AddTask() {}
    OnCrash() {}
    OnFail() {}
    OnCompletion() {}

    GetTime() {}
    GetMode() {}
    IsPlaying() {}
}