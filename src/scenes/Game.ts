import Phaser from "phaser";
import { debugDraw } from "../utils/debug";
import { createLizardAnims } from "../anims/EnemyAnims";
import { createCharacterAnims } from "../anims/CharacterAnims";

import Lizard from "../enemies/Lizard";
import "../characters/Faune";
import Faune from "../characters/Faune";

import { sceneEvents } from "../events/EventCenter";

export default class Game extends Phaser.Scene {
  private cursor: Phaser.Types.Input.Keyboard.CursorKeys;
  private faune: Faune;

  constructor() {
    super("game");
  }

  preload() {
    this.cursor = this.input.keyboard.createCursorKeys();
  }

  create() {
    this.scene.run("game-ui");

    createCharacterAnims(this.anims);
    createLizardAnims(this.anims);

    const map = this.make.tilemap({ key: "DungeonTiles" });
    const tileset = map.addTilesetImage("DungeonTiles", "tiles", 16, 16);

    map.createLayer("Grounds", tileset);
    const wallsLayer = map.createLayer("Walls", tileset);
    wallsLayer.setCollisionByProperty({ collision: true });

    // debugDraw(wallsLayer, this);

    this.faune = this.add.faune(128, 128, "faune");

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

    this.physics.add.collider(
      lizards,
      this.faune,
      this.handlerPlayerLizardCollision,
      undefined,
      this
    );
  }

  handlerPlayerLizardCollision(
    obj1: Phaser.GameObjects.GameObject,
    obj2: Phaser.GameObjects.GameObject
  ) {
    const lizard = obj2 as Lizard;

    const dx = this.faune.x - lizard.x;
    const dy = this.faune.y - lizard.y;

    const dir = new Phaser.Math.Vector2(dx, dy).normalize().scale(200);

    this.faune.handleDamage(dir);

    sceneEvents.emit('player-health-changed', this.faune.health)
  }

  update(time: number, delta: number) {
    if (this.faune) {
      this.faune.update(this.cursor);
    }
  }
}
