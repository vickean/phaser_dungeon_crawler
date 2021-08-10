import Phaser from 'phaser';

const HealthState = {
  IDLE: 0,
  DAMAGE: 1,
  DEAD: 2,
};

const Direction = {
  UP: 0,
  DOWN: 1,
  LEFT: 2,
  RIGHT: 3,
};

const setRotation = (go, degree) => {
  go.setRotation(Phaser.Math.DegToRad(degree));
};

export default class KnightM extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture, frame) {
    super(scene, x, y, texture, frame);
    this.heathState = HealthState.IDLE;
    this.damageTime = 0;
    this._health = 3;
    this.lastDir = Direction.RIGHT;
  }

  get health() {
    return this._health;
  }

  setKnives(knives) {
    this.knives = knives;
  }

  setDirIndicator(indicator) {
    this.dirIndicator = indicator;
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
      // if dead
      this.healthState = HealthState.DEAD;
      this.setTint(0x000000);
      this.anims.stop();
      this.setVelocity(0, 0);
      this.dirIndicator.setVisible(false);
    } else {
      this.setVelocity(dir.x, dir.y);

      this.setTint(0xff0000);

      this.healthState = HealthState.DAMAGE;
      this.damageTime = 0;
    }
  }

  throwKnife() {
    if (!this.knives) {
      return;
    }

    const vec = new Phaser.Math.Vector2(0, 0);

    switch (this.lastDir) {
      case Direction.UP:
        vec.y = -1;
        break;
      case Direction.DOWN:
        vec.y = 1;
        break;
      case Direction.LEFT:
        vec.x = -1;
        break;
      case Direction.RIGHT:
        vec.x = 1;
        break;
    }

    const angle = vec.angle();
    const knife = this.knives.get(this.x, this.y, 'weapon-knife');
    if (vec.y !== 0) {
      knife.body.setSize(knife.height, knife.width);
    } else {
      knife.body.setSize(knife.width, knife.height);
    }
    knife.enableBody(true, this.x, this.y, true, true);

    knife.setRotation(angle);

    knife.x += vec.x * 16;
    knife.y += (vec.y || 1) * (vec.y === 1 ? 18 : 8);

    knife.setVelocity(vec.x * 300, vec.y * 300);
  }

  setDirArrowPosition() {
    //set this.dirIndicator position based on this.lastDir
    const vec = new Phaser.Math.Vector2(this.x, this.y);

    switch (this.lastDir) {
      case Direction.UP:
        if (!this.dirIndicator.flipX) {
          setRotation(this.dirIndicator, 270);
        } else {
          setRotation(this.dirIndicator, 90);
        }
        vec.y += 0;
        break;
      case Direction.DOWN:
        if (this.dirIndicator.flipX) {
          setRotation(this.dirIndicator, 270);
        } else {
          setRotation(this.dirIndicator, 90);
        }
        vec.y += 14;
        break;
      case Direction.LEFT:
        setRotation(this.dirIndicator, 0);
        if (!this.dirIndicator.flipX) {
          this.dirIndicator.toggleFlipX();
        }
        vec.x -= 4;
        vec.y += 9;
        break;
      case Direction.RIGHT:
        setRotation(this.dirIndicator, 0);
        if (this.dirIndicator.flipX) {
          this.dirIndicator.toggleFlipX();
        }
        vec.x += 4;
        vec.y += 9;
        break;
    }

    this.dirIndicator.x = vec.x;
    this.dirIndicator.y = vec.y;
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

    this.setDirArrowPosition();
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

    if (Phaser.Input.Keyboard.JustDown(cursors.space)) {
      this.throwKnife();
      return;
    }

    const speed = 100;
    if (cursors.left.isDown) {
      this.lastDir = Direction.LEFT;
      this.anims.play('knight_m_run', true);
      this.setVelocity(-speed, 0);

      if (!this.flipX) {
        this.toggleFlipX();
      }
    } else if (cursors.right.isDown) {
      this.lastDir = Direction.RIGHT;
      this.anims.play('knight_m_run', true);
      this.setVelocity(speed, 0);

      if (this.flipX) {
        this.toggleFlipX();
      }
    } else if (cursors.up.isDown) {
      this.lastDir = Direction.UP;
      this.anims.play('knight_m_run', true);
      this.setVelocity(0, -speed);
    } else if (cursors.down.isDown) {
      this.lastDir = Direction.DOWN;
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

    // add direction indicator
    const dirArrow = this.scene.add.sprite(x + 4, y + 9, 'weapon-knife');
    sprite.setDirIndicator(dirArrow);

    return sprite;
  }
);
