import {
  Application,
  Assets,
  TilingSprite,
  Sprite,
  DisplacementFilter,
} from 'pixi.js'

const app = new Application()

await app.init({ resizeTo: window })
window.document.body.appendChild(app.canvas)

// —————————BACKGROUND—————————

// These constants are the configurables.
const WATER_SPRITE_WIDTH_IN_PERCENT = 20
const WATER_SPRITE_SCALE = 0.8
// Needed to compensate for the displacement filter.
const WATER_SPRITE_HORIZONTAL_OVERFLOW_IN_PERCENT = 5
// Needed to remove artifacts on the screen borders.
const WATER_SPRITE_VERTICAL_PADDING_IN_PERCENT = 10

// These constants are calculated based off the configurables.
//
const paddingAdjustedWindowHeightInPercent =
  // WATER_SPRITE_VERTICAL_PADDING_IN_PERCENT * 2 because we need to adjust for
  // both the top and the bottom.
  1 + (WATER_SPRITE_VERTICAL_PADDING_IN_PERCENT * 2) / 100

const getWindowHeight = () =>
  window.innerHeight * paddingAdjustedWindowHeightInPercent

const getWaterSpriteWidth = () =>
  WATER_SPRITE_SCALE * (window.screen.width / window.innerWidth)
const getWaterSpriteHeight = () =>
  WATER_SPRITE_SCALE * 0.3 * (window.screen.height / getWindowHeight())

const GRASS_SPRITE_WIDTH_IN_PERCENT = (100 - WATER_SPRITE_WIDTH_IN_PERCENT) / 2
const GRASS_SPRITE_SCALE = 0.1

const getGrassSpriteWidth = () =>
  GRASS_SPRITE_SCALE * (window.screen.width / window.innerWidth)
const getGrassSpriteHeight = () =>
  GRASS_SPRITE_SCALE * (window.screen.height / getWindowHeight())

const waterTexture = await Assets.load('assets/water.jpg')
const waterSprite = new TilingSprite({
  texture: waterTexture,
  width:
    window.innerWidth *
    ((WATER_SPRITE_WIDTH_IN_PERCENT +
      // WATER_SPRITE_HORIZONTAL_OVERFLOW_IN_PERCENT * 2 because we need to
      // adjust for both the top and the bottom.
      WATER_SPRITE_HORIZONTAL_OVERFLOW_IN_PERCENT * 2) /
      100),
  height: getWindowHeight(),
})
await Assets.load('assets/water-displacement.png')
const waterDisplacementSprite = Sprite.from('assets/water-displacement.png')
waterDisplacementSprite.texture.source.addressMode = 'repeat'
const waterDisplacementFilter = new DisplacementFilter({
  sprite: waterDisplacementSprite,
  scale: 30,
})
waterSprite.filters = [waterDisplacementFilter]
waterSprite.tileScale.x = getWaterSpriteWidth()
waterSprite.tileScale.y = getWaterSpriteHeight()
waterSprite.x =
  window.innerWidth *
  ((GRASS_SPRITE_WIDTH_IN_PERCENT -
    WATER_SPRITE_HORIZONTAL_OVERFLOW_IN_PERCENT) /
    100)

const setWaterSpriteVerticalPaddingDependantsProperties = () => {
  waterDisplacementFilter.padding =
    window.innerHeight * (WATER_SPRITE_VERTICAL_PADDING_IN_PERCENT / 100)
  waterSprite.y =
    -window.innerHeight * (WATER_SPRITE_VERTICAL_PADDING_IN_PERCENT / 100)
}

setWaterSpriteVerticalPaddingDependantsProperties()

app.stage.addChild(waterSprite)
app.ticker.add((ticker) => {
  waterSprite.tilePosition.y += ticker.deltaMS / 25
})

const grassTextureLeft = await Assets.load('assets/grass.jpg')
const grassSpriteLeft = new TilingSprite({
  texture: grassTextureLeft,
  width: window.innerWidth * (GRASS_SPRITE_WIDTH_IN_PERCENT / 100),
  height: getWindowHeight(),
})
grassSpriteLeft.tileScale.x = getGrassSpriteWidth()
grassSpriteLeft.tileScale.y = getGrassSpriteHeight()
app.stage.addChild(grassSpriteLeft)

const grassTextureRight = await Assets.load('assets/grass.jpg')
const grassSpriteRight = new TilingSprite({
  texture: grassTextureRight,
  width: window.innerWidth * (GRASS_SPRITE_WIDTH_IN_PERCENT / 100),
  height: getWindowHeight(),
})
grassSpriteRight.tileScale.x = getGrassSpriteWidth()
grassSpriteRight.tileScale.y = getGrassSpriteHeight()
grassSpriteRight.x =
  (window.innerWidth *
    (WATER_SPRITE_WIDTH_IN_PERCENT + GRASS_SPRITE_WIDTH_IN_PERCENT)) /
  100
app.stage.addChild(grassSpriteRight)

window.addEventListener('resize', () => {
  app.stage.setSize(
    // Not app.screen.width due to buggy layout when resizing.
    window.innerWidth,
    getWindowHeight(),
  )
  waterSprite.tileScale.x = getWaterSpriteWidth()
  waterSprite.tileScale.y = getWaterSpriteHeight()
  grassSpriteRight.tileScale.x = getGrassSpriteWidth()
  grassSpriteRight.tileScale.y = getGrassSpriteHeight()
  grassSpriteLeft.tileScale.x = getGrassSpriteWidth()
  grassSpriteLeft.tileScale.y = getGrassSpriteHeight()
  setWaterSpriteVerticalPaddingDependantsProperties()
})

// —————————PLAYER—————————
