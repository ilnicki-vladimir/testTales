import Phaser from 'phaser';
import { debugDraw } from '../utils/debug';
import { createLizardAnims } from '../anims/EnemyAnims';
import { createCharacterAnims } from '../anims/CharacterAnims';
import { createChestAnim } from '../anims/TreasureAnims';

import Lizard from '../enemies/Lizard';
import '../characters/Faune';
import Faune from '../characters/Faune';

import { sceneEvents } from '../events/EventCenter';
import { Chest } from '../items/Chest';
import AnimatedTiles from 'phaser-animated-tiles/dist/AnimatedTiles';

export default class Game extends Phaser.Scene {
  private cursor: Phaser.Types.Input.Keyboard.CursorKeys;
  private faune!: Faune;
  private knives!: Phaser.Physics.Arcade.Group;
  private lizards!: Phaser.Physics.Arcade.Group;

  private playerLizardsCollides?: Phaser.Physics.Arcade.Collider;

  constructor() {
    super('game');
  }

  preload() {
    this.cursor = this.input.keyboard.createCursorKeys();
    this.load.scenePlugin('animatedTiles', AnimatedTiles, 'animatedTiles', 'animatedTiles');
  }

  create() {
    this.scene.run('game-ui');

    createCharacterAnims(this.anims);
    createLizardAnims(this.anims);
    createChestAnim(this.anims);

    const map = this.make.tilemap({ key: 'DungeonTiles' });
    const tileset = map.addTilesetImage('DungeonTiles', 'tiles', 16, 16);

    map.createLayer('Grounds', tileset);

    this.knives = this.physics.add.group({
      classType: Phaser.Physics.Arcade.Image,
      maxSize: 3,
    });

    const wallsLayer = map.createLayer('Walls', tileset);
    wallsLayer.setCollisionByProperty({ collision: true });

    const chests = this.physics.add.staticGroup({
      classType: Chest,
    });
    const chestLayer = map.getObjectLayer('Chests');
    chestLayer.objects.forEach((chestObj) => {
      chests.get(
        chestObj.x! + chestObj.width! * 0.5,
        chestObj.y! - chestObj.height! * 0.5,
        'treasure',
        'chest_empty_open_anim_f0.png'
      );
    });

    // debugDraw(wallsLayer, this);

    this.faune = this.add.faune(128, 128, 'faune');
    this.faune.setKnives(this.knives);

    this.cameras.main.startFollow(this.faune, true);

    this.lizards = this.physics.add.group({
      classType: Lizard,
      createCallback: (go) => {
        const lizGo = go as Lizard;
        lizGo.body.onCollide = true;
      },
    });

    const lizardsLayer = map.getObjectLayer('Lizards');
    lizardsLayer.objects.forEach((lizObj) => {
      this.lizards.get(lizObj.x! + lizObj.width * 0.5, lizObj.y! - lizObj.height! * 0.5, 'lizard');
    });

    this.physics.add.collider(this.faune, wallsLayer);
    this.physics.add.collider(this.lizards, wallsLayer);

    this.physics.add.collider(this.faune, chests, this.handlerPlayerChestCollision, undefined, this);

    this.physics.add.collider(this.knives, wallsLayer, this.handlerKnifeWallCollision, undefined, this);
    this.physics.add.collider(this.knives, this.lizards, this.handlerKnifeLizardCollision, undefined, this);

    this.playerLizardsCollides = this.physics.add.collider(
      this.lizards,
      this.faune,
      this.handlerPlayerLizardCollision,
      undefined,
      this
    );

    this.animatedTiles.init(map);
    this.animatedTiles.updateAnimatedTiles(map);
  }

  private handlerPlayerChestCollision(obj1: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject) {
    const chest = obj2 as Chest;
    this.faune.setChest(chest);
  }

  private handlerKnifeWallCollision(obj1: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject) {
    // this.knives.killAndHide(obj1);
    obj1.destroy();
  }

  private handlerKnifeLizardCollision(obj1: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject) {
    // this.knives.killAndHide(obj1);
    // this.lizards.killAndHide(obj2);
    obj1.destroy();
    obj2.destroy();
  }

  private handlerPlayerLizardCollision(obj1: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject) {
    const lizard = obj2 as Lizard;

    const dx = this.faune.x - lizard.x;
    const dy = this.faune.y - lizard.y;

    const dir = new Phaser.Math.Vector2(dx, dy).normalize().scale(200);

    this.faune.handleDamage(dir);

    sceneEvents.emit('player-health-changed', this.faune.health);

    if (this.faune.health <= 0) {
      this.playerLizardsCollides?.destroy();
    }
  }

  update(time: number, delta: number) {
    if (this.faune) {
      this.faune.update(this.cursor);
    }
  }
}
