import Phaser from 'phaser';
import { createLizardAnims } from '../anims/EnemyAnims';
import { createCharacterAnims } from '../anims/CharacterAnims';
import { createChestAnim } from '../anims/TreasureAnims';

import Lizard from '../enemies/Lizard';
import '../characters/Faune';
import Faune from '../characters/Faune';

import { Chest } from '../items/Chest';
import AnimatedTiles from 'phaser-animated-tiles/dist/AnimatedTiles';
import { Knifes } from '../core/classes/Knifes';
import { Image } from '../core/classes/Image';
import { Group, StaticGroup } from '../core/classes/GameObject';
import {
  GameObjectFactory
} from '../core/classes/Factory';
import {
  handlerFauneChestCollision,
  handlerKnifeLizardCollision,
  handlerKnifeWallCollision,
  handlerPlayerLizardCollision
} from '../core/collisions/collisions';

export default class Game extends Phaser.Scene {
  private cursor: Phaser.Types.Input.Keyboard.CursorKeys;
  private faune!: Faune;

  private gameObjectFactory: GameObjectFactory;

  private audio;
  private animatedTiles;

  constructor() {
    super('game');
  }

  preload() {
    this.cursor = this.input.keyboard.createCursorKeys();
    this.load.scenePlugin('animatedTiles', AnimatedTiles, 'animatedTiles', 'animatedTiles');
  }

  create() {
    this.gameObjectFactory = new GameObjectFactory(this.physics.world, this);
    this.scene.run('game-ui');
    this.audio = this.sound.add('mainTheme');

    createCharacterAnims(this.anims);
    createLizardAnims(this.anims);
    createChestAnim(this.anims);

    const map = this.make.tilemap({ key: 'DungeonTiles' });
    const tileset = map.addTilesetImage('DungeonTiles', 'tiles', 16, 16);

    map.createLayer('Grounds', tileset);

    const wallsLayer = map.createLayer('Walls', tileset);
    wallsLayer.setCollisionByProperty({ collision: true });

    const chests = this.gameObjectFactory.create<StaticGroup<Chest>>(StaticGroup, {
      classType: Chest
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

    this.faune = this.add.faune(128, 128, 'faune');

    const defaultFauneWeapon: Knifes = this.gameObjectFactory.create(Knifes, { classType: Image, maxSize: 3 })
    this.faune.setWeapon(defaultFauneWeapon);

    this.cameras.main.startFollow(this.faune, true);

    const lizards = this.gameObjectFactory.create<Group<Lizard>>(Group, {
      classType: Lizard,
      createCallback: ({ body }: Lizard) => {
        body.onCollide = true
      },
    });

    const lizardsLayer = map.getObjectLayer('Lizards');
    lizardsLayer.objects.forEach((lizObj) => {
      lizards.get(lizObj.x! + lizObj.width * 0.5, lizObj.y! - lizObj.height! * 0.5, 'lizard');
    });

    this.faune.addCollisions([
      { collideWith: wallsLayer },
      { collideWith: chests, collideCallback: handlerFauneChestCollision
      },
      {collideWith: lizards,
      collideCallback: handlerPlayerLizardCollision}
      ])

    lizards.addCollisions([{ collideWith: wallsLayer }])

    defaultFauneWeapon.addCollisions([
      {
        collideWith: wallsLayer,
        collideCallback: handlerKnifeWallCollision
      },
      {
        collideWith: lizards,
        collideCallback: handlerKnifeLizardCollision
      }
      ])

    this.audio.play();
    this.animatedTiles.init(map);
    this.animatedTiles.updateAnimatedTiles(map);
  }

  update(time: number, delta: number) {
    if (this.faune) {
      this.faune.update(this.cursor);
    }
  }
}
