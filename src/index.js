import '../styles.css';
import Phaser from 'phaser';

import Preloader from './scenes/Preloader';
import Game from './scenes/Game';

export default new Phaser.Game({
  type: Phaser.AUTO,
  width: 400,
  height: 250,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
    },
  },
  scene: [Preloader, Game],
  scale: {
    zoom: 2,
  },
});
