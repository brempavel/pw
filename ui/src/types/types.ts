import { Container, Ticker } from 'pixi.js'

import { SceneManager } from '@scene-manager'

export abstract class Component {
  constructor(protected sceneManager: SceneManager) {}
  abstract init<T>(params: InitParams<T>): Promise<this>
}
export type InitParams<T = {}> = { container: Container } & T
export interface Tick {
  onTick: (ticker: Ticker) => void
}
export interface Destroy {
  destroy: () => Promise<void>
}

export type Radians = number
