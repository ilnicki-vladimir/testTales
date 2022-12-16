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
  GameObjectFactory, SpriteFactory
} from '../core/classes/Factory';
import {
  handlerFauneChestCollision,
  handlerPlayerLizardCollision, handlerTileCollision
} from '../core/collisions/collisions';
import { ThrowableWeapon } from '../core/classes/Weapon';
import { Scene } from '../core/classes/Scene';

export default class Game extends Scene {
  private cursor: Phaser.Types.Input.Keyboard.CursorKeys;
  private faune!: Faune;
  private spriteFactory: SpriteFactory;

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
    this._gameObjectFactory = new GameObjectFactory(this.physics.world, this);
    this.spriteFactory = new SpriteFactory(this);
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
    this.tiles.push(wallsLayer);

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

    this.faune = this.add.faune(128, 128, 'faune')

    this.cameras.main.startFollow(this.faune, true);

    const lizards = this.gameObjectFactory.create<Group<Lizard>>(Group, {
      classType: Lizard,
      createCallback: ({ body }: Lizard) => {
        body.onCollide = true
      },
    });

    this.enemies.push(lizards)

    const lizardsLayer = map.getObjectLayer('Lizards');
    lizardsLayer.objects.forEach((lizObj) => {
      lizards.get(lizObj.x! + lizObj.width * 0.5, lizObj.y! - lizObj.height! * 0.5, 'lizard');
    });

    this.faune.addCollisions([
      { collideWith: wallsLayer },
      { collideWith: chests, collideCallback: handlerFauneChestCollision
      },
      {
        collideWith: lizards,
        collideCallback: handlerPlayerLizardCollision,
        collideProcess: (faune: Faune) => faune.health > 0
      }
      ])

    lizards.addCollisions([{ collideWith: wallsLayer, collideCallback: handlerTileCollision }])


    const defaultFauneWeapon: ThrowableWeapon = this.gameObjectFactory.create(Knifes, { classType: Image, maxSize: 3 })
    this.faune.setWeapon(defaultFauneWeapon);

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
