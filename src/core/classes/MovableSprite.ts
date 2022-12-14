import { Sprite } from './Sprite';
import { Direction } from '../enums/direction.enum';
import Phaser from 'phaser';

export class MovableSprite extends Sprite {
  protected speed: number;
  protected direction: Direction;
  protected moveEvent: Phaser.Time.TimerEvent;
}
