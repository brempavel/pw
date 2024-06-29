import {
  Assets,
  TilingSprite,
  Texture,
  DisplacementFilter,
  Sprite,
} from 'pixi.js'

import { App } from '@components'

export class Water {
  WATER_SPRITE_WIDTH_IN_PERCENT: number = 20
  WATER_SPRITE_SCALE: number = 0.8
  // Needed to compensate for the displacement filter.
  WATER_SPRITE_HORIZONTAL_OVERFLOW_IN_PERCENT: number = 5
  // Needed to remove artifacts on the screen borders.
  WATER_SPRITE_VERTICAL_PADDING_IN_PERCENT: number = 10

  paddingAdjustedWindowHeightInPercent: number =
    // WATER_SPRITE_VERTICAL_PADDING_IN_PERCENT * 2 because we need to adjust for
    // both the top and the bottom.
    1 + (this.WATER_SPRITE_VERTICAL_PADDING_IN_PERCENT * 2) / 100
  grassSpriteWidthInPercent: number =
    (100 - this.WATER_SPRITE_WIDTH_IN_PERCENT) / 2

  waterSprite: TilingSprite | null = null
  waterDisplacementFilter: DisplacementFilter | null = null

  get windowHeight(): number {
    return window.innerHeight * this.paddingAdjustedWindowHeightInPercent
  }
  private get waterSpriteWidth(): number {
    return this.WATER_SPRITE_SCALE * (window.screen.width / window.innerWidth)
  }
  private get waterSpriteHeight(): number {
    return (
      this.WATER_SPRITE_SCALE * 0.3 * (window.screen.height / this.windowHeight)
    )
  }

  private loadAndUseAssets: () => Promise<void> = async (): Promise<void> => {
    const [water] = await Promise.all([
      await Assets.load<Texture>('assets/water.jpg'),
      await Assets.load<Texture>('assets/water-displacement.png'),
    ])
    this.waterSprite = new TilingSprite({
      texture: water,
      width:
        window.innerWidth *
        ((this.WATER_SPRITE_WIDTH_IN_PERCENT +
          // WATER_SPRITE_HORIZONTAL_OVERFLOW_IN_PERCENT * 2 because we need to
          // adjust for both the top and the bottom.
          this.WATER_SPRITE_HORIZONTAL_OVERFLOW_IN_PERCENT * 2) /
          100),
      height: this.windowHeight,
    })

    const waterDisplacementSprite = Sprite.from('assets/water-displacement.png')
    waterDisplacementSprite.texture.source.addressMode = 'repeat'
    this.waterDisplacementFilter = new DisplacementFilter({
      sprite: waterDisplacementSprite,
      scale: 30,
    })
    this.waterSprite.filters = [this.waterDisplacementFilter]
    this.waterSprite.x =
      window.innerWidth *
      ((this.grassSpriteWidthInPercent -
        this.WATER_SPRITE_HORIZONTAL_OVERFLOW_IN_PERCENT) /
        100)

    this.setWaterSpritesRelatedProperties()

    this.app.stage.addChild(this.waterSprite)

    this.app.ticker.add((ticker) => {
      if (this.waterSprite) {
        this.waterSprite.tilePosition.y += ticker.deltaMS / 25
      }
    })
  }

  static instance: Water | null = null
  static getInstance = async (app: App): Promise<Water> => {
    if (this.instance === null) {
      this.instance = new Water(app)
      this.instance.constructor = () => {}
      await this.instance.loadAndUseAssets()
    }
    return this.instance
  }

  constructor(public app: App) {}

  setWaterSpritesRelatedProperties = (): void => {
    if (this.waterSprite) {
      this.waterSprite.tileScale.x = this.waterSpriteWidth
      this.waterSprite.tileScale.y = this.waterSpriteHeight
    }

    const waterSpriteVerticalPadding =
      window.innerHeight * (this.WATER_SPRITE_VERTICAL_PADDING_IN_PERCENT / 100)
    if (this.waterDisplacementFilter) {
      this.waterDisplacementFilter.padding = waterSpriteVerticalPadding
    }
    if (this.waterSprite) {
      this.waterSprite.y = -waterSpriteVerticalPadding
    }
  }
}
