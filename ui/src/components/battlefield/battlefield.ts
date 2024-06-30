import { App } from '..'
import { Water, Grass } from './components'

export const loadAssetsAndBuildBattlefield = async (
  app: App,
): Promise<void> => {
  const water = await Water.getInstance(app)

  const [grassLeft, grassRight] = await Promise.all([
    await Grass.getInstance(water),
    await Grass.getInstance(
      water,
      (window.innerWidth *
        (water.SPRITE_WIDTH_IN_PERCENT + water.grassSpriteWidthInPercent)) /
        100,
    ),
  ])

  window.addEventListener('resize', () => {
    water.onResize()
    grassRight.onResize()
    grassLeft.onResize()
  })
}
