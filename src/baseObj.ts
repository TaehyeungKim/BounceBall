export class GameObject {
    constructor(private _x: number, private _y:  number, private _width: number, private _height: number) {}

    get x() { return this._x}
    get y() { return this._y}
    get width() {return this._width}
    get height() {return this._height}
    

    set x(x: number) {this._x = x}
    set y(y: number) {this._y = y}
    set width(w: number) {this._width = w}
    set height(h: number) {this._height = h}
    
}