import { Container, Ticker } from 'pixi.js'

import { SceneManager } from '@scene-manager'

export interface Tick {
  onTick: (ticker: Ticker) => void
}

export interface Destroy {
  destroy: () => Promise<void>
}

export type InitParams<T = {}> = { container: Container } & T

export abstract class Component {
  constructor(protected sceneManager: SceneManager) {}
  abstract init<T>(params: InitParams<T>): Promise<this>
}

export type Radians = number
