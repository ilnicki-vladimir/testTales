import { HorizontalDirection, VerticalDirection } from '../core/enums/direction.enum';
import Phaser from 'phaser';

export const randomDirection = (exclude: Phaser.Math.Vector2) => {
  const newDirection = [];
  const { x, y } = exclude
  do {
    newDirection[0] = parseInt(Object.values(HorizontalDirection)[Phaser.Math.Between(0, 3)]);
  } while (newDirection[0] === x);

  do {
    newDirection[1] = parseInt(Object.values(VerticalDirection)[Phaser.Math.Between(0, 3)]);
  } while (newDirection[1] === y);

  return new Phaser.Math.Vector2(...newDirection);
};

export type ExcludeTupleFromTuple<T, P> = T extends [infer F, ...infer Rest] ? F extends P[keyof P] ? ExcludeTupleFromTuple<Rest, P> : [F, ...ExcludeTupleFromTuple<Rest, P>] : T
