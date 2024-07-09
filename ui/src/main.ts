import { SceneManager } from '@scene-manager'
import { Match } from '@components'

const sceneManager = await new SceneManager(window).init()
await sceneManager.setScene(new Match(sceneManager))

// await loadAssetsAndBuildBattlefield(app.app)

// —————————PLAYER—————————

// const STAND_BY_PUDGE_WIDTH_IN_PX = 112
// const RUNNING_PUDGE_WIDTH_IN_PX = 150
// const PUDGE_HEIGHT_IN_PX = 138
// // const MOVEMENT_SPEED = 0.05
//
// enum Animations {
//   StandByLeft = 'standByLeft',
//   StandByRight = 'standByRight',
//   RunLeft = 'runLeft',
//   RunRight = 'runRigth',
// }
//
// const pudgeData: {
//   frames: Record<
//     Animations,
//     {
//       frame: {
//         x: number
//         y: number
//         w: number
//         h: number
//       }
//       sourceSize: {
//         w: number
//         h: number
//       }
//       spriteSourceSize: {
//         x: number
//         y: number
//         w: number
//         h: number
//       }
//     }
//   >
//   meta: {
//     image: string
//     format: string
//     size: {
//       w: number
//       h: number
//     }
//     scale: number
//   }
//   animations: Record<Animations, Animations[]>
// } = {
//   frames: {
//     [Animations.StandByLeft]: {
//       frame: {
//         x: 48,
//         y: 0,
//         w: STAND_BY_PUDGE_WIDTH_IN_PX,
//         h: PUDGE_HEIGHT_IN_PX,
//       },
//       sourceSize: { w: STAND_BY_PUDGE_WIDTH_IN_PX, h: PUDGE_HEIGHT_IN_PX },
//       spriteSourceSize: {
//         x: 0,
//         y: 0,
//         w: STAND_BY_PUDGE_WIDTH_IN_PX,
//         h: PUDGE_HEIGHT_IN_PX,
//       },
//     },
//     [Animations.StandByRight]: {
//       frame: {
//         x: 1320,
//         y: 0,
//         w: STAND_BY_PUDGE_WIDTH_IN_PX,
//         h: PUDGE_HEIGHT_IN_PX,
//       },
//       sourceSize: { w: STAND_BY_PUDGE_WIDTH_IN_PX, h: PUDGE_HEIGHT_IN_PX },
//       spriteSourceSize: {
//         x: 0,
//         y: 0,
//         w: STAND_BY_PUDGE_WIDTH_IN_PX,
//         h: PUDGE_HEIGHT_IN_PX,
//       },
//     },
//     [Animations.RunLeft]: {
//       frame: {
//         x: 240,
//         y: 0,
//         w: RUNNING_PUDGE_WIDTH_IN_PX,
//         h: PUDGE_HEIGHT_IN_PX,
//       },
//       sourceSize: { w: RUNNING_PUDGE_WIDTH_IN_PX, h: PUDGE_HEIGHT_IN_PX },
//       spriteSourceSize: {
//         x: 0,
//         y: 0,
//         w: RUNNING_PUDGE_WIDTH_IN_PX,
//         h: PUDGE_HEIGHT_IN_PX,
//       },
//     },
//     [Animations.RunRight]: {
//       frame: {
//         x: 1510,
//         y: 0,
//         w: RUNNING_PUDGE_WIDTH_IN_PX,
//         h: PUDGE_HEIGHT_IN_PX,
//       },
//       sourceSize: { w: RUNNING_PUDGE_WIDTH_IN_PX, h: PUDGE_HEIGHT_IN_PX },
//       spriteSourceSize: {
//         x: 0,
//         y: 0,
//         w: RUNNING_PUDGE_WIDTH_IN_PX,
//         h: PUDGE_HEIGHT_IN_PX,
//       },
//     },
//   },
//   meta: {
//     image: 'assets/pudge.webp',
//     format: 'RGBA8888',
//     size: { w: 1920, h: 138 },
//     scale: 1,
//   },
//   animations: {
//     [Animations.StandByLeft]: [Animations.StandByLeft],
//     [Animations.StandByRight]: [Animations.StandByRight],
//     [Animations.RunLeft]: [Animations.StandByLeft, Animations.RunLeft],
//     [Animations.RunRight]: [Animations.StandByRight, Animations.RunRight],
//   },
// }
//
// await Assets.load('assets/pudge.webp')
//
// const pudgeSpritesheet = new Spritesheet(
//   Texture.from(pudgeData.meta.image),
//   pudgeData,
// )
//
// await pudgeSpritesheet.parse()
//
// const animations: Record<Animations, AnimatedSprite> = (
//   Object.keys(pudgeSpritesheet.animations) as Animations[]
// ).reduce((animations, animation) => {
//   animations[animation] = new AnimatedSprite(
//     pudgeSpritesheet.animations[animation],
//   )
//   animations[animation].animationSpeed = 0.1
//   animations[animation].loop = true
//
//   return animations
// }, Object.create(Animations))
//
// const pudge = animations[Animations.StandByRight]
// pudge.width = STAND_BY_PUDGE_WIDTH_IN_PX
// pudge.height = PUDGE_HEIGHT_IN_PX
// pudge.position.set(0, 0)
//
// pudge.play()
// app.stage.addChild(pudge)
//
// const mouseCoords: Point = new Point(0, 0)
//
// // const distanceBetweenTwoPoints = (p1: Point, p2: Point) => {
// //   const a = p1.x - p2.x
// //   const b = p1.y - p2.y
// //
// //   return Math.hypot(a, b)
// // }
//
// const movePudgeTo = (x: number, y: number) => {
//   // const currentPosition = new Point(pudge.x, pudge.y)
//   // const newPosition = new Point(mouseCoords.x, mouseCoords.y)
//   //
//   // // const distanceMousePudge = distanceBetweenTwoPoints(
//   //   newPosition,
//   //   currentPosition,
//   // )
//   // const pudgeSpeed = distanceMousePudge * MOVEMENT_SPEED
//
//   pudge.x = x
//   pudge.y = y
// }
// // app.ticker.add((time) => {
// //   if (!mouseCoords) return
// // })
//
// app.stage.eventMode = 'static'
// app.stage.hitArea = app.screen
// app.stage.on('pointerdown', (event) => {
//   mouseCoords.x = event.global.x
//   mouseCoords.y = event.global.y
//   // movePudgeTo(event.global.x, event.global.y)
// })
