import { ctx,  ENEMY_SPRITERS, GUN_SPRITERS, SHIELD_SPRITERS} from './config';
import Screen from './screen';
import EnemyFleet from './enemy';
import InputHandler from './inputHandler';
import Gun from './gun';
import Shield from './shield';

function startGameLoop (screen, input) {
  let step = 0;

  let round = 1;
  // Создаем флот
  let enemyFleet = new EnemyFleet(ctx, EnemyFleet.makeLines(ctx, ENEMY_SPRITERS, round, 10));
  // Получаем пушку
  let gun = new Gun(ctx, GUN_SPRITERS, (screen.w - 22) / 2, screen.h - 32 - 16 - 4);
  gun.draw();

  let shield1 = new Shield(ctx, SHIELD_SPRITERS, screen.w - 100, screen.h - 150);
  let shield2 = new Shield(ctx, SHIELD_SPRITERS, screen.w - 250, screen.h - 150);
  let shield3 = new Shield(ctx, SHIELD_SPRITERS, screen.w - 450, screen.h - 150);
  let shield4 = new Shield(ctx, SHIELD_SPRITERS, screen.w - 570, screen.h - 150);
  shield1.draw();
  shield2.draw();
  shield3.draw();
  shield4.draw();

  // Инииализируем массив пуль
  let bullets = [];
  // Иницализируем обработчик команд
  let commandController = startCommandController(input);

  // Обработчик команд игрока
  function startCommandController (input) {
    return () => {
      if (input.isDown(37)) gun.movingLeft();
      if (input.isDown(39)) gun.movingRight();
      if (input.isPressed(32)) gun.fire(bullets);
    };
  }

  function loop () {
    // Завершаем игру
    if (enemyFleet.y + enemyFleet.h >= screen.h - 32 || !gun.isAlive) {
      screen.message('GAME OVER', screen.w / 2 - 50);
      screen.message('YOU SCORE ' + gun.score, screen.w / 2 - 50, screen.h/2 + 50);
      return 'finish';
    }

    



    // новый раунд
    if (!enemyFleet.ships.length) {
      round += 1;
      step = 0;

      enemyFleet = new EnemyFleet(ctx, EnemyFleet.makeLines(ctx, ENEMY_SPRITERS, round, 10));
      gun.x = (screen.w - 22) / 2;
      gun.y = screen.h - 32 - 16 - 4;
      bullets = [];
      screen.clearAll();
      screen.drawBar(gun);
      gun.draw();
      shield1.draw();
      shield2.draw();
      shield3.draw();
      shield4.draw();
    }

    if (step === 0) screen.message(`ROUND  ${round}`, screen.w / 2 - 30);

    if (step === 20) screen.clear(screen.w / 2 - 30, screen.h / 2 - 8, screen.w, 16);
    // Задержка для показа сообщений
    if (step > 20) {
      // обрабатываем команды игрока
      commandController();
      // Обрабатываем пули
      bullets.forEach(function (bullet, i) {
        // Двигаем пулю
        bullet.step();

        if (bullet.isHitShield(shield1)
        || bullet.isHitShield(shield2)
        || bullet.isHitShield(shield3)
        || bullet.isHitShield(shield4))
        {
          bullets.splice(i, 1);
        }

        // Если пуля попала в цель, очищаем ее и больше не отслеживаем
        if (bullet.isHit(bullet.type === 'gun' ? enemyFleet.ships : [gun], gun)) {
          bullets.splice(i, 1);
        } else {
          // Удаляем улетевшие пули
          if (bullet.y > screen.h - 32 - bullet.h - 2 || bullet.y < 0) {
            bullets.splice(i, 1);
          }
        }

       
      });

      // TODO при уменьшении количества кораблей уменьшать задержку хода флота
      if ((step - 20) % enemyFleet.stepGap === 0) {
        enemyFleet.step();
        enemyFleet.fire(bullets);
      }
      screen.clearAll();
      screen.drawAll(gun, bullets, enemyFleet, step, shield1, shield2, shield3, shield4);
    }

    step += 1;
    requestAnimationFrame(loop);
  }

  return loop;
}

// Инициализируем экран
let screen = new Screen(ctx);
screen.clearAll();
screen.message('PRESS ANY KEY', screen.w / 2 - 100);
// Готовимся получать команды от игрока
let input = new InputHandler();

setTimeout(function wait () {
  if (input.isAnyKeyPressed()) {
    screen.clearAll();

    var gameLoop = startGameLoop(screen, input);
    // запускаем игровой цикл
    gameLoop();
  } else setTimeout(wait, 0);
}, 0);
