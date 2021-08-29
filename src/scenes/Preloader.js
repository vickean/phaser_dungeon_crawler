import Phaser from 'phaser';

import dungeonTiles from '../../assets/tiles/0x72_DungeonTilesetII_v1.4_ structures2.png';
import dungeonJson from '../../assets/dungeons/dungeon-01.json';
import knightM from '../../assets/character/knight_m.png';
import knightMJson from '../../assets/character/knight_m.json';
import lizardF from '../../assets/enemies/lizard_f.png';
import lizardFJson from '../../assets/enemies/lizard_f.json';
import heartEmpty from '../../assets/ui/ui_heart_empty.png';
import heartFull from '../../assets/ui/ui_heart_full.png';
import weaponKnife from '../../assets/weapons/weapon_knife.png';
import treasure from '../../assets/items/treasure.png';
import treasureJson from '../../assets/items/treasure.json';
import abaddonTex from '../../assets/fonts/Abaddon-Bold.png';
import abaddonXml from '../../assets/fonts/Abaddon-Bold.xml';

export default class Preloader extends Phaser.Scene {
  constructor() {
    super('preloader');
  }

  preload() {
    this.load.image('tiles', dungeonTiles);
    this.load.tilemapTiledJSON('dungeon', dungeonJson);

    this.load.atlas('knight_m', knightM, knightMJson);
    this.load.atlas('lizard_f', lizardF, lizardFJson);
    this.load.atlas('treasure', treasure, treasureJson);

    this.load.image('ui-heart-empty', heartEmpty);
    this.load.image('ui-heart-full', heartFull);

    this.load.image('weapon-knife', weaponKnife);

    this.load.bitmapFont('abaddon-bold', abaddonTex, abaddonXml);
  }

  create() {
    this.scene.start('game');
  }
}
