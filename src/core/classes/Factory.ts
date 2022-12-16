import { GameObject } from './GameObject';
import Phaser from 'phaser';
import { Group } from './Collidable';
import { Sprite } from './Sprite';
import { ExcludeTupleFromTuple } from '../../utils/utils';
import { Scene } from './Scene';

export abstract class GroupFactory {
  public constructor(public world: Phaser.Physics.Arcade.World, public scene: Phaser.Scene) {}
}

export class GameObjectFactory extends GroupFactory {
  create<T extends Group>(
    ClassName: new(world: Phaser.Physics.Arcade.World, scene: Phaser.Scene,children?: GameObject[] | Phaser.Types.Physics.Arcade.PhysicsGroupConfig | Phaser.Types.GameObjects.Group.GroupCreateConfig, config?: Phaser.Types.Physics.Arcade.PhysicsGroupConfig | Phaser.Types.GameObjects.Group.GroupCreateConfig) => T,
    children?: GameObject[] | Phaser.Types.Physics.Arcade.PhysicsGroupConfig | Phaser.Types.GameObjects.Group.GroupCreateConfig, config?: Phaser.Types.Physics.Arcade.PhysicsGroupConfig | Phaser.Types.GameObjects.Group.GroupCreateConfig): T {
    return new ClassName(this.world, this.scene, children, config);
  }
}

type SpriteConstructorParameters = ConstructorParameters<typeof Sprite>

export class SpriteFactory {
  constructor(public scene: Scene) {
  }
  create<T extends Sprite>(
    ClassName: new(...args: ConstructorParameters<typeof Sprite>) => T,
    ...args: ExcludeTupleFromTuple<SpriteConstructorParameters, ConstructorParameters<typeof SpriteFactory>>
  ): T {
    const sprite = new ClassName(this.scene, ...args);
    this.scene.physics.world.enableBody(sprite);
    sprite.body.setSize(sprite.width * 0.5, sprite.height * 0.8);
    return sprite;
  }
}
