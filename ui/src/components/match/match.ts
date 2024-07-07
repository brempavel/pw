import { Container } from 'pixi.js'

import { Component } from '@types'

import { Battlefield } from './components'

export class Match extends Component {
  async build(container: Container): Promise<Battlefield> {
    const match = new Container()
    container.addChild(match)

    const battlefield = await new Battlefield(this.sceneManager).build(match)
    this.onTick = battlefield.onTick

    return this
  }
}
