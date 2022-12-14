import { Collidable } from '../classes/Collidable';

export interface CollisionConfig {
  collideWith: Collidable,
  collideCallback?: (obj1: Collidable, obj2: Collidable) => void
}
