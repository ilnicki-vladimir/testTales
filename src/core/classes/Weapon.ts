import { Character } from './Character';
import { Group } from './GameObject';
import { CanCollide } from './Collidable';
import { CollisionConfig } from '../interfaces/CollisionConfig';
import { Image } from './Image';
import { Sprite } from './Sprite';

export interface Weapon {
  _holder?: Character;
  hit(): void;
  canHit(): boolean;
  set holder(holder: Character);
  get holder(): Character
}

export abstract class ThrowableWeapon extends Group implements Weapon, CanCollide {
  texture: string;
  flySpeed: number;
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

  hit(): void {
    const item = this.get(this.holder.x, this.holder.y, this.texture) as Sprite;
    const dir = this.holder.direction.clone().scale(this.flySpeed);
    const angle = dir.angle();
    if(dir.y) {
      let multiplier = 1;
      if(dir.x) {
        multiplier = 0.5
      }
      item.setBodySize(item.height * multiplier, item.width * multiplier);
    }
    item.setVelocity(dir.x, dir.y).setRotation(angle);
  }
}
