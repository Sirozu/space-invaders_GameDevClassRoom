import { WIDTH_CANVAS, ENEMY_BULLET_SPRITERS } from './config';
import GameObject from './gameObject';
import Bullet from './bullet';

class Enemy extends GameObject {
  constructor (ctx, spriters, x = 0, y = 0, score = 10, dx = -4, dy = 16) {
    super(ctx, spriters, x, y, dx, dy);
    this.isAlive = true;
    this.score = score;
  }
  // Шаг корабря
  step (dx) {
    if (this.isAlive) {
      this.x += dx;
    }
  }
  // Спуск коробля в низ
  // Используется при достижении флотом левой границы.
  stepToDown () {
    if (this.isAlive) {
      this.y += this.dy;
    }
  }
  // Корабль по команде стреляет с некой вероятностью
  fire (bullets, rateDestroy) {
    // вероятность что выстрелит
    var fired = !Math.floor(Math.random() * (3 + rateDestroy));
    if (this.isAlive && fired) {
      // Стреляет, добавляет полю в массив пуль (для их обработки в цикле игры)
      bullets.push(
        new Bullet(this.ctx, ENEMY_BULLET_SPRITERS, this.x + this.w / 2,
          this.y + this.h, 1, 'enemy')
      );
    }
  }
  // Корабль уничтожен
  destroy () {
    this.isAlive = false;
  }
}

class EnemyLine extends GameObject {
  constructor (ctx, spriters, count, y = 0, score = 10, space = 10) {
    super(ctx, spriters, 0, y);
    this.count = count;
    this.space = space + 24 - spriters[0].w;
    this.w = spriters[0].w * count + this.space * (count - 1);
    this.h = spriters[0].h;
    this.enemies = [];

    for (let i = 0; i < count; i++) {
      let x = WIDTH_CANVAS - this.spriters[0].w * (this.count - i) - this.space * (this.count - i - 1);
      // Создаем корабли линни, каждый корабль будет иметь координаты в соответствии с его номером в линни
      this.enemies.push(new Enemy(ctx, spriters, x, y, score));
    }
  }
  // Пересчитывем длину линии
  updateWidth () {
    this.w = this.spriters[0].w * this.enemies.length + this.space * (this.enemies.length - 1);
  }

  step (dx) {
    this.enemies.forEach(function (enemy, i) {
      if (enemy.isAlive) enemy.step(dx);
    });
  }

  stepToDown () {
    this.enemies.forEach(function (enemy, i) {
      if (enemy.isAlive) enemy.stepToDown();
    });
  }

  fire (bullets, rateDestroy) {
    let numDestroyedShips = [];

    this.enemies.forEach(function (enemy, i) {
      if (enemy.isAlive) {
        enemy.fire(bullets, rateDestroy);
      } else {
        numDestroyedShips.push(i);
      }
    });

    return numDestroyedShips;
  }
}

export default class EnemyFleet extends GameObject {
  constructor (ctx, lines, y = 0, dx = -4, dy = 16, space = 8) {
    super(ctx, [], 0, y, dx, dy);
    this.lines = lines;
    this.space = space;
    this.w = lines.sort((a, b) => b.w - a.w)[0].w;
    this.h = lines.length * lines[0].h + (lines.length - 1) * space;
    this.x = WIDTH_CANVAS - this.w;
    this.ships = [];
    this.startCountShips = 0;
    this.stepDelay = 32//64;

    let self = this;
    this.lines.sort((a, b) => a.y - b.y);

    this.lines.forEach(function (line) {
      self.ships = self.ships.concat(line.enemies);
    });
    this.startCountShips = this.ships.length;
  }
  // Создает массив линий вражеского флота, enemySpriters - массив спрайтов для линий
  // count - количество повторений линий (созданных из enemySpriters)
  // size - размер кораблей в линии
  static makeLines (ctx, enemySpriters, count = 1, size = 10) {
    let enemyLines = [];

    let hSprite = 16;

    for (let j = 0; j < count; j++) {
      // Каждый спрайт отдельная линия
      enemySpriters.forEach(function (spriters, i) {
        let lLines = enemyLines.length;

        let lSpriters = enemySpriters.length;

        let y = lLines ? enemyLines[lLines - 1].y + hSprite + hSprite / 2 : 0;
        enemyLines.push(new EnemyLine(ctx, spriters, size, y, 10 * (lSpriters - i)));
      });
    }

    return enemyLines;
  }

  step () {
    let self = this;

    // Проверим крайние стобцы при необходимоти обрежем флот
    this.checkEdges();
    // Если не дошли до края то идем, если дошли то спускаемся
    if (this.dx + this.x + this.w > WIDTH_CANVAS || this.dx + this.x < 0) {
      this.dx = -this.dx;
      this.stepToDown();
    } else {
      this.x += this.dx;
      this.lines.forEach(function (enemyLine, i) {
        enemyLine.step(self.dx);
      });
    }
  }

  stepToDown () {
    this.y += this.dy;
    this.lines.forEach(function (enemyLine, i) {
      enemyLine.stepToDown();
    });
  }
  // Флот открывает огонь из кораблейнаходящихся в нижней позиции по каждому столбу
  fire (bullets) {
    // Отдаем приказ нижней линии открыть огонь
    let i = this.lines.length - 1;

    let numDestroyed = this.lines[i].fire(bullets, this.rateDestroy);

    // Линия полностью уничтожена
    if (numDestroyed.length === this.lines[i].enemies.length) {
      this.lines.splice(i, 1);
      this.h = this.lines.length * this.lines[0].h + (this.lines.length - 1) * this.space;
    }

    let self = this;

    i--;
    // Если в линии есть потери то, приказ открыть огонь передается
    // соотвествующим кораблям верхней линии.
    // И так д тех пор пока приказ не будет выполнен, либо не закончатся линии флота
    while (i >= 0 && numDestroyed.length !== 0) {
      numDestroyed.forEach(function (num, j, arr) {
        let enemy = self.lines[i].enemies[num];
        // Если корабль жив то командуем огонь, и убираем его номер из массива не выполнивших приказ.
        if (enemy.isAlive) {
          enemy.fire(bullets, self.rateDestroy);
          arr.splice(j, 1);
        }
      });
      i--;
    }
  }

  get stepGap () {
    return Math.floor(this.stepDelay / this.rateDestroy);
  }

  get rateDestroy () {
    return Math.floor(this.startCountShips / this.ships.length);
  }
  // Проверка и обрезка краев
  checkEdges () {
    let leftEmpty = true;

    let rightEmpty = true;

    this.lines.forEach(function (line) {
      if (line.enemies[0].isAlive) leftEmpty = false;
      if (line.enemies[line.enemies.length - 1].isAlive) rightEmpty = false;
    });
    // Если первый столбец потерял все корабли, удалим его
    if (leftEmpty) {
      this.lines.forEach(function (line) {
        line.enemies.splice(0, 1);
        line.updateWidth();
      });
      this.x += this.lines[0].enemies[0].w + this.lines[0].space;
      this.w -= (this.lines[0].enemies[0].w + this.lines[0].space);
    }
    // Если последний столбец потерял все корабли, удалим его
    if (rightEmpty) {
      this.lines.forEach(function (line) {
        line.enemies.splice(line.enemies.length - 1, 1);
        line.updateWidth();
      });
      this.w -= (this.lines[0].enemies[0].w + this.lines[0].space);
    }
  }
}
