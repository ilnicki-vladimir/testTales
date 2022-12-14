import Phaser from 'phaser';
import { Sprite } from '../core/classes/Sprite';
import { OnInit } from '../core/interfaces/OnInit.interface';
import { Character } from '../core/classes/Character';
import Faune from '../characters/Faune';

export interface Interactive {
  interact(character: Character): void;
}

export class Chest extends Sprite implements OnInit, Interactive {
  opened = false;
  init() {
    this.play('chest-close');
    this.interactSound = this.scene.sound.add('coins');
  }

  interact(faune: Faune) {
    if(!this.opened) {
      if (this.anims.currentAnim.key !== 'chest-close') {
        return 0;
      }
      this.play('chest-open');
      this.playInteractSound()
      faune.addCoins(Phaser.Math.Between(50, 200))
      this.opened = true;
    }
  }
}
