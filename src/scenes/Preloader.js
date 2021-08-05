import Phaser from 'phaser';

import dungeonTiles from '../../assets/tiles/0x72_DungeonTilesetII_v1.4_ structures2.png';
import dungeonJson from '../../assets/dungeons/dungeon-01.json';
import knightM from '../../assets/character/m_knight.png';
import knightMJson from '../../assets/character/m_knight.json';

export default class Preloader extends Phaser.Scene {
  constructor() {
    super('preloader');
  }

  preload() {
    this.load.image('tiles', dungeonTiles);
    this.load.tilemapTiledJSON('dungeon', dungeonJson);

    this.load.atlas('knight_m', knightM, knightMJson);
  }

  create() {
    this.scene.start('game');
  }
}
