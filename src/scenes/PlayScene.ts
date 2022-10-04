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
    this.initAnimate();
  }

  // 设置初始动画
  initAnimate() {
    // 小恐龙跑步动画
    this.anims.create({
      key: 'dino-run-anim',
      frames: this.anims.generateFrameNames('dino-run'),
      frameRate: 10,
      repeat: -1,
    });

    // 小恐龙下蹲动画
    this.anims.create({
      key: 'dino-down-anim',
      frames: this.anims.generateFrameNames('dino-down'),
      frameRate: 10,
      repeat: -1,
    });

    // 翼龙飞行动画
    this.anims.create({
      key: 'enemy-bird-anim',
      frames: this.anims.generateFrameNames('enemy-bird'),
      frameRate: 6,
      repeat: -1,
    });
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

    // 判断身体是否 y 方向偏移，若 true 则为跳起
    if (this.dino.body.deltaAbsY() > 0) {
      // 跳起时停止播放动画，贴图设为跑步动画的第 0 帧
      this.dino.anims.stop()
      this.dino.setTexture('dino-run', 0)
    } else {
      if (this.dino.body.height <= 58) {
        this.dino.play('dino-down-anim', true);
      } else {
        this.dino.play('dino-run-anim', true);
      }
    }
  }
}
