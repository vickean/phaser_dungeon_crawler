import Phaser from 'phaser';
import { debugDraw } from '../utils/debug';
import { createLizardAnims } from '../anims/EnemyAnims';
import { createCharacterAnims } from '../anims/CharacterAnims';

export default class Game extends Phaser.Scene {
  constructor() {
    super('game');
    this.debugOn = false;
  }

  preload() {
    this.cursors = this.input.keyboard.createCursorKeys();

    // sets debugOn based on debug setting in main Phaser config
    if (this.game) {
      this.debugOn = this.game.config.physics.arcade.debug;
    }
  }

  create() {
    // create anims
    createLizardAnims(this.anims);
    createCharacterAnims(this.anims);

    const map = this.make.tilemap({ key: 'dungeon' });
    const tileset = map.addTilesetImage('dungeon', 'tiles');

    map.createLayer('Ground', tileset);
    map.createLayer('Walls_Below', tileset);
    const wallsLayer = map.createLayer('Walls_Collide', tileset);

    wallsLayer.setCollisionByProperty({ collides: true });

    //debugging only
    if (this.debugOn) {
      debugDraw(wallsLayer, this);
    }

    this.knightM = this.physics.add.sprite(
      64,
      48,
      'knight_m',
      'knight_m_idle_anim_f0.png'
    );
    this.knightM.body.setSize(
      this.knightM.width * 0.7,
      this.knightM.height * 0.6
    );
    this.knightM.body.offset.y = 12;

    this.physics.add.collider(this.knightM, wallsLayer);

    const lizardF = this.physics.add.sprite(
      192,
      48,
      'lizard_f',
      'lizard_f_idle_anim_f0.png'
    );
    lizardF.body.setSize(this.knightM.width * 0.7, this.knightM.height * 0.6);
    lizardF.body.offset.y = 12;

    lizardF.anims.play('lizard_f_idle');

    // to ensure things above player get loaded in last
    map.createLayer('Walls_Above', tileset);

    this.cameras.main.startFollow(this.knightM);
  }

  update(t, dt) {
    if (!this.cursors || !this.knightM) {
      return;
    }

    const speed = 100;
    if (this.cursors.left.isDown) {
      this.knightM.anims.play('knight_m_run', true);
      this.knightM.setVelocity(-speed, 0);

      if (!this.knightM.flipX) {
        this.knightM.toggleFlipX();
      }
    } else if (this.cursors.right.isDown) {
      this.knightM.anims.play('knight_m_run', true);
      this.knightM.setVelocity(speed, 0);

      if (this.knightM.flipX) {
        this.knightM.toggleFlipX();
      }
    } else if (this.cursors.up.isDown) {
      this.knightM.anims.play('knight_m_run', true);
      this.knightM.setVelocity(0, -speed);
    } else if (this.cursors.down.isDown) {
      this.knightM.anims.play('knight_m_run', true);
      this.knightM.setVelocity(0, speed);
    } else {
      this.knightM.setVelocity(0, 0);
      this.knightM.anims.play('knight_m_idle', true);
    }
  }
}
