import { MovableSprite } from './MovableSprite';
import { HealthState } from '../enums/healt-state';
import { Weapon } from './Weapon';
import { Knifes } from './Knifes';

export class Character extends MovableSprite {
  protected healthState = HealthState.IDLE;
  protected _health: number;
  protected weapon: Weapon;

  get health() {
    return this._health
  }
  set health(count: number) {
    this._health = count;
  }

  setWeapon(weapon: Weapon) {
    this.weapon = weapon;
    weapon.holder = this;
  }

  hit() {
    if(this.weapon && this.weapon.canHit()){
      this.weapon.hit();
    }
  }
}
