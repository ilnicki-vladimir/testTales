import { GameObject } from './GameObject';
import Phaser from 'phaser';
import { Group } from './Collidable';

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
