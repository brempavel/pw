import { Assets, Texture, TilingSprite } from 'pixi.js'

import { Component, InitParams } from '@types'
import { debounce, getDoesntExistError } from '@utils'

import { GROUND, RIVER } from '../../constants'

export class Ground extends Component {
  private get waterWidth(): number {
    return (this.sceneManager.width * RIVER.WIDTH_IN_PERCENT) / 100
  }

  private get width(): number {
    return (this.sceneManager.width - this.waterWidth) / 2
  }

  sprite: TilingSprite | null = null
  isRightSide: boolean = false

  override async init({
    container,
    isRightSide = false,
  }: InitParams<{
    isRightSide?: boolean
  }>): Promise<this> {
    this.sprite = new TilingSprite({
      texture: await Assets.load<Texture>(GROUND.TEXTURE_URL),
    })
    this.sprite.tileScale = GROUND.TILE_SCALE
    this.isRightSide = isRightSide
    this.onResize()

    container.addChild(this.sprite)

    const debouncedOnResize = debounce(this.onResize, 0)
    this.sceneManager.addEventListener('resize', this.onResize)
    this.sceneManager.addEventListener('resize', debouncedOnResize)

    return this
  }

  private onResize = () => {
    if (!this.sprite) {
      throw getDoesntExistError`${this.constructor.name} ${this.onResize.name} this.sprite`
    }
    this.sprite.width = this.width
    this.sprite.height = this.sceneManager.height
    if (this.isRightSide) this.sprite.x = this.width + this.waterWidth
  }
}
