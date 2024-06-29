import { Assets, TilingSprite } from 'pixi.js'

import { Water } from '../water'

export class Grass {
  GRASS_SPRITE_SCALE: number = 0.1

  get grassSpriteWidth(): number {
    return this.GRASS_SPRITE_SCALE * (window.screen.width / window.innerWidth)
  }
  get grassSpriteHeight(): number {
    return (
      this.GRASS_SPRITE_SCALE * (window.screen.height / this.water.windowHeight)
    )
  }

  grassSprite: TilingSprite | null = null
  loadAndUseAssets: (x?: number) => Promise<void> = async (
    x?: number,
  ): Promise<void> => {
    const grass = await Assets.load('assets/grass.jpg')
    this.grassSprite = new TilingSprite({
      texture: grass,
      width: window.innerWidth * (this.water.grassSpriteWidthInPercent / 100),

      height: this.water.windowHeight,
    })
    this.grassSprite.tileScale.x = this.grassSpriteWidth
    this.grassSprite.tileScale.y = this.grassSpriteHeight
    if (x) {
      this.grassSprite.x = x
    }
    this.water.app.stage.addChild(this.grassSprite)
  }

  static getInstance = async (water: Water, x?: number): Promise<Grass> => {
    const instance = new Grass(water)
    await instance.loadAndUseAssets(x)
    return instance
  }

  constructor(private water: Water) {}
}
