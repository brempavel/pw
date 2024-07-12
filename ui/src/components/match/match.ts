import { Container } from 'pixi.js'

import { Component, InitParams, Tick } from '@types'
import { NOOP_ON_TICK } from '@constants'

import { Battlefield, Player } from './components'

export class Match extends Component implements Tick {
  override async init({ container }: InitParams): Promise<this> {
    const match = new Container()

    const battlefield = await new Battlefield(this.sceneManager).init({
      container: match,
    })
    const player = await new Player(this.sceneManager).init({
      container: match,
    })

    container.addChild(match)

    this.onTick = (ticker) => {
      battlefield.onTick(ticker)
      player.onTick(ticker)
    }

    return this
  }

  onTick = NOOP_ON_TICK
}
