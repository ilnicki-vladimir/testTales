import Phaser from 'phaser';

export class Chest extends Phaser.Physics.Arcade.Sprite {
  get coins() {
    return Phaser.Math.Between(50, 200);
  }
  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
    super(scene, x, y, texture, frame);

    this.play('chest-closed');
  }

  open() {}
}
