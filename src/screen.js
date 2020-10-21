import { WIDTH_CANVAS, HEIGHT_CANVAS} from './config';
export default class Screen {
  constructor (ctx) {
    this.ctx = ctx;
    this.w = WIDTH_CANVAS;
    this.h = HEIGHT_CANVAS;
  }

  // функия полной очистки экрана
  clearAll () {
    this.ctx.rect(0, 0, this.w, this.h);
    this.ctx.fillStyle = 'black';
    this.ctx.fill();
  }
  drawAll (gun, bullets, enemyFleet, step, shield1, shield2, shield3, shield4) {
    this.drawBar(gun);
    gun.draw();
    bullets.forEach(function (bullet) {
      bullet.draw();
    });
    enemyFleet.ships.forEach(function (ship) {
      ship.draw((step - 20) % enemyFleet.stepGap === 0);
    });

    shield1.draw();
    shield2.draw();
    shield3.draw();
    shield4.draw();
  }
  clear (x, y, w, h) {
    this.ctx.rect(x, y, w, h);
    this.ctx.fillStyle = 'black';
    this.ctx.fill();
  }
  // отрисовка бара
  drawBar (gun) {
    this.ctx.beginPath();
    this.ctx.moveTo(0, this.h - 32);
    this.ctx.lineTo(this.w, this.h - 32);
    this.ctx.strokeStyle = 'red';
    this.ctx.stroke();
    this.ctx.closePath();

    if (gun) {
      this.drawLifeBar(gun);
      this.drawScoreBar(gun.score);
    }
  }
  // отрисовка жизней
  drawLifeBar (gun) {
    let spr = gun.spriters[0];

    let x = 0;

    let y = this.h - 32 + (32 - 16) / 2;

    let space = 8;

    let w = 22 * 3 + space * 3;

    this.ctx.beginPath();
    this.ctx.rect(x, y, w, this.h);
    this.ctx.fillStyle = 'black';
    this.ctx.fill();
    this.ctx.closePath();

    for (let i = 0; i < gun.life; i++) {
      this.ctx.drawImage(spr.sp, spr.x, spr.y, spr.w, spr.h, x + spr.w * i + space * (i + 1), y, spr.w, spr.h);
    }
  }
  // отрисовка очков
  drawScoreBar (score) {
    let x = this.w - 100;

    let y = this.h - 32 + (32 - 16) / 2;

    this.ctx.beginPath();
    this.ctx.rect(x, y, this.w, this.h);
    this.ctx.fillStyle = 'black';
    this.ctx.fill();
    this.ctx.closePath();

    this.ctx.beginPath();
    this.ctx.font = '16px serif';
    this.ctx.textBaseline = 'top';
    this.ctx.fillStyle = 'red';
    this.ctx.fillText(`SCORE  ${score}`, x, y);
    this.ctx.closePath();
  }
  // сообщение
  message (txt, x, y = this.h / 2 - 8) {
    this.ctx.beginPath();
    this.ctx.font = '16px serif';
    this.ctx.textBaseline = 'top';
    this.ctx.fillStyle = 'red';
    this.ctx.fillText(txt, x, y);
    this.ctx.closePath();
  }
}
