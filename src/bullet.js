import GameObject from './gameObject';
// type - мы ли не мы)
export default class Bullet extends GameObject 
{
  constructor (ctx, spriters, x = 0, y = 0, dy = 3, type = 'gun') 
  {
    super(ctx, spriters, x, y, 0, dy);
    this.type = type;
  }

  step () 
  {
    this.y += this.dy;
  }

  isHit (targets, gun) 
  {
    var self = this;

    var result = false;

    targets.forEach(function (target, i) {
      // Если попали в цель уничтожаем ее, если она мертва больше не отслеживаем ее
      if (target.x <= self.x + self.w 
        && target.x + target.w >= self.x 
        && target.y <= self.y + self.h 
        && target.y + target.h >= self.y)
        {
          // Если стреляла пушка начислем ей очки
          if (self.type === 'gun') 
          {
            gun.score += target.score;
          }

          target.destroy();

          if (!target.isAlive) 
            targets.splice(i, 1);
            
          return (result = true);
      }
    });
    return result;
  }

  isHitShield (shield) 
  {
    var bullet = this;

    // Если попали в цель уничтожаем ее, если она мертва больше не отслеживаем ее
    if  (shield.x <= bullet.x + bullet.w 
      && shield.x + shield.w >= bullet.x 
      && shield.y <= bullet.y + bullet.h 
      && shield.y + shield.h >= bullet.y)
      {

        shield.destroy();

        if (!shield.isAlive) 
        {
          shield.x = 5000
          shield.y = 5000
        }
          
        return true;
      }

    return false;
  }
}