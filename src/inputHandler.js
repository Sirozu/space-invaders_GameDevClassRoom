export default class InputHandler {
  constructor () {
    this.down = {};
    this.pressed = {};

    var self = this;

    document.addEventListener('keydown', function (event) {
      self.down[event.keyCode] = true;
    });

    document.addEventListener('keyup', function (event) {
      delete self.down[event.keyCode];
      delete self.pressed[event.keyCode];
    });
  }
  // Если клавиша все еще нажата
  isDown (code) {
    return this.down[code];
  }
  isPressed (code) 
  {
    if (this.pressed[code]) 
    {
      return false;
    } 
    else 
    {
      if (this.down[code]) 
        return (this.pressed[code] = true);
    }
    return false;
  }
  // Нажата ли какая либо кнопка
  isAnyKeyPressed () {
    return !!Object.keys(this.down).length;
  }
}
