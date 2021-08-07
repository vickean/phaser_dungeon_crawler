import Phaser from 'phaser';

const createLizardAnims = (anims) => {
  anims.create({
    key: 'lizard_f_idle',
    frames: anims.generateFrameNames('lizard_f', {
      prefix: 'lizard_f_idle_anim_f',
      suffix: '.png',
      start: 0,
      end: 3,
    }),
    repeat: -1,
    frameRate: 10,
  });

  anims.create({
    key: 'lizard_f_run',
    frames: anims.generateFrameNames('lizard_f', {
      prefix: 'lizard_f_run_anim_f',
      suffix: '.png',
      start: 0,
      end: 3,
    }),
    repeat: -1,
    frameRate: 10,
  });
};

export { createLizardAnims };
