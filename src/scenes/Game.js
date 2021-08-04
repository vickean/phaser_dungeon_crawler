import Phaser from 'phaser';

export default class Game extends Phaser.Scene {
  constructor() {
    super('game');
    this.debugOn = true;
  }

  preload() {}

  create() {
    const map = this.make.tilemap({ key: 'dungeon' });
    const tileset = map.addTilesetImage('dungeon', 'tiles');

    map.createLayer('Ground', tileset);
    map.createLayer('Walls_Below', tileset);
    const wallsLayer = map.createLayer('Walls_Collide', tileset);
    map.createLayer('Walls_Above', tileset);

    wallsLayer.setCollisionByProperty({ collides: true });

    //debugging only
    if (this.debugOn) {
      const debugGraphics = this.add.graphics().setAlpha(0.75);
      wallsLayer.renderDebug(debugGraphics, {
        tileColor: null, // Color of non-colliding tiles
        collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
        faceColor: new Phaser.Display.Color(40, 39, 37, 255), // Color of colliding face edges
      });
    }
  }
}
