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

const WATER_SPRITE_WIDTH_IN_PERCENT = 18
const WATER_SPRITE_SCALE = 1.1
// Needed to compensate for the displacement filter.
const WATER_SPRITE_HORIZONTAL_OVERFLOW_IN_PERCENT = 5
// Needed to remove artifacts on the screen borders.
const WATER_SPRITE_VERTICAL_PADDING_IN_PX = 60

window.addEventListener('resize', () => {
  app.stage.setSize(
    // Not app.screen.width due to buggy layout when resizing.
    window.innerWidth,
    window.innerHeight + WATER_SPRITE_VERTICAL_PADDING_IN_PX * 2,
  )
})

const GRASS_SPRITE_WIDTH_IN_PERCENT = (100 - WATER_SPRITE_WIDTH_IN_PERCENT) / 2
const GRASS_SPRITE_SCALE = 0.1

const waterTexture = await Assets.load('assets/water.jpg')
const waterSprite = new TilingSprite({
  texture: waterTexture,
  width:
    window.innerWidth *
    ((WATER_SPRITE_WIDTH_IN_PERCENT +
      2 * WATER_SPRITE_HORIZONTAL_OVERFLOW_IN_PERCENT) /
      100),
  height: window.innerHeight + WATER_SPRITE_VERTICAL_PADDING_IN_PX * 2,
})
await Assets.load('assets/water-displacement.png')
const waterDisplacementSprite = Sprite.from('assets/water-displacement.png')
waterDisplacementSprite.texture.source.addressMode = 'repeat'
const filter = new DisplacementFilter({
  sprite: waterDisplacementSprite,
  scale: 30,
})
filter.padding = WATER_SPRITE_VERTICAL_PADDING_IN_PX
waterSprite.filters = [filter]
waterSprite.tileScale.x = WATER_SPRITE_SCALE
waterSprite.tileScale.y = WATER_SPRITE_SCALE
waterSprite.x =
  window.innerWidth *
  ((GRASS_SPRITE_WIDTH_IN_PERCENT -
    WATER_SPRITE_HORIZONTAL_OVERFLOW_IN_PERCENT) /
    100)
waterSprite.y -= WATER_SPRITE_VERTICAL_PADDING_IN_PX
app.stage.addChild(waterSprite)
app.ticker.add((ticker) => {
  waterSprite.tilePosition.y += ticker.deltaMS / 60
})

const grassTextureLeft = await Assets.load('assets/grass.jpg')
const grassSpriteLeft = new TilingSprite({
  texture: grassTextureLeft,
  width: window.innerWidth * (GRASS_SPRITE_WIDTH_IN_PERCENT / 100),
  height: window.innerHeight + WATER_SPRITE_VERTICAL_PADDING_IN_PX * 2,
})
grassSpriteLeft.tileScale.x = GRASS_SPRITE_SCALE
grassSpriteLeft.tileScale.y = GRASS_SPRITE_SCALE
app.stage.addChild(grassSpriteLeft)

const grassTextureRight = await Assets.load('assets/grass.jpg')
const grassSpriteRight = new TilingSprite({
  texture: grassTextureRight,
  width: window.innerWidth * (GRASS_SPRITE_WIDTH_IN_PERCENT / 100),
  height: window.innerHeight + WATER_SPRITE_VERTICAL_PADDING_IN_PX * 2,
})
grassSpriteRight.x =
  (window.innerWidth *
    (WATER_SPRITE_WIDTH_IN_PERCENT + GRASS_SPRITE_WIDTH_IN_PERCENT)) /
  100
grassSpriteRight.tileScale.x = GRASS_SPRITE_SCALE
grassSpriteRight.tileScale.y = GRASS_SPRITE_SCALE
app.stage.addChild(grassSpriteRight)
