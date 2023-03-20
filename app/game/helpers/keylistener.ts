import keys from './keymap';

export default class ListenKeys {
  keys;

  constructor() {
    this.keys = {};
    this.listenKeys();
  }

  on(key, callback) {
    if (this.keys[key]) {
      callback();
    } else {
      return false;
    }
  }

  listenKeys() {
    const keysPressed = (e) => {
      this.keys[keys[e.keyCode]] = true;
    };

    const keysReleased = (e) => {
      this.keys[keys[e.keyCode]] = false;
    };

    window.onkeydown = keysPressed;
    window.onkeyup = keysReleased;
  }
}
