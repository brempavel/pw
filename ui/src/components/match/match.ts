import { Assets, Container, Sprite, Texture } from 'pixi.js'

import { Component, Tick } from '@types'
import { NOOP_ON_TICK } from '@constants'

import { Battlefield } from './components'
import { debounce } from '@ui/utils'

export class Match extends Component implements Tick {
  async init({ container }: { container: Container }): Promise<this> {
    const match = new Container()

    const battlefield = await new Battlefield(this.sceneManager).init({
      container: match,
    })
    this.onTick = battlefield.onTick

    // sprite.eventMode = 'static';
    // sprite.cursor = 'pointer';
    // sprite
    //   .on('pointerdown', onClick)
    // 	.on('pointerdown', onButtonDown)
    // app.stage.eventMode = 'static';
    //   app.stage.hitArea = app.screen;
    //   app.stage.on('mousemove', (event) =>
    //   {
    //       mouseCoords.x = event.global.x;
    //       mouseCoords.y = event.global.y;
    //   });
    // circle.position.copyFrom(e.global);
    // app.stage.hitArea = app.screen;
    // this.rotation = Math.atan2(playerY - this.y, playerX - this.x)
    //
    // // Move towards the player
    // this.x += Math.cos(this.rotation) * this.speed
    // this.y += Math.sin(this.rotation) * this.speed
    // // Calculate direction towards player
    // toPlayerX = playerX - this.x
    // toPlayerY = playerY - this.y
    //
    // // Normalize
    // toPlayerLength = Math.sqrt(toPlayerX * toPlayerX + toPlayerY * toPlayerY)
    // toPlayerX = toPlayerX / toPlayerLength
    // toPlayerY = toPlayerY / toPlayerLength
    //
    // // Move towards the player
    // this.x += toPlayerX * this.speed
    // this.y += toPlayerY * this.speed
    //
    // // Rotate us to face the player
    // this.rotation = Math.atan2(toPlayerY, toPlayerX)

    const pudge = new Sprite({
      texture: await Assets.load<Texture>('assets/pudge-stand-by.png'),
    })

    const onResize = () => {
      pudge.width = this.sceneManager.width / 10
      pudge.height = pudge.width * 1.1
    }
    onResize()

    match.addChild(pudge)

    const debouncedOnResize = debounce(onResize, 0)
    this.sceneManager.addEventListener('resize', onResize)
    this.sceneManager.addEventListener('resize', debouncedOnResize)

    container.addChild(match)

    return this
  }

  onTick = NOOP_ON_TICK
}
