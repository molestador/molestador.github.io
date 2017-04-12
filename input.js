const Key = {
    _pressed: {},
    SPACE: 32,
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    VIMLEFT: 72,
    VIMRIGHT: 76,
    VIMDOWN: 74,
    VIMUP: 75,

    isDown(keyCode) {
        return this._pressed[keyCode];
    },

    onKeydown(event) {
        this._pressed[event.keyCode] = true;
    },

    onKeyup(event) {
        delete this._pressed[event.keyCode];
    },
};

window.addEventListener('keyup', (event) => { Key.onKeyup(event); }, false);
window.addEventListener('keydown', (event) => { Key.onKeydown(event); }, false);

export default Key;
