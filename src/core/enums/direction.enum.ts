export type Direction = HorizontalDirection | VerticalDirection

export enum HorizontalDirection {
  LEFT='-1x',
  RIGHT='1x',
  IDLE = '0'
}

export enum VerticalDirection {
  UP='-1y',
  DOWN='1y',
  IDLE = '0'
}
