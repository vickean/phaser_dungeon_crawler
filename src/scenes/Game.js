import Phaser from 'phaser';
import { debugDraw } from '../utils/debug';
import { createLizardAnims } from '../anims/EnemyAnims';
import { createCharacterAnims } from '../anims/CharacterAnims';
import Lizard from '../enemies/Lizard';
import '../characters/KnightM';

export default class Game extends Phaser.Scene {
  constructor() {
    super('game');
    this.debugOn = false;
    this.playerHit = false;
    this.playerHitStartTime = 0;
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

    // map adding
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

    this.knightM = this.add.knight_m(64, 48, 'knight_m');

    // Lizard generation
    const lizards = this.physics.add.group({
      classType: Lizard,
      createCallback: (child) => {
        child.body.setSize(child.width * 0.7, child.height * 0.6);
        child.body.offset.y = 12;
        child.body.onCollide = true;
      },
    });

    lizards.get(192, 48, 'lizard_f');
    lizards.get(192, 80, 'lizard_f');

    //colliders
    this.physics.add.collider(this.knightM, wallsLayer);
    this.physics.add.collider(lizards, wallsLayer);
    this.physics.add.collider(
      lizards,
      this.knightM,
      this.handlePlayerLizardCollision,
      undefined,
      this
    );

    // to ensure things above player get loaded in last
    map.createLayer('Walls_Above', tileset);

    this.cameras.main.startFollow(this.knightM);
  }

  handlePlayerLizardCollision(knight, lizard) {
    // knckback if hit by lizard
    this.playerHit = true;
    const dx = this.knightM.x - lizard.x;
    const dy = this.knightM.y - lizard.y;
    const dir = new Phaser.Math.Vector2(dx, dy).normalize().scale(200);

    this.knightM.setVelocity(dir.x, dir.y);
  }

  update(t, dt) {
    if (this.playerHit) {
      if (this.playerHitStartTime === 0) {
        this.playerHitStartTime = t;
      }
      if (t - this.playerHitStartTime >= 100) {
        this.playerHit = false;
        this.playerHitStartTime = 0;
        this.knightM.clearTint();
        return;
      }
      this.knightM.anims.play('knight_m_hit', true);
      this.knightM.setTint(0xff0000);
      return;
    }

    if (this.knightM) {
      this.knightM.update(this.cursors);
      return;
    }
  }
}
