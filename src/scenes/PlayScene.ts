import * as Phaser from 'phaser';

export class PlayScene extends Phaser.Scene {
  private ground: Phaser.GameObjects.TileSprite;

  constructor() {
    super('PlayScene');
  }

  create(): void {
    const {width, height} = this.game.config;

    this.ground = this.add
      .tileSprite(0, height as number, width as number, 26, 'ground')
      .setOrigin(0, 1);
  }
}
