import { GameObjectFactory } from './Factory';
import { Character } from './Character';
import { Group } from './GameObject';
import { ThrowableWeapon, Weapon } from './Weapon';
import { createWeaponEnemyCollisions, createWeaponTileCollisions } from '../collisions/collisions';
import TilemapLayer = Phaser.Tilemaps.TilemapLayer;

export class Scene extends Phaser.Scene {
  enemies: Group<Character>[] = [];
  tiles: TilemapLayer[] = [];
  protected _gameObjectFactory: GameObjectFactory

  get gameObjectFactory() {
    return this._gameObjectFactory;
  }

  setCollisionsWithWeapon(weapon: ThrowableWeapon) {
    weapon.addCollisions(createWeaponEnemyCollisions(this.enemies))
    weapon.addCollisions(createWeaponTileCollisions(this.tiles))
  }
}
