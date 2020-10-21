import Sprite from './sprite';
import assetPath from '../assets/invaders.png'

export const canvas = document.getElementById("cnvs");

export var ctx = canvas.getContext('2d');

ctx.canvas.width  = 600//window.innerWidth;
ctx.canvas.height = 500//window.innerHeight;

export const SHIPS_IN_LINE = 10;

export const WIDTH_CANVAS = canvas.width;

export const HEIGHT_CANVAS = canvas.height;

var image = new Image();
image.src = assetPath;

// Получаем массив спрайтов вражеских кораблей
export const ENEMY_SPRITERS = [
  [new Sprite(image, 22, 0, 16, 16), new Sprite(image, 22, 16, 16, 16)],
  [new Sprite(image, 0, 0, 22, 16), new Sprite(image, 0, 16, 22, 16)],
  [new Sprite(image, 38, 0, 24, 16), new Sprite(image, 38, 16, 24, 16)]
];
// Получаем массив спрайтов пушки
export const GUN_SPRITERS = [new Sprite(image, 62, 0, 22, 16)];
// Получаем массив спрайтов снаряда пушки
export const GUN_BULLET_SPRITERS = [new Sprite(image, 73, 0, 1, 3)];
// Получаем массив спрайтов снаряда вражеских кораблей
export const ENEMY_BULLET_SPRITERS = [new Sprite(image, 50, 0, 1, 3)];
// Получаем массив спрайтов щита 
export const SHIELD_SPRITERS = [new Sprite(image, 84, 0, 42, 30)]
