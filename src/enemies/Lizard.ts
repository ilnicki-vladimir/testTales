import { Direction } from '../core/enums/direction.enum';
import { OnInit } from '../core/interfaces/OnInit.interface';
import { randomDirection } from '../utils/utils';
import { DEFAULT_SPEED } from '../core/contants/constants';
import { Character } from '../core/classes/Character';
import { CharacterType } from '../core/enums/character-type';
import { HealthState } from '../core/enums/healt-state';

export default class Lizard extends Character implements OnInit {
  characterType = CharacterType.Enemy;
  direction = new Phaser.Math.Vector2(1,0);
  speed = DEFAULT_SPEED;

  init() {
    this.hitSound = this.scene.sound.add('hit');
    this.anims.play('lizard-idle');
    this.health = 2;

    this.moveEvent = this.scene.time.addEvent({
      delay: 2000,
      callback: () => {
        this.direction = randomDirection(this.direction);
      },
      loop: true,
    });
  }

  preUpdate(time: number, delta: number): void {
    super.preUpdate(time, delta);
    if(this.healthState === HealthState.IDLE) {
      const { x, y } = this.direction;
      const speed = x && y ? this.speed / Math.sqrt(2) : this.speed
      const dir = this.direction.clone().scale(speed);
      this.setVelocity(dir.x,dir.y)
    }
  }

  destroy(fromScene?: boolean): void {
    this.moveEvent.destroy();
    super.destroy(fromScene);
  }
}
