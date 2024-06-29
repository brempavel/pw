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
window.addEventListener('resize', () => {
  app.stage.setSize(app.screen.width, app.screen.height)
})

const WATER_SPRITE_SIDE_OVERFLOW_IN_PERCENT = 5
const WATER_SPRITE_WIDTH_IN_PERCENT = 18
const WATER_SPRITE_SCALE = 1.1

const GRASS_SPRITE_WIDTH_IN_PERCENT = (100 - WATER_SPRITE_WIDTH_IN_PERCENT) / 2
const GRASS_SPRITE_SCALE = 0.1

const waterTexture = await Assets.load('assets/water.jpg')
const waterSprite = new TilingSprite({
  texture: waterTexture,
  width:
    app.screen.width *
    ((WATER_SPRITE_WIDTH_IN_PERCENT +
      2 * WATER_SPRITE_SIDE_OVERFLOW_IN_PERCENT) /
      100),
  height: app.screen.height,
})
await Assets.load('assets/water-displacement.png')
const waterDisplacementSprite = Sprite.from('assets/water-displacement.png')
waterDisplacementSprite.texture.source.addressMode = 'repeat'
const filter = new DisplacementFilter({
  sprite: waterDisplacementSprite,
  scale: 30,
})
waterSprite.filters = [filter]
waterSprite.tileScale.x = WATER_SPRITE_SCALE
waterSprite.tileScale.y = WATER_SPRITE_SCALE
waterSprite.x =
  app.screen.width *
  ((GRASS_SPRITE_WIDTH_IN_PERCENT - WATER_SPRITE_SIDE_OVERFLOW_IN_PERCENT) /
    100)
app.stage.addChild(waterSprite)
app.ticker.add((ticker) => {
  waterSprite.tilePosition.y += ticker.deltaMS / 60
})

const grassTextureLeft = await Assets.load('assets/grass.jpg')
const grassSpriteLeft = new TilingSprite({
  texture: grassTextureLeft,
  width: app.screen.width * (GRASS_SPRITE_WIDTH_IN_PERCENT / 100),
  height: app.screen.height,
})
grassSpriteLeft.tileScale.x = GRASS_SPRITE_SCALE
grassSpriteLeft.tileScale.y = GRASS_SPRITE_SCALE
app.stage.addChild(grassSpriteLeft)

const grassTextureRight = await Assets.load('assets/grass.jpg')
const grassSpriteRight = new TilingSprite({
  texture: grassTextureRight,
  width: app.screen.width * (GRASS_SPRITE_WIDTH_IN_PERCENT / 100),
  height: app.screen.height,
})
grassSpriteRight.x =
  (app.screen.width *
    (WATER_SPRITE_WIDTH_IN_PERCENT + GRASS_SPRITE_WIDTH_IN_PERCENT)) /
  100
grassSpriteRight.tileScale.x = GRASS_SPRITE_SCALE
grassSpriteRight.tileScale.y = GRASS_SPRITE_SCALE
app.stage.addChild(grassSpriteRight)
