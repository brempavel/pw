import { Container, Ticker } from 'pixi.js'

import { SceneManager } from '@components'

export abstract class Component {
  constructor(protected sceneManager: SceneManager) {}
  abstract build(
    container: Container,
    args?: { [key: string]: any } | undefined,
  ): Promise<Component>
  onTick?: ((ticker: Ticker) => void) | undefined
  destroy?: (() => Promise<void>) | undefined
}
