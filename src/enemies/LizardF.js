import Phaser from 'phaser';

import { sceneEvents } from '../events/EventCenter';

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

export default class LizardF extends Phaser.Physics.Arcade.Sprite {
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

    this.dead = false;
  }

  killed() {
    this.dead = true;
    this.anims.stop();
    this.setTint(0xff0000);
  }

  preUpdate(t, dt) {
    super.preUpdate(t, dt);

    if (this.dead) {
      return;
    }

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

// allows the use of this.add.lizard_f in scenes
Phaser.GameObjects.GameObjectFactory.register(
  'lizard_f',
  function (x, y, texture, frame) {
    const sprite = new LizardF(this.scene, x, y, texture, frame);

    this.displayList.add(sprite);
    this.updateList.add(sprite);

    this.scene.physics.world.enableBody(
      sprite,
      Phaser.Physics.Arcade.DYNAMIC_BODY
    );

    sprite.enableBody(true, x, y, true, true);

    sprite.body.setSize(sprite.width * 0.7, sprite.height * 0.6);
    sprite.body.offset.y = 12;
    sprite.body.onCollide = true;

    return sprite;
  }
);
