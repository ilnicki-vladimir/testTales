import { Character } from './Character';
import { Group } from './GameObject';
import { CanCollide } from './Collidable';
import { CollisionConfig } from '../interfaces/CollisionConfig';

export interface Weapon {
  _holder?: Character;
  hit(): void;
  canHit(): boolean;
  set holder(holder: Character);
  get holder(): Character
}

export abstract class ThrowableWeapon extends Group implements Weapon, CanCollide {
  _holder: Character;
  set holder(holder: Character) {
    this._holder = holder
  }

  get holder() {
    return this._holder;
  }

  canHit(): boolean {
    return this.children.size < this.maxSize
  }

  addCollisions(config: CollisionConfig[]): void {
    super.addCollisions(config);
  }

  abstract hit(): void;
}
