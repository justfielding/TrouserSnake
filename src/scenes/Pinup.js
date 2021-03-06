const getRandomNumber = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

class Pinup extends Phaser.Scene {
  constructor() {
    super({
      key: 'Pinup',
      active: false,
    });
  }

  create() {
    // replace with registy scale factor
    const actualScale = Math.min(
      this.sys.game.config.width / 3840,
      this.sys.game.config.height / 2160
    );

    const scale = actualScale > 0.5 ? 1 : 0.5;

    this.cameras.main.setViewport(
      this.registry.values.ui.x + (this.registry.values.ui.width * 0.2638888889 * scale) - (1024 * scale / 2),
      this.registry.values.ui.y + (this.registry.values.ui.height / 2 * scale) - (1024 * scale / 2),
      // 875 * scale,
      // 580 * scale,
      1024 * scale,
      1024 * scale
    );

    const placeholder = this.add
      .image(0, 0, 'skb-placeholder')
      .setScale(scale)
      .setOrigin(0);

    let frame = 0;
    // if(this.collected) this.collected.clear()
    this.collected = this.add.group();
    this.pieces = this.add.group();


    // temp code to reuse the 4 pinups over and over until levels are done
    let adjustedLevel = this.registry.values.level % 4;
    adjustedLevel = adjustedLevel === 0 ? 4 : adjustedLevel;
    console.debug(adjustedLevel);

    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 4; j++) {
        this.pieces
          .create(
            j * ((1024 * scale) / 4),
            i * ((1024 * scale) / 5),
            `pinup-${adjustedLevel}`,
            frame
          )
          .setOrigin(0, 0)
          .setScale(scale);
        frame++;
      }
    }

    Phaser.Actions.SetVisible(this.pieces.getChildren(), false);

    this.registry.events.on('changedata', this.updateData, this);
    this.events.once('shutdown', this.shutdown, this);
  }

  showRandomPiece() {
    const difference = (a, b) => {
      const s = new Set(b);
      return a.filter(x => !s.has(x));
    };

    const invisiblePieces = difference(
      this.pieces.getChildren(),
      this.collected.getChildren()
    );
    const randomPiece =
      invisiblePieces[
        getRandomNumber(
          0,
          this.pieces.getLength() - this.collected.getLength() - 1
        )
      ];
    this.collected.add(randomPiece);
  }

  update() {
    Phaser.Actions.SetVisible(this.collected.getChildren(), true);
  }

  updateData(parent, key, data) {
    // if ((key === 'LevelComplete' || key === 'GameOver') && data === true) {
    //   // this.reset();
    // }

    if (
      key === 'score' &&
      data < 200 &&
      data > 0 &&
      this.registry.values.GameOver === false
    ) {
      this.showRandomPiece();
    }
  }

  shutdown() {
    this.registry.events.off('changedata', this.updateData, this);
  }
}

export default Pinup;
