import { Container, Ticker } from 'pixi.js'

import { SceneManager } from '@scene-manager'

export interface Tick {
  onTick: (ticker: Ticker) => void
}

export interface Destroy {
  destroy: () => Promise<void>
}

export abstract class Component {
  constructor(protected sceneManager: SceneManager) {}
  abstract init(args: {
    container: Container
    [key: string]: any
  }): Promise<this>
}
