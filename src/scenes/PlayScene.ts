import * as Phaser from 'phaser';

export class PlayScene extends Phaser.Scene {
  private ground: Phaser.GameObjects.TileSprite;
  private dino: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

  constructor() {
    super('PlayScene');
  }

  create(): void {
    const {width, height} = this.game.config;

    // 加载地图资源
    this.ground = this.add
      .tileSprite(0, height as number, width as number, 26, 'ground')
      .setOrigin(0, 1); // 把地图原点设为左下角

    // 加载小恐龙
    this.dino = this.physics.add
      .sprite(0, height as number, 'dino-idle')
      .setOrigin(0, 1);

    this.handleInputs()
  }

  handleInputs(){
    this.input.keyboard.on('keydown-SPACE',()=>{
      console.log('按下空格')
    })
  }
}
