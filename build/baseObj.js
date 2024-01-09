export class GameObject {
    constructor(_x, _y, _width, _height) {
        this._x = _x;
        this._y = _y;
        this._width = _width;
        this._height = _height;
    }
    get x() { return this._x; }
    get y() { return this._y; }
    get width() { return this._width; }
    get height() { return this._height; }
    set x(x) { this._x = x; }
    set y(y) { this._y = y; }
    set width(w) { this._width = w; }
    set height(h) { this._height = h; }
}
