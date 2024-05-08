import Clawmarks from "../Clawmarks.js";

export default class LogItem {
    constructor(message, color = 0xffffff) {
        this.message = message;
        this.color = color;

        this.height = 0;

        this.FormatMessage();
    }

    FormatMessage() {
        let max_width = parseInt(Clawmarks.width * 0.60 / 20);
        let new_message = "";

        let cur_width = 0;

        for(let i = 0; i < this.message.length; i++) {
            if(cur_width >= max_width && this.message[i] == " ") {
                new_message += "\n";
                cur_width = 0;
                this.height += 1;
            }
            else {
                new_message += this.message[i];
                cur_width++;
            }
        }

        this.message = new_message;
    }
}