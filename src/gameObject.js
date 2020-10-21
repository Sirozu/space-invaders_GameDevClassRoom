export default class GameObject {
  constructor (ctx, spriters = [], x = 0, y = 0, dx = 4, dy = 16) {
    this.ctx = ctx;
    this.spriters = spriters;
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.curSprite = 0;

    if (spriters[0]) {
      this.w = spriters[0].w;
      this.h = spriters[0].h;
    }
  }

  clear () {
    this.ctx.beginPath();
    this.ctx.rect(this.x, this.y, this.w, this.h);
    this.ctx.fillStyle = 'black';
    this.ctx.fill();
    this.ctx.closePath();
  }

  draw (changeSprite = false) {
    var spr = this.spriters[this.curSprite];

    this.ctx.drawImage(spr.sp, spr.x, spr.y, spr.w, spr.h, this.x, this.y, this.w, this.h);

    if (changeSprite) {
      if (this.curSprite < this.spriters.length - 1) this.curSprite += 1;
      else this.curSprite = 0;
    }
  }
}