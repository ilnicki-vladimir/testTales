import Phaser from 'phaser';
import { CollisionConfig } from '../interfaces/CollisionConfig';
import { CanCollide } from './Collidable';
import { Scene } from './Scene';

export class Sprite extends Phaser.Physics.Arcade.Sprite implements CanCollide {
  override scene: Scene;
  protected hitSound: Phaser.Sound.BaseSound;
  protected interactSound: Phaser.Sound.BaseSound;
  constructor(scene: Scene, x: number, y: number, texture: string, frame?: string | number) {
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
        this.scene.physics.add.collider(this, config.collideWith, config.collideCallback, config.collideProcess)
    }
  }
}
