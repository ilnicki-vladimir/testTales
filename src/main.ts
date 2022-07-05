import Phaser from 'phaser';

import Preloader from './scenes/Preloader';
import Game from './scenes/Game';
import GameUI from './scenes/GameUI';

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 500,
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
