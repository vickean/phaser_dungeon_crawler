import Phaser from 'phaser';

const createChestAnims = (anims) => {
  anims.create({
    key: 'chest-open',
    frames: anims.generateFrameNames('treasure', {
      prefix: 'chest_empty_open_anim_f',
      suffix: '.png',
      start: 0,
      end: 2,
    }),
    frameRate: 5,
  });

  anims.create({
    key: 'chest-closed',
    frames: [{ key: 'treasure', frame: 'chest_empty_open_anim_f0.png' }],
  });
};

export { createChestAnims };
