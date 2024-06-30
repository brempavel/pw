import { Container } from 'pixi.js'

import { Component } from '@types'

import { Ground, River } from './components'

export class Battlefield extends Component {
  async build(container: Container): Promise<Battlefield> {
    const battlefield = new Container()
    container.addChild(battlefield)

    const water = await new River(this.sceneManager).build(battlefield)
    this.onTick = water.onTick

    await new Ground(this.sceneManager).build(battlefield)
    await new Ground(this.sceneManager).build(battlefield, {
      isRightSide: true,
    })

    return this
  }
}
