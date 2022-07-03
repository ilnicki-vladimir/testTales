import Phaser from "phaser";

export default class Game extends Phaser.Scene {
  private cursor: Phaser.Types.Input.Keyboard.CursorKeys;
  private faune: Phaser.Physics.Arcade.Sprite;

  constructor() {
    super("game");
  }

  preload() {
    this.cursor = this.input.keyboard.createCursorKeys();
  }

  create() {
    // this.add.image(20, 20, "tiles");
    const map = this.make.tilemap({ key: "DungeonTiles" });
    const tileset = map.addTilesetImage("DungeonTiles", "tiles");
    map.createLayer("Grounds", tileset);
    const wallsLayer = map.createLayer("Walls", tileset);
    wallsLayer.setCollisionByProperty({ collision: true });

    const debugGraphics = this.add.graphics().setAlpha(0.7);
    wallsLayer.renderDebug(debugGraphics, {
      tileColor: null,
      collidingTileColor: new Phaser.Display.Color(243, 234, 48, 255),
      faceColor: new Phaser.Display.Color(40, 39, 37, 255),
    });

    this.faune = this.physics.add.sprite(128, 128, "faune", "walk-down-3.png");
    this.faune.body.setSize(this.faune.width * 0.5, this.faune.height * 0.8);

    this.anims.create({
      key: "faune-idle-down",
      frames: [{ key: "faune", frame: "walk-down-3.png" }],
    });

    this.anims.create({
      key: "faune-idle-up",
      frames: [{ key: "faune", frame: "walk-up-3.png" }],
    });

    this.anims.create({
      key: "faune-idle-side",
      frames: [{ key: "faune", frame: "walk-side-3.png" }],
    });

    this.anims.create({
      key: "faune-run-down",
      frames: this.anims.generateFrameNames("faune", {
        start: 1,
        end: 8,
        prefix: "run-down-",
        suffix: ".png",
      }),
      repeat: -1,
      frameRate: 15,
    });

    this.anims.create({
      key: "faune-run-up",
      frames: this.anims.generateFrameNames("faune", {
        start: 1,
        end: 8,
        prefix: "run-up-",
        suffix: ".png",
      }),
      repeat: -1,
      frameRate: 15,
    });

    this.anims.create({
      key: "faune-run-side",
      frames: this.anims.generateFrameNames("faune", {
        start: 1,
        end: 8,
        prefix: "run-side-",
        suffix: ".png",
      }),
      repeat: -1,
      frameRate: 15,
    });

    this.faune.anims.play("faune-run-side");

    this.physics.add.collider(this.faune, wallsLayer);

    this.cameras.main.startFollow(this.faune, true);
  }

  update(time: number, delta: number) {
    if (!this.cursor || !this.faune) {
      return;
    }
    const speed = 100;
    if (this.cursor.left?.isDown) {
      this.faune.anims.play("faune-run-side", true);
      this.faune.setVelocity(-speed, 0);
      this.faune.scaleX = -1;
      this.faune.body.offset.x = 24;
    } else if (this.cursor.right?.isDown) {
      this.faune.anims.play("faune-run-side", true);
      this.faune.setVelocity(speed, 0);
      this.faune.scaleX = 1;
      this.faune.body.offset.x = 8;
    } else if (this.cursor.up?.isDown) {
      this.faune.anims.play("faune-run-up", true);
      this.faune.setVelocity(0, -speed);
    } else if (this.cursor.down?.isDown) {
      this.faune.anims.play("faune-run-down", true);
      this.faune.setVelocity(0, speed);
    } else {
      this.faune.play("faune-idle-down");
      this.faune.setVelocity(0, 0);
    }
  }
}