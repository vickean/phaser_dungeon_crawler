import Phaser from 'phaser';

const Direction = {
  UP: 0,
  DOWN: 1,
  LEFT: 2,
  RIGHT: 3,
};

const randomDirection = (exclude) => {
  let dir = Phaser.Math.Between(0, 2);
  if (dir >= exclude) dir++;
  return dir;
};

export default class Lizard extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture, frame) {
    super(scene, x, y, texture, frame);

    this.anims.play('lizard_f_idle');

    this.direction = Direction.RIGHT;

    scene.physics.world.on(
      Phaser.Physics.Arcade.Events.TILE_COLLIDE,
      this.handleTileCollision,
      this
    );

    this.moveEvent = scene.time.addEvent({
      delay: 2000,
      callback: () => {
        this.direction = randomDirection(this.direction);
      },
      loop: true,
    });
  }

  preUpdate(t, dt) {
    super.preUpdate(t, dt);

    const speed = 50;

    switch (this.direction) {
      case Direction.UP:
        this.anims.play('lizard_f_run', true);
        this.setVelocity(0, -speed);
        break;
      case Direction.DOWN:
        this.anims.play('lizard_f_run', true);
        this.setVelocity(0, speed);
        break;
      case Direction.LEFT:
        this.anims.play('lizard_f_run', true);
        this.setVelocity(-speed, 0);
        if (!this.flipX) {
          this.toggleFlipX();
        }
        break;
      case Direction.RIGHT:
        this.anims.play('lizard_f_run', true);
        this.setVelocity(speed, 0);
        if (this.flipX) {
          this.toggleFlipX();
        }
        break;
    }
  }

  // cleanup when destroying Lizard instances so that event won't run forever
  destroy(fromScene) {
    this.moveEvent.destroy();

    super.destroy(fromScene);
  }

  handleTileCollision(go, tile) {
    if (go != this) {
      return;
    }

    this.direction = randomDirection(this.direction);
  }
}
