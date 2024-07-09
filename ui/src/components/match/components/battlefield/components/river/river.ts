import {
  Assets,
  TilingSprite,
  Texture,
  Sprite,
  Container,
  DisplacementFilter,
  Ticker,
} from 'pixi.js'

import { Component, Tick } from '@types'
import { debounce } from '@utils'
import { NOOP_ON_TICK } from '@constants'

import { RIVER } from '../../constants'

export class River extends Component implements Tick {
  private get width(): number {
    return (
      this.sceneManager.width *
      ((RIVER.WIDTH_IN_PERCENT +
        RIVER.DISPLACEMENT_FILTER_COMPENSATION_IN_PERCENT) /
        100)
    )
  }

  private get x(): number {
    return (this.sceneManager.width - this.width) / 2
  }

  private sprite: TilingSprite | null = null
  private displacementFilter: DisplacementFilter | null = null

  async init({ container }: { container: Container }): Promise<this> {
    const [water] = await Promise.all([
      await Assets.load<Texture>(RIVER.TEXTURE_URL),
      await Assets.load<Texture>(RIVER.DISPLACEMENT_URL),
    ])

    this.sprite = new TilingSprite({ texture: water })
    this.onResize()

    const displacementSprite = Sprite.from(RIVER.DISPLACEMENT_URL)
    displacementSprite.texture.source.addressMode = 'repeat'
    this.displacementFilter = new DisplacementFilter({
      sprite: displacementSprite,
      scale: RIVER.DISPLACEMENT_FILTER_SCALE,
    })

    this.sprite.filters = [this.displacementFilter]

    container.addChild(this.sprite)

    this.onTick = (ticker: Ticker) => {
      if (this.sprite) {
        this.sprite.tilePosition.y +=
          ticker.deltaMS / RIVER.SPRITE_TILE_POSITION_SPEED_DENOMINATOR
      }
    }

    const debouncedOnResize = debounce(this.onResize, 0)
    this.sceneManager.addEventListener('resize', this.onResize)
    this.sceneManager.addEventListener('resize', debouncedOnResize)

    return this
  }

  onTick = NOOP_ON_TICK

  private onResize = () => {
    this.sprite!.width = this.width
    this.sprite!.height = this.sceneManager.height
    this.sprite!.x = this.x
  }
}
