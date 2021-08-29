import Phaser from 'phaser';

import { sceneEvents } from '../events/EventCenter';

export default class GameUI extends Phaser.Scene {
  constructor() {
    super('game-ui');

    this.speech_lasttime = 0;
    this.speech_lastphrase = '';
  }

  create() {
    let { width, height } = this.sys.game.canvas;

    const coinsIcon = this.add.sprite(6, 29, 'treasure', 'coin_anim_f0.png');
    coinsIcon.play('coin-rotate');

    // const coinsLabel = this.add.text(12, 20, '0', {
    //   fontSize: '32px',
    //   fontFamily: 'Abaddon-Bold',
    // });

    const coinsLabel = this.add.bitmapText(12, 23, 'abaddon-bold', '0', 30);
    coinsLabel.setTintFill(0xffffff);
    coinsLabel.setLetterSpacing(2);
    coinsLabel.setScale(0.6);

    this.speech = this.add.bitmapText(
      width / 2,
      height - 20,
      'abaddon-bold',
      'Hello there my scaly friends!',
      30
    );
    this.speech.setTintFill(0xffffff);
    this.speech.setLetterSpacing(2);
    this.speech.setScale(0.5);
    this.speech.setOrigin(0.5);

    sceneEvents.on('player-coins-changed', (coins) => {
      coinsLabel.text = coins.toLocaleString();
    });

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
      sceneEvents.off('player-coins-changed');
    });
  }

  update(t, dt) {
    // console.log(t);
    if (this.speech_lasttime === 0) {
      this.speech_lasttime = t;
    }

    if (t - this.speech_lasttime >= 1500) {
      const lastText = this.speech.text;
      this.speech.setText('');
      this.speech_lasttime = 0;
      this.speech_lastphrase = lastText;
    }

    if (
      this.speech_lastphrase === 'Hello there my scaly friends!' &&
      this.speech_lasttime === 0
    ) {
      this.speech.setText('Now prepare to die!');
    }
  }

  handlePlayerHealthChanged(health) {
    const damage_speech = [
      'Owww!',
      'It hurts...',
      'Darn you!',
      'Argh!',
      'Get away from me!',
    ];
    const rand_speech_idx = Phaser.Math.Between(0, damage_speech.length - 1);
    this.speech.setText(damage_speech[rand_speech_idx]);
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
