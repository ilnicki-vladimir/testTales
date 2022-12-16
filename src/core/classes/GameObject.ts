import Phaser from 'phaser';
import { CanCollide } from './Collidable';
import { CollisionConfig } from '../interfaces/CollisionConfig';
export type GameObject = Phaser.GameObjects.GameObject;
export class Group<T extends GameObject = GameObject> extends Phaser.Physics.Arcade.Group implements CanCollide {
  addCollisions(config: CollisionConfig[]) {
    super['addCollisions'](config);
  }

  override getChildren() {
    return super.getChildren() as T[];
  }

  override get(x?: number, y?: number, key?: string, frame?: string | number, visible?: boolean): T {
    return super.get(x, y, key, frame, visible);
  }

  override children: Phaser.Structs.Set<T>;
  override getLast(state?: boolean, createIfNull?: boolean, x?: number, y?: number, key?: string, frame?: string | number, visible?: boolean): T {
    return super.getLast(state, createIfNull, x, y, key, frame, visible);
  }
  override getFirst(state?: boolean, createIfNull?: boolean, x?: number, y?: number, key?: string, frame?: string | number, visible?: boolean): T {
    return super.getFirst(state, createIfNull, x, y, key, frame, visible);
  }
}
export class StaticGroup<T extends GameObject = GameObject> extends Phaser.Physics.Arcade.StaticGroup implements CanCollide {
  addCollisions(config: CollisionConfig[]) {
    super['addCollisions'](config);
  }
  override getChildren() {
    return super.getChildren() as T[];
  }

  override get(x?: number, y?: number, key?: string, frame?: string | number, visible?: boolean): T {
    return super.get(x, y, key, frame, visible);
  }

  override children: Phaser.Structs.Set<T>;
  override getLast(state?: boolean, createIfNull?: boolean, x?: number, y?: number, key?: string, frame?: string | number, visible?: boolean): T {
    return super.getLast(state, createIfNull, x, y, key, frame, visible);
  }
  override getFirst(state?: boolean, createIfNull?: boolean, x?: number, y?: number, key?: string, frame?: string | number, visible?: boolean): T {
    return super.getFirst(state, createIfNull, x, y, key, frame, visible);
  }
}
