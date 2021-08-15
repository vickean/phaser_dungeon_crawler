import Phaser from 'phaser';

export default class Chest extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture, frame) {
    super(scene, x, y, texture, frame);

    this.play('chest-closed');
  }

  open() {
    if (this.anims.currentAnim.key === 'chest-open') {
      return 0;
    }
    this.play('chest-open');
    return Phaser.Math.Between(50, 200);
  }
}
