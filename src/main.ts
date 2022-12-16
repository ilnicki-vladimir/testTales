import Phaser from 'phaser';

import Preloader from './scenes/Preloader';
import Game from './scenes/Game';
import GameUI from './scenes/GameUI';
import { CollisionConfig } from './core/interfaces/CollisionConfig';

Phaser.GameObjects.Group.prototype['addCollisions'] = function(configs: CollisionConfig[]) {
  for(const config of configs) {
    this.scene.physics.add.collider(this, config.collideWith, config.collideCallback, config.collideProcess)
  }
}

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: window.innerWidth / 2,
  height: window.innerHeight / 2,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: true,
    },
  },
  scene: [Preloader, Game, GameUI],
  scale: {
    zoom: 1.5,
  },
};
export default new Phaser.Game(config);
