import { App } from '..'
import { Water, Grass } from './components'

export const loadAssetsAndBuildBattlefield = async (
  app: App,
): Promise<void> => {
  const water = await Water.getInstance(app)

  const grassLeft = await Grass.getInstance(water)
  const grassRight = await Grass.getInstance(
    water,
    (window.innerWidth *
      (water.WATER_SPRITE_WIDTH_IN_PERCENT + water.grassSpriteWidthInPercent)) /
      100,
  )

  window.addEventListener('resize', () => {
    app.stage.setSize(
      // Not app.screen.width due to buggy layout when resizing.
      window.innerWidth,
      water.windowHeight,
    )
    water.setWaterSpritesRelatedProperties()
    if (water.waterSprite) {
      water.waterSprite.height = water.windowHeight
      console.log(water.waterSprite.height)
    }
    if (grassRight.grassSprite) {
      grassRight.grassSprite.tileScale.x = grassRight.grassSpriteWidth
      grassRight.grassSprite.tileScale.y = grassRight.grassSpriteHeight
    }
    if (grassLeft.grassSprite) {
      grassLeft.grassSprite.tileScale.x = grassRight.grassSpriteWidth
      grassLeft.grassSprite.tileScale.y = grassRight.grassSpriteHeight
    }
  })
}
