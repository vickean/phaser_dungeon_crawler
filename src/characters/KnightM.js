import Phaser from 'phaser';

const HealthState = {
  IDLE: 0,
  DAMAGE: 1,
  DEAD: 2,
};

export default class KnightM extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture, frame) {
    super(scene, x, y, texture, frame);
    this.heathState = HealthState.IDLE;
    this.damageTime = 0;
    this._health = 3;
  }

  get health() {
    return this._health;
  }

  handleDamage(dir) {
    if (this._health <= 0) {
      return;
    }

    if (this.healthState === HealthState.DAMAGE) {
      return;
    }

    --this._health;

    if (this._health <= 0) {
      this.healthState = HealthState.DEAD;
      this.setTint(0x000000);
      this.anims.stop();
      this.setVelocity(0, 0);
    } else {
      this.setVelocity(dir.x, dir.y);

      this.setTint(0xff0000);

      this.healthState = HealthState.DAMAGE;
      this.damageTime = 0;
    }
  }

  preUpdate(t, dt) {
    super.preUpdate(t, dt);

    switch (this.healthState) {
      case HealthState.IDLE:
        break;

      case HealthState.DAMAGE:
        this.damageTime += dt;
        if (this.damageTime >= 200) {
          this.healthState = HealthState.IDLE;
          this.clearTint();
          this.damageTime = 0;
        }
        break;
    }
  }

  update(cursors) {
    if (
      this.healthState === HealthState.DAMAGE ||
      this.healthState === HealthState.DEAD
    ) {
      return;
    }

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
