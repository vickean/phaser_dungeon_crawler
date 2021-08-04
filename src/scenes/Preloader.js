import Phaser from 'phaser';

import dungeonTiles from '../../assets/tiles/0x72_DungeonTilesetII_v1.4_ structures2.png';
import dungeonJson from '../../assets/dungeons/dungeon-01.json';

export default class Preloader extends Phaser.Scene {
  constructor() {
    super('preloader');
  }

  preload() {
    this.load.image('tiles', dungeonTiles);
    this.load.tilemapTiledJSON('dungeon', dungeonJson);
  }

  create() {
    this.scene.start('game');
  }
}
