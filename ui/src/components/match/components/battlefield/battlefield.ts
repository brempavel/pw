import { Container } from 'pixi.js'

import { Component, Tick } from '@types'
import { NOOP_ON_TICK } from '@constants'

import { Ground, River } from './components'

export class Battlefield extends Component implements Tick {
  async init({ container }: { container: Container }): Promise<this> {
    const battlefield = new Container()
    container.addChild(battlefield)

    const water = await new River(this.sceneManager).init({
      container: battlefield,
    })
    this.onTick = water.onTick

    await new Ground(this.sceneManager).init({ container: battlefield })
    await new Ground(this.sceneManager).init({
      container: battlefield,
      isRightSide: true,
    })

    return this
  }

  onTick = NOOP_ON_TICK
}
