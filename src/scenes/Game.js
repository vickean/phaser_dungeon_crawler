import Phaser from 'phaser';
import { debugDraw } from '../utils/debug';
import { createLizardAnims } from '../anims/EnemyAnims';
import { createCharacterAnims } from '../anims/CharacterAnims';
import '../characters/KnightM';
import '../enemies/LizardF';
import { sceneEvents } from '../events/EventCenter';

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
    // run UI scene alongside Game scene
    this.scene.run('game-ui');

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
    const lizards = this.physics.add.group();
    lizards.addMultiple(
      [
        this.add.lizard_f(192, 48, 'lizard_f'),
        this.add.lizard_f(192, 80, 'lizard_f'),
      ],
      true
    );

    //colliders
    this.physics.add.collider(this.knightM, wallsLayer);
    this.physics.add.collider(lizards, wallsLayer);
    this.playerLizardsCollider = this.physics.add.collider(
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
    const dx = this.knightM.x - lizard.x;
    const dy = this.knightM.y - lizard.y;
    const dir = new Phaser.Math.Vector2(dx, dy).normalize().scale(200);

    this.knightM.handleDamage(dir);

    sceneEvents.emit('player-health-changed', this.knightM.health);

    if (this.knightM.health <= 0) {
      this.playerLizardsCollider.destroy();
    }
  }

  update(t, dt) {
    if (this.knightM) {
      this.knightM.update(this.cursors);
      return;
    }
  }
}
