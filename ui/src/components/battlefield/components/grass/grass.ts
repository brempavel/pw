import { Assets, TilingSprite } from 'pixi.js'

import { Water } from '../water'

export class Grass {
  sprite: TilingSprite | null = null

  private readonly SPRITE_SCALE: number = 0.1

  private get spriteWidthScale(): number {
    return this.SPRITE_SCALE * (window.screen.width / window.innerWidth)
  }
  private get spriteHeightScale(): number {
    return (
      this.SPRITE_SCALE * (window.screen.height / this.water.app.stage.height)
    )
  }

  private readonly loadAndUseAssets: (x?: number) => Promise<void> = async (
    x?: number,
  ): Promise<void> => {
    const grass = await Assets.load('assets/grass.jpg')
    if (this.water.waterSprite) {
      this.sprite = new TilingSprite({
        texture: grass,
        width: window.innerWidth * (this.water.grassSpriteWidthInPercent / 100),
        height: this.water.screenHeight,
      })
    }

    this.onResize()

    if (this.sprite) {
      if (x) this.sprite.x = x

      this.water.app.stage.addChild(this.sprite)
    }
  }

  static getInstance = async (water: Water, x?: number): Promise<Grass> => {
    const instance = new Grass(water)
    await instance.loadAndUseAssets(x)
    return instance
  }

  constructor(private water: Water) {}

  readonly onResize = (): void => {
    if (this.sprite) {
      this.sprite.tileScale.x = this.spriteWidthScale
      this.sprite.tileScale.y = this.spriteHeightScale
    }
  }
}
