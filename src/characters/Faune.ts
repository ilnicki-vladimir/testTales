import Phaser from 'phaser';
import { Interactive } from '../items/Chest';

import { sceneEvents } from '../events/EventCenter';
import { Character } from '../core/classes/Character';
import { HealthState } from '../core/enums/healt-state';
import { OnInit } from '../core/interfaces/OnInit.interface';
import { CharacterType } from '../core/enums/character-type';
import { Scene } from '../core/classes/Scene';

const directions = []

declare global {
  namespace Phaser.GameObjects {
    interface GameObjectFactory {
      faune(x: number, y: number, texture: string, frame?: string | number);
    }
  }
}

export default class Faune extends Character implements OnInit {
  characterType = CharacterType.Main;
  private interactWith: Interactive;
  private _coins = 0;

  init() {
    this.speed = 100;
    this.health = 3
    this.anims.play('faune-run-side');
  }

  addCoins(coins: number) {
    this._coins += coins;
    sceneEvents.emit('player-coins-changed', this._coins);
  }

  handleDamage(dir: Phaser.Math.Vector2) {
    super.handleDamage(dir);
    if(this.healthState === HealthState.DEAD) {
      this.play('faune-faint');
    }
  }

  update(cursor: Phaser.Types.Input.Keyboard.CursorKeys) {
    if (this.healthState === HealthState.DAMAGE || this.healthState === HealthState.DEAD) {
      return;
    }
    if (!cursor) {
      return;
    }
    if (Phaser.Input.Keyboard.JustDown(cursor.space)) {
      if (this.interactWith) {
        this.interactWith.interact(this)
      } else {
        this.hit();
      }
      return;
    }
    const leftDown = -cursor.left?.isDown;
    const rightDown = +cursor.right?.isDown;
    const upDown = -cursor.up?.isDown;
    const downDown = +cursor.down?.isDown;
    if (leftDown) {
      this.anims.play('faune-run-side', true);
      this.scaleX = -1;
      this.body.offset.x = 24;
    }
    else if (rightDown) {
      this.anims.play('faune-run-side', true);
      this.scaleX = 1;
      this.body.offset.x = 8;
    }
    else if (upDown) {
      this.anims.play('faune-run-up', true);
    }
    else if (downDown) {
      this.anims.play('faune-run-down', true);
    }
    let speed = 0
    if (leftDown || rightDown || upDown || downDown) {
      this.direction = new Phaser.Math.Vector2(rightDown + leftDown, downDown + upDown);
      speed = this.direction.x && this.direction.y ? this.speed / Math.sqrt(2) : this.speed;
      this.stopInteract();
    }
    else {
      const parts = this.anims.currentAnim.key.split('-');
      parts[1] = 'idle';
      this.anims.play(parts.join('-'));
    }
    const dir = this.direction.clone().scale(speed)
    this.setVelocity(dir.x, dir.y);
  }

  startInteract(interactive: Interactive) {
    this.interactWith = interactive;
  }

  stopInteract() {
    this.interactWith = null;
  }
}

Phaser.GameObjects.GameObjectFactory.register(
  'faune',
  function (
    this: Phaser.GameObjects.GameObjectFactory,
    x: number,
    y: number,
    texture: string,
    frame?: string | number
  ) {
    const sprite = new Faune(this.scene as Scene, x, y, texture, frame);

    this.displayList.add(sprite);
    this.updateList.add(sprite);

    this.scene.physics.world.enableBody(sprite, Phaser.Physics.Arcade.DYNAMIC_BODY);
    sprite.body.setSize(sprite.width * 0.5, sprite.height);
    return sprite;
  }
);
