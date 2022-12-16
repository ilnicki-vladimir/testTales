import { CollisionConfig } from '../interfaces/CollisionConfig';
import { GameObject } from './GameObject';

export interface CanCollide {
  addCollisions(config: CollisionConfig[]): void;
}

export type Group = Phaser.GameObjects.Group;

export type Collidable = GameObject | Group | GameObject[] | Group[]

