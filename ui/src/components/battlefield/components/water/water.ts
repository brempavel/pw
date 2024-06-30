import {
  Assets,
  TilingSprite,
  Texture,
  DisplacementFilter,
  Sprite,
} from 'pixi.js'

import { App } from '@components'

export class Water {
  readonly SPRITE_WIDTH_IN_PERCENT: number = 20

  readonly grassSpriteWidthInPercent: number =
    (100 - this.SPRITE_WIDTH_IN_PERCENT) / 2

  // TODO: refactor all the window (and anything that is not related to Water)
  // into separate classes
  get screenHeight(): number {
    return window.screen.height * this.paddingAdjustedWindowHeightInPercent
  }

  private readonly SPRITE_SCALE: number = 0.8
  // Needed to compensate for the displacement filter.
  private readonly SPRITE_HORIZONTAL_OVERFLOW_IN_PERCENT: number = 5
  // Needed to remove artifacts on the screen borders.
  private readonly SPRITE_VERTICAL_PADDING_IN_PERCENT: number = 10

  private readonly paddingAdjustedWindowHeightInPercent: number =
    // WATER_SPRITE_VERTICAL_PADDING_IN_PERCENT * 2 because we need to adjust for
    // both the top and the bottom.
    1 + (this.SPRITE_VERTICAL_PADDING_IN_PERCENT * 2) / 100

  waterSprite: TilingSprite | null = null
  private waterDisplacementFilter: DisplacementFilter | null = null

  private get spriteWidthScale(): number {
    return this.SPRITE_SCALE * (window.screen.width / window.innerWidth)
  }
  private get spriteHeightScale(): number {
    return this.SPRITE_SCALE * 0.3 * (window.screen.height / this.screenHeight)
  }

  private readonly waterSpriteVerticalPadding: number =
    window.screen.height * (this.SPRITE_VERTICAL_PADDING_IN_PERCENT / 100)

  private readonly loadAndUseAssets: () => Promise<void> =
    async (): Promise<void> => {
      const [water] = await Promise.all([
        await Assets.load<Texture>('assets/water.jpg'),
        await Assets.load<Texture>('assets/water-displacement.png'),
      ])
      this.waterSprite = new TilingSprite({
        texture: water,
        width:
          window.innerWidth *
          ((this.SPRITE_WIDTH_IN_PERCENT +
            // WATER_SPRITE_HORIZONTAL_OVERFLOW_IN_PERCENT * 2 because we need to
            // adjust for both the top and the bottom.
            this.SPRITE_HORIZONTAL_OVERFLOW_IN_PERCENT * 2) /
            100),
        height: this.screenHeight,
      })

      this.waterSprite.y = -this.waterSpriteVerticalPadding

      const waterDisplacementSprite = Sprite.from(
        'assets/water-displacement.png',
      )
      waterDisplacementSprite.texture.source.addressMode = 'repeat'
      this.waterDisplacementFilter = new DisplacementFilter({
        sprite: waterDisplacementSprite,
        scale: 30,
      })

      this.waterDisplacementFilter.padding = this.waterSpriteVerticalPadding

      this.waterSprite.filters = [this.waterDisplacementFilter]
      this.waterSprite.x =
        window.innerWidth *
        ((this.grassSpriteWidthInPercent -
          this.SPRITE_HORIZONTAL_OVERFLOW_IN_PERCENT) /
          100)

      this.onResize()

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

  readonly onResize = (): void => {
    this.app.stage.setSize({
      // Not app.screen.width due to buggy layout when resizing.
      width: window.innerWidth,
      height: this.screenHeight,
    })

    if (this.waterSprite) {
      this.waterSprite.tileScale.x = this.spriteWidthScale
      this.waterSprite.tileScale.y = this.spriteHeightScale
    }
  }
}
