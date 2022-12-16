import { Knifes } from '../classes/Knifes';
import Lizard from '../../enemies/Lizard';
import Faune from '../../characters/Faune';
import Phaser from 'phaser';
import { sceneEvents } from '../../events/EventCenter';
import { Chest } from '../../items/Chest';
import { randomDirection } from '../../utils/utils';
import { Group } from '../classes/GameObject';
import { Character } from '../classes/Character';
import { CollisionConfig } from '../interfaces/CollisionConfig';
import { ThrowableWeapon } from '../classes/Weapon';
import { Sprite } from '../classes/Sprite';


export const handlerThrowableWeaponWallCollision = (obj1: ThrowableWeapon) => {
  obj1.destroy();
}

export const  handlerThrowableWeaponEnemyCollision = (obj1: Sprite, obj2: Character) => {
  obj1.destroy();
  obj2.playHitSound();
  const dx = obj2.x - obj1.x;
  const dy = obj2.y - obj1.y;
  const dir = new Phaser.Math.Vector2(dx, dy).normalize().scale(100);
  obj2.handleDamage(dir);
  if(obj2.health <= 0){
    obj2.destroy()

  }
}

export const handlerPlayerLizardCollision = (obj1: Faune, obj2: Lizard) => {
  if(obj1.health) {
    const dx = obj1.x - obj2.x;
    const dy = obj1.y - obj2.y;
    const dir = new Phaser.Math.Vector2(dx, dy).normalize().scale(200);
    obj1.handleDamage(dir);

    sceneEvents.emit('player-health-changed', obj1.health);
  }
}

export const handlerFauneChestCollision = (faune: Faune, chest: Chest) => {
  faune.startInteract(chest);
}

export const  handlerTileCollision = (lizard: Lizard) => {
  lizard.direction = randomDirection(lizard.direction);
}

export const createWeaponEnemyCollisions = (enemies: Group<Character>[]): CollisionConfig[] => {
  return enemies.reduce((acc,enemy) => (
    [
    ...acc,
    {
    collideWith: enemy,
    collideCallback: handlerThrowableWeaponEnemyCollision
  }
  ]),[])
}

export const createWeaponTileCollisions = (tiles: Phaser.Tilemaps.TilemapLayer[]): CollisionConfig[] => {
  return tiles.reduce((acc,tile) => (
    [
    ...acc,
    {
    collideWith: tile,
    collideCallback: handlerThrowableWeaponWallCollision
  }
  ]),[])
}
