import { Sprite } from './Sprite';
import { Direction } from '../enums/direction.enum';
import Phaser from 'phaser';

export class MovableSprite extends Sprite {
  protected speed: number;
  public direction = new Phaser.Math.Vector2();
  protected moveEvent: Phaser.Time.TimerEvent;
}
