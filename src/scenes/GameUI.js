import Phaser from 'phaser';

import { sceneEvents } from '../events/EventCenter';

export default class GameUI extends Phaser.Scene {
  constructor() {
    super('game-ui');
  }

  create() {
    this.hearts = this.add.group({
      classType: Phaser.GameObjects.Image,
    });

    this.hearts.createMultiple({
      key: 'ui-heart-full',
      setXY: {
        x: 10,
        y: 10,
        stepX: 16,
      },
      quantity: 3,
    });

    sceneEvents.on(
      'player-health-changed',
      this.handlePlayerHealthChanged,
      this
    );

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      sceneEvents.off(
        'player-health-changed',
        this.handlePlayerHealthChanged,
        this
      );
    });
  }

  handlePlayerHealthChanged(health) {
    this.hearts.children.each((go, idx) => {
      const heart = go;
      if (idx < health) {
        heart.setTexture('ui-heart-full');
      } else {
        heart.setTexture('ui-heart-empty');
      }
    });
  }
}
