import Phaser from 'phaser';

export default class KnightM extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture, frame) {
    super(scene, x, y, texture, frame);
  }

  handleDamage(dir) {}

  update(cursors) {
    if (!cursors) {
      return;
    }

    const speed = 100;
    if (cursors.left.isDown) {
      this.anims.play('knight_m_run', true);
      this.setVelocity(-speed, 0);

      if (!this.flipX) {
        this.toggleFlipX();
      }
    } else if (cursors.right.isDown) {
      this.anims.play('knight_m_run', true);
      this.setVelocity(speed, 0);

      if (this.flipX) {
        this.toggleFlipX();
      }
    } else if (cursors.up.isDown) {
      this.anims.play('knight_m_run', true);
      this.setVelocity(0, -speed);
    } else if (cursors.down.isDown) {
      this.anims.play('knight_m_run', true);
      this.setVelocity(0, speed);
    } else {
      this.setVelocity(0, 0);
      this.anims.play('knight_m_idle', true);
    }
  }
}

Phaser.GameObjects.GameObjectFactory.register(
  'knight_m',
  function (x, y, texture, frame) {
    const sprite = new KnightM(this.scene, x, y, texture, frame);

    this.displayList.add(sprite);
    this.updateList.add(sprite);

    this.scene.physics.world.enableBody(
      sprite,
      Phaser.Physics.Arcade.DYNAMIC_BODY
    );

    sprite.body.setSize(sprite.width * 0.7, sprite.height * 0.6);
    sprite.body.offset.y = 12;

    return sprite;
  }
);
