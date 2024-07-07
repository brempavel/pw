import { Assets, Container, Texture, TilingSprite } from 'pixi.js'

import { Component } from '@types'
import { GROUND_TILE_SCALE, RIVER_WIDTH_IN_PERCENT } from '@constants'
import { debounce } from '@utils'

export class Ground extends Component {
  private get waterWidth(): number {
    return (this.sceneManager.width * RIVER_WIDTH_IN_PERCENT) / 100
  }

  private get width(): number {
    return (this.sceneManager.width - this.waterWidth) / 2
  }

  sprite: TilingSprite | null = null
  isRightSide: boolean = false

  async build(
    container: Container,
    { isRightSide }: { [key: string]: any } = { isRightSide: false },
  ): Promise<Ground> {
    this.sprite = new TilingSprite({
      texture: await Assets.load<Texture>('assets/grass.jpg'),
    })
    this.sprite.tileScale = GROUND_TILE_SCALE
    this.isRightSide = isRightSide
    this.onResize()

    container.addChild(this.sprite)

    const debouncedOnResize = debounce(this.onResize, 0)
    this.sceneManager.addEventListener('resize', this.onResize)
    this.sceneManager.addEventListener('resize', debouncedOnResize)

    return this
  }

  private onResize = () => {
    this.sprite!.width = this.width
    this.sprite!.height = this.sceneManager.height
    if (this.isRightSide) this.sprite!.x = this.width + this.waterWidth
  }
}
