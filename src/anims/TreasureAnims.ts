import Phaser from 'phaser';

export const createChestAnim = (anims: Phaser.Animations.AnimationManager) => {
  anims.create({
    key: 'chest-open',
    frames: anims.generateFrameNames('treasure', {
      start: 0,
      end: 2,
      prefix: 'chest_empty_open_anim_f',
      suffix: '.png',
    }),
  });

  anims.create({
    key: 'chest-close',
    frames: [{ key: 'treasure', frame: 'chest_empty_open_anim_f0.png' }],
  });
};
