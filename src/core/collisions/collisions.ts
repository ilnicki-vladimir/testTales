import { Knifes } from '../classes/Knifes';
import Lizard from '../../enemies/Lizard';
import Faune from '../../characters/Faune';
import Phaser from 'phaser';
import { sceneEvents } from '../../events/EventCenter';
import { Chest } from '../../items/Chest';


export const handlerKnifeWallCollision = (obj1: Knifes) => {
  obj1.destroy();
}

export const  handlerKnifeLizardCollision = (obj1: Knifes, obj2: Lizard) => {
  obj1.destroy();
  obj2.playHitSound();
  obj2.destroy();
}

export const handlerPlayerLizardCollision = (obj1: Faune, obj2: Lizard) => {
  const dx = obj1.x - obj2.x;
  const dy = obj1.y - obj2.y;

  const dir = new Phaser.Math.Vector2(dx, dy).normalize().scale(200);
  obj1.handleDamage(dir);

  sceneEvents.emit('player-health-changed', obj1.health);

  if (obj1.health <= 0) {
    // this.playerLizardsCollides?.destroy();
  }
}

export const handlerFauneChestCollision = (faune: Faune, chest: Chest) => {
  faune.startInteract(chest);
  setTimeout(() => faune.stopInteract(), 100)
}
