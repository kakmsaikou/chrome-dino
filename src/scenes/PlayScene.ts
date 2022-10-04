import * as Phaser from 'phaser';

export class PlayScene extends Phaser.Scene {
  private ground: Phaser.GameObjects.TileSprite;
  private dino: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private gameSpeed: number;

  constructor() {
    super('PlayScene');

    this.gameSpeed = 10;
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
      .setGravityY(5000) // 设置向下重力
      .setCollideWorldBounds(true) // 允许小恐龙与世界碰撞
      .setOrigin(0, 1);

    this.handleInputs();
  }

  handleInputs() {
    // 每次按空格，给予小恐龙一个 -1600 的向上的速度
    this.input.keyboard.on('keydown-SPACE', () => {
      if (!this.dino.body.onFloor()) {
        return;
      }

      // @ts-ignore
      this.dino.body.height = 92;
      this.dino.body.offset.y = 0;

      this.dino.setVelocity(-1600);
    });

    // 按下 ↓ 键，小恐龙身体变矮
    this.input.keyboard.on('keydown-DOWN', () => {
      // @ts-ignore
      this.dino.body.height = 58;
      this.dino.body.offset.y = 34; // 下蹲时 height + offset.y == 92 即身体高度
    });

    // 松开 ↓ 键，小恐龙身体恢复
    this.input.keyboard.on('keyup-DOWN', () => {
      // @ts-ignore
      this.dino.body.height = 92;
      this.dino.body.offset.y = 0; // 下蹲时 height + offset.y == 92 即身体高度
    });
  }

  // 滚动地图
  update(time: number, delta: number) {
    this.ground.tilePositionX += this.gameSpeed;
  }
}
