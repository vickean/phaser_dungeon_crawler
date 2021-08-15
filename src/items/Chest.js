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
    const coin = this.scene.physics.add.sprite(this.x, this.y, 'treasure');
    coin.play('coin-rotate');
    this.scene.physics.moveTo(coin, this.x, this.y - 1, 100);
    this.scene.time.delayedCall(200, () => {
      coin.destroy();
    });

    return Phaser.Math.Between(50, 200);
  }
}
