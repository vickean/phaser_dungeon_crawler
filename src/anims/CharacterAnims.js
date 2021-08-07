import Phaser from 'phaser';

const createCharacterAnims = (anims) => {
  anims.create({
    key: 'knight_m_idle',
    frames: anims.generateFrameNames('knight_m', {
      prefix: 'knight_m_idle_anim_f',
      suffix: '.png',
      start: 0,
      end: 3,
    }),
    repeat: -1,
    frameRate: 10,
  });

  anims.create({
    key: 'knight_m_run',
    frames: anims.generateFrameNames('knight_m', {
      prefix: 'knight_m_run_anim_f',
      suffix: '.png',
      start: 0,
      end: 3,
    }),
    repeat: -1,
    frameRate: 10,
  });
};

export { createCharacterAnims };
