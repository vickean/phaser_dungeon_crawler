import Phaser from 'phaser';

import dungeonTiles from '../../assets/tiles/0x72_DungeonTilesetII_v1.4_ structures2.png';
import dungeonJson from '../../assets/dungeons/dungeon-01.json';
import knightM from '../../assets/character/knight_m.png';
import knightMJson from '../../assets/character/knight_m.json';
import lizardF from '../../assets/enemies/lizard_f.png';
import lizardFJson from '../../assets/enemies/lizard_f.json';

export default class Preloader extends Phaser.Scene {
  constructor() {
    super('preloader');
  }

  preload() {
    this.load.image('tiles', dungeonTiles);
    this.load.tilemapTiledJSON('dungeon', dungeonJson);

    this.load.atlas('knight_m', knightM, knightMJson);
    this.load.atlas('lizard_f', lizardF, lizardFJson);
  }

  create() {
    this.scene.start('game');
  }
}
