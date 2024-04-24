export default class GameMode {
    #mode_name;
    #is_playing;
    #time;
    #game_end_text;

    tasks = [];
    
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