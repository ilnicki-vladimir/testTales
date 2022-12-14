import Phaser from 'phaser';
import { Chest, Interactive } from '../items/Chest';

import { sceneEvents } from '../events/EventCenter';
import { Character } from '../core/classes/Character';
import { HealthState } from '../core/enums/healt-state';
import { OnInit } from '../core/interfaces/OnInit.interface';

declare global {
  namespace Phaser.GameObjects {
    interface GameObjectFactory {
      faune(x: number, y: number, texture: string, frame?: string | number);
    }
  }
}

export default class Faune extends Character implements OnInit {
  private interactWith: Interactive;
  private damageTime = 0;
  private _coins = 0;
  private activeChest?: Chest;

  init() {
    this.speed = 100;
    this.health = 3
    this.anims.play('faune-run-side');
  }

  setChest(chest: Chest) {
    this.activeChest = chest;
  }

  handleDamage(dir: Phaser.Math.Vector2) {
    if (this._health <= 0) {
      return;
    }
    if (this.healthState === HealthState.DAMAGE) {
      return;
    }

    --this._health;

    if (this._health <= 0) {
      //todo: die
      this.healthState = HealthState.DEAD;
      this.play('faune-faint');
      this.setVelocity(0, 0);
    } else {
      this.setVelocity(dir.x, dir.y);

      this.setTint(0xff0000);

      this.healthState = HealthState.DAMAGE;
      this.damageTime = 0;
    }
  }

  preUpdate(time: number, delta: number): void {
    super.preUpdate(time, delta);

    switch (this.healthState) {
      case HealthState.IDLE:
        break;
      case HealthState.DAMAGE:
        this.damageTime += delta;
        if (this.damageTime >= 250) {
          this.healthState = HealthState.IDLE;
          this.setTint(0xffffff);
          this.damageTime = 0;
        }
        break;
    }
  }

  addCoins(coins: number) {
    this._coins += coins;
    sceneEvents.emit('player-coins-changed', this._coins);
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
    const leftDown = cursor.left?.isDown;
    const rightDown = cursor.right?.isDown;
    const upDown = cursor.up?.isDown;
    const downDown = cursor.down?.isDown;
    if (leftDown) {
      this.anims.play('faune-run-side', true);
      this.setVelocity(-this.speed, 0);
      this.scaleX = -1;
      this.body.offset.x = 24;
    } else if (rightDown) {
      this.anims.play('faune-run-side', true);
      this.setVelocity(this.speed, 0);
      this.scaleX = 1;
      this.body.offset.x = 8;
    } else if (upDown) {
      this.anims.play('faune-run-up', true);
      this.setVelocity(0, -this.speed);
    } else if (downDown) {
      this.anims.play('faune-run-down', true);
      this.setVelocity(0, this.speed);
    } else {
      const parts = this.anims.currentAnim.key.split('-');
      parts[1] = 'idle';
      this.anims.play(parts.join('-'));
      this.setVelocity(0, 0);
    }

    if (leftDown || rightDown || upDown || downDown) {
      this.activeChest = undefined;
    }
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
    const sprite = new Faune(this.scene, x, y, texture, frame);

    this.displayList.add(sprite);
    this.updateList.add(sprite);

    this.scene.physics.world.enableBody(sprite, Phaser.Physics.Arcade.DYNAMIC_BODY);

    sprite.body.setSize(sprite.width * 0.5, sprite.height * 0.8);
    return sprite;
  }
);
