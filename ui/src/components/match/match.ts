import { Container } from 'pixi.js'

import { Component } from '@types'

import { Battlefield } from './components'

export class Match extends Component {
  async build(container: Container): Promise<Battlefield> {
    const match = new Container()

    const battlefield = await new Battlefield(this.sceneManager).build(match)
    this.onTick = battlefield.onTick

    container.addChild(match)

    return this
  }
}
