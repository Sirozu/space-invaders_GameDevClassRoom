import { WIDTH_CANVAS, HEIGHT_CANVAS, SHIELD_SPRITERS} from './config';
import GameObject from './gameObject';
import Bullet from './bullet';

export default class Shield extends GameObject {
  constructor (ctx, spriters, x = WIDTH_CANVAS/ 2, y = HEIGHT_CANVAS/2 , dx = 0, life = 2) {
    super(ctx, spriters, x, y, dx);
    this.w = 42;
    this.h = 30;
    this.life = life;
  }

  get isAlive () {
    return this.life > 0;
  }

  destroy () {
    this.life -= 1;
    this.h = 25;
  }
}