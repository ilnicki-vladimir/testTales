import { Direction } from '../core/enums/direction.enum';
import Phaser from 'phaser';


export const randomDirection = (exclude: Direction) => {
  let newDirection: number;
  do {
    newDirection = Phaser.Math.Between(0, 3);
  } while (newDirection === exclude);

  return newDirection;
};
