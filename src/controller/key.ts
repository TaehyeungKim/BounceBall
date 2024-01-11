export type AvailKey = "ArrowLeft"|"ArrowRight"|"ArrowUp"|"ArrowDown"

export class KeyboardObserver {

    private _ar_left: boolean;
    private _ar_right: boolean;
    private _ar_up: boolean;
    private _ar_down: boolean;

    constructor() {
        this._ar_down = this._ar_left = this._ar_right = this._ar_up = false;
    }

    get left() {return this._ar_left}
    get right() {return this._ar_right}
    get up() {return this._ar_up}
    get down() {return this._ar_down}

    keyToggle(key:AvailKey, mode: boolean) {
        switch(key) {
            case "ArrowLeft": this._ar_left = mode; break;
            case "ArrowRight": this._ar_right = mode; break;
            case "ArrowUp": this._ar_up = mode; break;
            case "ArrowDown": this._ar_down = mode; break;
        }
    }
    
}