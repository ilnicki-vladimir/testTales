import { ThrowableWeapon } from './Weapon';

export class Knifes extends ThrowableWeapon {
  texture = 'knife'
  flySpeed = 100;
}

export class Chests extends ThrowableWeapon {
  texture = 'treasure'
  flySpeed = 300
}
