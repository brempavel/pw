import { Assets, Point, Sprite, Texture } from 'pixi.js'

import { Component, InitParams, Radians, Tick } from '@types'
import { NOOP_ON_TICK } from '@constants'
import { debounce, getDoesntExistError } from '@utils'

const NO_TARGET = new Point(-1, -1)
const PUDGE_TURNING_SPEED = 0.15
const PUDGE_MOVEMENT_SPEED = 4

export class Player extends Component implements Tick {
  sprite: Sprite | null = null
  target = new Point(-1, -1)

  override async init({ container }: InitParams): Promise<this> {
    this.sprite = new Sprite({
      texture: await Assets.load<Texture>('assets/pudge-stand-by.png'),
    })
    this.sprite.anchor.set(0.5)
    this.sprite.position.set(
      this.sceneManager.width / 5,
      this.sceneManager.height / 2,
    )
    this.onResize()

    container.eventMode = 'static'
    container.on('pointerdown', ({ global }) => {
      this.target.copyFrom(global)
    })

    this.onTick = (ticker) => {
      if (!this.sprite || this.target.equals(NO_TARGET)) return

      while (Math.PI < this.sprite.rotation) {
        this.sprite.rotation -= 2 * Math.PI
      }
      while (-Math.PI > this.sprite.rotation) {
        this.sprite.rotation += 2 * Math.PI
      }

      if (this.targetAngle !== this.sprite.rotation) {
        let deltaAngle = this.targetAngle - this.sprite.rotation
        while (Math.PI < deltaAngle) deltaAngle -= 2 * Math.PI
        while (-Math.PI > deltaAngle) deltaAngle += 2 * Math.PI
        const rotation = ticker.deltaTime * PUDGE_TURNING_SPEED
        if (Math.abs(deltaAngle) <= rotation) {
          this.sprite.rotation = this.targetAngle
        } else if (deltaAngle > 0) this.sprite.rotation += rotation
        else if (deltaAngle < 0) this.sprite.rotation -= rotation
        return
      }

      const dx = this.target.x - this.sprite.x
      const dy = this.target.y - this.sprite.y
      if (Math.hypot(dx, dy) > PUDGE_MOVEMENT_SPEED) {
        let angle = Math.atan2(dy, dx)
        this.sprite.x += Math.cos(angle) * PUDGE_MOVEMENT_SPEED
        this.sprite.y += Math.sin(angle) * PUDGE_MOVEMENT_SPEED
      } else {
        this.sprite.x = this.target.x
        this.sprite.y = this.target.y
        this.target = new Point(-1, -1)
      }
    }

    container.addChild(this.sprite)

    const debouncedOnResize = debounce(this.onResize, 0)
    this.sceneManager.addEventListener('resize', this.onResize)
    this.sceneManager.addEventListener('resize', debouncedOnResize)

    return this
  }

  onTick = NOOP_ON_TICK

  private get targetAngle(): Radians {
    if (!this.sprite || this.target.equals(NO_TARGET)) return 0
    const x = this.target.x - this.sprite.x
    const y = this.target.y - this.sprite.y
    let angle =
      // -x, y is the west-clockwise convention which is used by PixiJS.
      Math.atan2(-x, y) -
      // Subtract 90° to turn the player correctly so he’s facing the target.
      Math.PI / 2
    while (angle > Math.PI) angle -= 2 * Math.PI
    while (angle < -Math.PI) angle += 2 * Math.PI
    return angle
  }

  private onResize = () => {
    if (!this.sprite) {
      throw getDoesntExistError`${this.constructor.name} ${this.onResize.name} this.sprite`
    }
    this.sprite.width = this.sceneManager.width / 10
    this.sprite.height = this.sprite.width * 1.1
  }
}
