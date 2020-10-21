import { WIDTH_CANVAS, HEIGHT_CANVAS, GUN_BULLET_SPRITERS} from './config';
import GameObject from './gameObject';
import Bullet from './bullet';

export default class Gun extends GameObject {
  constructor (ctx, spriters, x = (WIDTH_CANVAS - 22) / 2, y = HEIGHT_CANVAS - 16, dx = 3, life = 3) {
    super(ctx, spriters, x, y, dx);
    this.w = 22;
    this.h = 16;
    this.isMoving = false;
    this.life = life;
    this.score = 0;
  }

  stop () {
    this.isMoving = false;
  }

  moving (dx) {
    if (this.isMoving && (this.x + dx >= 0 && this.x + dx <= WIDTH_CANVAS - 22)) {
      this.x += dx;
    } else {
      this.stop();
    }
  }

  movingLeft () {
    this.isMoving = true;
    this.moving(this.dx * -1);
  }

  movingRight () {
    this.isMoving = true;
    this.moving(this.dx);
  }

  fire (bullets) {
    bullets.push(new Bullet(this.ctx, GUN_BULLET_SPRITERS, this.x + 11, this.y - 3, -1));
  }

  get isAlive () {
    return this.life > 0;
  }

  destroy () {
    this.life -= 1;
  }
}