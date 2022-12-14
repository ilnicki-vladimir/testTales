import Phaser from 'phaser';
import { CollisionConfig } from '../interfaces/CollisionConfig';
import { CanCollide, Collidable } from './Collidable';

export class Sprite extends Phaser.Physics.Arcade.Sprite implements CanCollide {
  protected hitSound: Phaser.Sound.BaseSound;
  protected interactSound: Phaser.Sound.BaseSound;
  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
    super(scene, x, y, texture, frame);

    if('init' in this && this['init'] instanceof Function) {
      (this['init'] as Function)()
    }
  }

  playHitSound() {
    if(this.hitSound) {
      this.hitSound.play();
    }
  }

  playInteractSound() {
    if(this.interactSound) {
      this.interactSound.play();
    }
  }

  addCollisions(configs: CollisionConfig[]) {
    for(const config of configs) {
        this.scene.physics.add.collider(this, config.collideWith, config.collideCallback)
    }
  }
}
