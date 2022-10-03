import * as Phaser from 'phaser';

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super('PreloadScene');
  }

  preload() {
    this.load.setBaseURL('https://cdn-1302120008.cos.ap-nanjing.myqcloud.com/game/dino/assets/');
    this.load.audio('jump', 'jump.m4a');
    this.load.audio('hit', 'hit.m4a');
    this.load.audio('reach', 'reach.m4a');

    this.load.image('dino-hurt', 'dino-hurt.png');
    this.load.image('restart', 'restart.png');
    this.load.image('game-over', 'game-over.png');
    this.load.image('dino-idle', 'dino-idle.png');
    this.load.image('ground', 'ground.png');

    this.load.spritesheet('dino-run', 'dino-run.png', {
      frameWidth: 88,
      frameHeight: 94
    });

    this.load.spritesheet('dino-down', 'dino-down.png', {
      frameWidth: 118,
      frameHeight: 94
    });

    this.load.spritesheet('enemy-bird', 'enemy-bird.png', {
      frameWidth: 92,
      frameHeight: 77
    });

    this.load.image('obstacle-1', 'cactuses_small_1.png');
    this.load.image('obstacle-2', 'cactuses_small_2.png');
    this.load.image('obstacle-3', 'cactuses_small_3.png');
    this.load.image('obstacle-4', 'cactuses_big_1.png');
    this.load.image('obstacle-5', 'cactuses_big_2.png');
    this.load.image('obstacle-6', 'cactuses_big_3.png');
  }

  create() {
    this.scene.start('PlayScene');
  }
}
