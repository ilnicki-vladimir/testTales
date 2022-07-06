import Phaser from 'phaser';

export class Chest extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
    super(scene, x, y, texture, frame);

    this.play('chest-close');
  }

  open() {
    if (this.anims.currentAnim.key !== 'chest-close') {
      return 0;
    }
    this.play('chest-open');
    return Phaser.Math.Between(50, 200);
  }
}
