import {
  Assets,
  TilingSprite,
  Texture,
  Sprite,
  Container,
  DisplacementFilter,
  Ticker,
} from 'pixi.js'

import { Component } from '@types'
import { debounce } from '@utils'
import {
  RIVER_DISPLACEMENT_URL,
  RIVER_DISPLACEMENT_FILTER_SCALE,
  RIVER_SPRITE_TILE_POSITION_SPEED_DENOMINATOR,
  RIVER_TEXTURE_URL,
  RIVER_WIDTH_IN_PERCENT,
} from '@constants'

const DISPLACEMENT_FILTER_COMPENSATION_IN_PERCENT = 30

export class River extends Component {
  private get width(): number {
    return (
      this.sceneManager.width *
      ((RIVER_WIDTH_IN_PERCENT + DISPLACEMENT_FILTER_COMPENSATION_IN_PERCENT) /
        100)
    )
  }

  private get x(): number {
    return (this.sceneManager.width - this.width) / 2
  }

  private sprite: TilingSprite | null = null
  private displacementFilter: DisplacementFilter | null = null

  async build(container: Container): Promise<River> {
    const [water] = await Promise.all([
      await Assets.load<Texture>(RIVER_TEXTURE_URL),
      await Assets.load<Texture>(RIVER_DISPLACEMENT_URL),
    ])

    this.sprite = new TilingSprite({ texture: water })
    this.onResize()

    const displacementSprite = Sprite.from('assets/river-displacement.png')
    displacementSprite.texture.source.addressMode = 'repeat'
    this.displacementFilter = new DisplacementFilter({
      sprite: displacementSprite,
      scale: RIVER_DISPLACEMENT_FILTER_SCALE,
    })

    this.sprite.filters = [this.displacementFilter]

    container.addChild(this.sprite)

    this.onTick = (ticker: Ticker) => {
      if (this.sprite) {
        this.sprite.tilePosition.y +=
          ticker.deltaMS / RIVER_SPRITE_TILE_POSITION_SPEED_DENOMINATOR
      }
    }

    const debouncedOnResize = debounce(this.onResize, 0)
    this.sceneManager.addEventListener('resize', this.onResize)
    this.sceneManager.addEventListener('resize', debouncedOnResize)

    return this
  }

  private onResize = () => {
    this.sprite!.width = this.width
    this.sprite!.height = this.sceneManager.height
    this.sprite!.x = this.x
  }
}
