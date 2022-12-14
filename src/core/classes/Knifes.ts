import { ThrowableWeapon } from './Weapon';
import Phaser from 'phaser';
import { Image } from './Image';
import { Character } from './Character';

export class Knifes extends ThrowableWeapon {
  hit(): void {
      const knife = this.get(this.holder.x, this.holder.y, 'knife') as Image;
      const parts = this.holder.anims.currentAnim.key.split('-');
      const direction = parts[2];

      const vec = new Phaser.Math.Vector2(0, 0);
      switch (direction) {
        case 'up':
          vec.y = -1;
          break;
        case 'down':
          vec.y = 1;
          break;
        case 'side':
          if (this.holder.scaleX < 0) {
            vec.x = -1;
          } else {
            vec.x = 1;
          }
          break;
      }

      const angle = vec.angle();

      knife.setActive(true);
      knife.setVisible(true);

      knife.setRotation(angle);
      knife.x += vec.x * 16;
      knife.y += vec.y * 16;

      knife.setVelocity(vec.x * 300, vec.y * 300);
    }
}
