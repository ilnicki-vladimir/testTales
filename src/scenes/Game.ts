import Phaser from "phaser";
import { debugDraw } from "../utils/debug";
import { createLizardAnims } from "../anims/EnemyAnims";
import { createCharacterAnims } from "../anims/CharacterAnims";

import Lizard from "../enemies/Lizard";

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
    createCharacterAnims(this.anims);
    createLizardAnims(this.anims);

    const map = this.make.tilemap({ key: "DungeonTiles" });
    const tileset = map.addTilesetImage("DungeonTiles", "tiles", 16, 16);
    map.createLayer("Grounds", tileset);
    const wallsLayer = map.createLayer("Walls", tileset);
    wallsLayer.setCollisionByProperty({ collision: true });

    // debugDraw(wallsLayer, this);

    this.faune = this.physics.add.sprite(128, 128, "faune", "walk-down-3.png");
    this.faune.body.setSize(this.faune.width * 0.5, this.faune.height * 0.8);

    this.faune.anims.play("faune-run-side");

    this.cameras.main.startFollow(this.faune, true);

    const lizards = this.physics.add.group({
      classType: Lizard,
      createCallback: (go) => {
        const lizGo = go as Lizard;
        lizGo.body.onCollide = true;
      },
    });

    lizards.get(180, 50, "lizard");

    this.physics.add.collider(this.faune, wallsLayer);
    this.physics.add.collider(lizards, wallsLayer);
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
      const parts = this.faune.anims.currentAnim.key.split("-");
      parts[1] = "idle";
      this.faune.play(parts.join("-"));
      this.faune.setVelocity(0, 0);
    }
  }
}
