import { MovableSprite } from './MovableSprite';
import { HealthState } from '../enums/healt-state';
import { ThrowableWeapon, Weapon } from './Weapon';
import { CharacterType } from '../enums/character-type';
import Phaser from 'phaser';

export class Character extends MovableSprite {
  protected characterType: CharacterType;
  protected healthState = HealthState.IDLE;
  protected _health: number;
  protected weapon: Weapon;
  protected damageTime = 0;

  get health() {
    return this._health
  }
  set health(count: number) {
    this._health = count;
  }

  handleDamage(dir?: Phaser.Math.Vector2) {
    if (this._health <= 0) {
      return;
    }
    if (this.healthState === HealthState.DAMAGE) {
      return;
    }

    --this._health;

    if (this._health <= 0) {
      //TODO: die
      this.healthState = HealthState.DEAD;
      this.setVelocity(0, 0);
    } else {
      dir && this.setVelocity(dir.x, dir.y);

      this.setTint(0xff0000);

      this.healthState = HealthState.DAMAGE;
      this.damageTime = 0;
    }
  }

  setWeapon(weapon: Weapon) {
    this.scene.setCollisionsWithWeapon(weapon as ThrowableWeapon);
    this.weapon = weapon;
    weapon.holder = this;
  }

  hit() {
    if(this.weapon && this.weapon.canHit()){
      this.weapon.hit();
    }
  }

  preUpdate(time: number, delta: number): void {
    super.preUpdate(time, delta);

    switch (this.healthState) {
      case HealthState.IDLE:
        break;
      case HealthState.DAMAGE:
        this.damageTime += delta;
        if (this.damageTime >= 250) {
          this.healthState = HealthState.IDLE;
          this.setTint(0xffffff);
          this.damageTime = 0;
        }
        break;
    }
  }
}
