import Phaser from 'phaser';
import { debugDraw } from '../utils/debug';
import { createLizardAnims } from '../anims/EnemyAnims';
import { createCharacterAnims } from '../anims/CharacterAnims';
import { createChestAnims } from '../anims/TreasureAnims';
import '../characters/KnightM';
import '../enemies/LizardF';
import { sceneEvents } from '../events/EventCenter';
import Chest from '../items/Chest';
import LizardF from '../enemies/LizardF';

export default class Game extends Phaser.Scene {
  constructor() {
    super('game');
    this.debugOn = false;
  }

  preload() {
    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    });

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
    createChestAnims(this.anims);

    // map adding
    const map = this.make.tilemap({ key: 'dungeon' });
    const tileset = map.addTilesetImage('dungeon', 'tiles');

    map.createLayer('Ground', tileset);
    map.createLayer('Walls_Below', tileset);
    const wallsLayer = map.createLayer('Walls_Collide', tileset);

    const chests = this.physics.add.staticGroup({
      classType: Chest,
    });
    const chestsLayer = map.getObjectLayer('Chests');
    chestsLayer.objects.forEach((chestObj) => {
      chests.get(
        chestObj.x + chestObj.width * 0.5, // compensate for Tiled origin being in Top Right
        chestObj.y - chestObj.height * 0.5, // and Phaser3 being center of object
        'treasure'
      );
    });

    wallsLayer.setCollisionByProperty({ collides: true });

    //debugging only
    if (this.debugOn) {
      debugDraw(wallsLayer, this);
    }

    // Knives
    this.knives = this.physics.add.group({
      classType: Phaser.Physics.Arcade.Image,
      maxSize: 3,
    });

    // add player
    this.knightM = this.add.knight_m(64, 48, 'knight_m');
    this.knightM.setKnives(this.knives);

    // Lizard generation
    this.lizards = this.physics.add.group({
      classType: LizardF,
      createCallback: (lizGo) => {
        lizGo.body.onCollide = true;
      },
    });

    const lizardsLayer = map.getObjectLayer('Lizards');
    lizardsLayer.objects.forEach((lizObj) => {
      this.lizards.get(
        lizObj.x + lizObj.width * 0.5,
        lizObj.y - lizObj.height * 0.5,
        'lizard'
      );
    });

    //colliders
    this.physics.add.collider(this.knightM, wallsLayer);
    this.physics.add.collider(
      this.knightM,
      chests,
      this.handlePlayerChestCollision,
      undefined,
      this
    );
    this.physics.add.collider(this.knightM.dirIndicator, wallsLayer);
    this.physics.add.collider(this.lizards, wallsLayer);
    this.playerLizardsCollider = this.physics.add.collider(
      this.lizards,
      this.knightM,
      this.handlePlayerLizardCollision,
      undefined,
      this
    );
    this.physics.add.collider(
      this.knives,
      wallsLayer,
      this.handleKnifeWallCollision,
      undefined,
      this
    );
    this.physics.add.collider(
      this.knives,
      this.lizards,
      this.handleKnifeLizardCollision,
      undefined,
      this
    );

    // to ensure things above player get loaded in last
    map.createLayer('Walls_Above', tileset);

    this.cameras.main.startFollow(this.knightM);
    this.cameras.main.setRoundPixels(true);
    this.cameras.main.fadeIn(2000);
  }

  handlePlayerChestCollision(player, chest) {
    this.knightM.setChest(chest);
  }

  handleKnifeWallCollision(knife, wall) {
    knife.disableBody(true, true);
  }

  handleKnifeLizardCollision(knife, lizard) {
    lizard.body.setSize(0.5, 0.5);
    knife.disableBody(true, true);
    lizard.killed();

    this.time.delayedCall(
      300,
      () => {
        lizard.disableBody(true, true);
      },
      undefined,
      this
    );
  }

  handlePlayerLizardCollision(knight, lizard) {
    this.cameras.main.shake();
    // knckback if hit by lizard
    const dx = this.knightM.x - lizard.x;
    const dy = this.knightM.y - lizard.y;
    const dir = new Phaser.Math.Vector2(dx, dy).normalize().scale(200);

    this.knightM.handleDamage(dir);

    sceneEvents.emit('player-health-changed', this.knightM.health);

    if (this.knightM.health <= 0) {
      this.cameras.main.fadeOut(2000);
      this.playerLizardsCollider.destroy();
    }
  }

  update(t, dt) {
    if (this.knightM) {
      this.knightM.update(this.cursors, this.wasd, t, dt, this);
      return;
    }
  }
}
