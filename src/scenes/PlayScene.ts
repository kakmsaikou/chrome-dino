import * as Phaser from 'phaser';

export class PlayScene extends Phaser.Scene {
  private ground: Phaser.GameObjects.TileSprite;
  private dino: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private startTrigger: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private obstacles: Phaser.Physics.Arcade.Group;
  private gameOverScreen: Phaser.GameObjects.Container;
  private gameOverText: Phaser.GameObjects.Image;
  private restart: Phaser.GameObjects.Image;
  private isGameRunning: boolean;
  private respawnTime: number;

  private gameSpeed: number;

  constructor() {
    super('PlayScene');

    this.gameSpeed = 10;
    this.respawnTime = 0;
  }

  create(): void {
    const {width, height} = this.game.config;

    this.isGameRunning = false;

    this.gameOverScreen = this.add
      .container((width as number) / 2, (height as number) / 2 - 50)
      .setAlpha(0); // 默认结束界面透明度为 0

    this.gameOverText = this.add.image(0, 0, 'game-over');

    this.restart = this.add.image(0, 0, 'restart');

    this.gameOverScreen.add([this.gameOverText, this.restart]);

    // 在小恐龙正上方添加一个触发器
    this.startTrigger = this.physics.add
      .sprite(0, 10, null)
      .setOrigin(0, 1);

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

    this.obstacles = this.physics.add.group();

    this.handleInputs();
    this.initAnimate();
    this.initStartTrigger();
    this.initColliders();
  }

  initColliders() {
    this.physics.add.collider(this.dino, this.obstacles, () => {
      console.log('小恐龙碰到障碍物');

      this.physics.pause();
      this.isGameRunning = false;
      this.anims.pauseAll();
      this.dino.setTexture('dino-hurt');
      this.respawnTime = 0;
      this.gameOverScreen.setAlpha(1);
    });
  }

  placeObstacle() {
    const {width, height} = this.game.config;
    // 决定生成 7 种障碍中的哪一个（6 仙人掌 + 1 翼龙）
    const obstacleNum = Math.floor(Math.random() * 7) + 1;
    // 设置障碍物之间的距离
    const distance = Phaser.Math.Between(600, 900);
    let obstacle;

    // obstacleNum > 6 生成翼龙
    if (obstacleNum > 6) {
      const enemyHeight = [44, 66];
      obstacle = this.obstacles.create(
        (width as number) + distance,
        (height as number) - enemyHeight[Math.floor(Math.random() * 2)],
        'enemy-bird')
        .setOrigin(0, 1);

      obstacle.body.height = obstacle.body.height / 1.5;
      obstacle.play('enemy-bird-anim', true);
    } else {
      obstacle = this.obstacles
        .create(
          (width as number) + distance,
          height as number,
          `obstacle-${obstacleNum}`)
        .setOrigin(0, 1);
    }
  }

  initStartTrigger() {
    const {width, height} = this.game.config;
    // 小恐龙和触发器接触后触发
    this.physics.add.overlap(this.startTrigger, this.dino, () => {
      // 如果触发器存在，则让触发器掉到地图正下方，并且取消激活、隐藏对象
      if (this.startTrigger.y === 10) {
        this.startTrigger.body.reset(0, height as number);
        this.startTrigger.disableBody(true, true);

        // 为 time 添加 startEvent() 展开地图
        const startEvent = this.time.addEvent({
          delay: 10,
          loop: true,
          callbackScope: this,
          callback: () => {
            if (this.ground.width < width) {
              this.ground.width += 20;
            }

            // 当地图展开到最大时，移除startEvent，并开始游戏
            if (this.ground.width >= width) {
              // @ts-ignore
              this.ground.width = width;
              this.isGameRunning = true;
              startEvent.remove();
            }
          }
        });
      }
    });
  }

  // 初始化动画
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
    if (!this.isGameRunning) return;

    this.ground.tilePositionX += this.gameSpeed;
    Phaser.Actions.IncX(this.obstacles.getChildren(), -this.gameSpeed);

    this.respawnTime += delta * this.gameSpeed;

    if (this.respawnTime >= 15000) {
      this.placeObstacle();
      this.respawnTime = 0;
    }

    this.obstacles.getChildren();
    // TODO 释放资源

    // 判断身体是否 y 方向偏移，若 true 则为跳起
    if (this.dino.body.deltaAbsY() > 0) {
      // 跳起时停止播放动画，贴图设为跑步动画的第 0 帧
      this.dino.anims.stop();
      this.dino.setTexture('dino-run', 0);
    } else {
      if (this.dino.body.height <= 58) {
        this.dino.play('dino-down-anim', true);
      } else {
        this.dino.play('dino-run-anim', true);
      }
    }
  }
}
