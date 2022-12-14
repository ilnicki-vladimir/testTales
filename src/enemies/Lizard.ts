import Phaser from 'phaser';
import { Direction } from '../core/enums/direction.enum';
import { MovableSprite } from '../core/classes/MovableSprite';
import { OnInit } from '../core/interfaces/OnInit.interface';
import { randomDirection } from '../utils/utils';
import { DEFAULT_SPEED } from '../core/contants/constants';

export default class Lizard extends MovableSprite implements OnInit {

  init() {
    this.hitSound = this.scene.sound.add('hit');
    this.direction = Direction.RIGHT;
    this.speed = DEFAULT_SPEED;
    this.anims.play('lizard-idle');
    this.scene.physics.world.on(Phaser.Physics.Arcade.Events.TILE_COLLIDE, this.handlerTileCollision, this);

    this.moveEvent = this.scene.time.addEvent({
      delay: 2000,
      callback: () => {
        this.direction = randomDirection(this.direction);
      },
      loop: true,
    });
  }

  private handlerTileCollision(gameObject: Phaser.GameObjects.GameObject, tile: Phaser.Tilemaps.Tile) {
    // console.log(go, tile)
    if (gameObject !== this) {
      return;
    }

    this.direction = randomDirection(this.direction);
  }

  preUpdate(time: number, delta: number): void {
    super.preUpdate(time, delta);

    switch (this.direction) {
      case Direction.UP:
        this.setVelocity(0, -this.speed);
        break;
      case Direction.DOWN:
        this.setVelocity(0, this.speed);
        break;
      case Direction.LEFT:
        this.setVelocity(-this.speed, 0);
        break;
      case Direction.RIGHT:
        this.setVelocity(this.speed, 0);
        break;
    }
  }

  destroy(fromScene?: boolean): void {
    this.moveEvent.destroy();
    super.destroy(fromScene);
  }
}
