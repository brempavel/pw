import { Assets, Point, Sprite, Texture } from 'pixi.js'

import { Component, InitParams, Radians, Tick } from '@types'
import { NOOP_ON_TICK } from '@constants'
import { debounce, getDoesntExistError, normalizeAngle } from '@utils'

const NO_TARGET = new Point(-1, -1)
const PLAYER_TURNING_SPEED = 0.18
const PLAYER_MOVEMENT_SPEED = 3.5

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

      this.sprite.rotation = normalizeAngle(this.sprite.rotation)

      if (this.targetAngle !== this.sprite.rotation) {
        const rotation = ticker.deltaTime * PLAYER_TURNING_SPEED
        if (Math.abs(this.deltaAngle) <= rotation) {
          this.sprite.rotation = this.targetAngle
        } else if (0 < this.deltaAngle) this.sprite.rotation += rotation
        else if (0 > this.deltaAngle) this.sprite.rotation -= rotation
        else {
          if (Math.abs(this.deltaAngle) <= rotation) {
            throw new Error(
              `${this.constructor.name}: ${this.onTick.name}:` +
                ' the error below (in the code) wasn’t updated and may be' +
                ' irrelevant.',
            )
          }
          throw new Error(
            `${this.constructor.name}: ${this.onTick.name}:` +
              ' Math.abs(this.deltaAngle) > rotation, but' +
              ' this.deltaAngle === 0.',
          )
        }
        return
      }

      const movement = ticker.deltaTime * PLAYER_MOVEMENT_SPEED
      // π must be subtracted from this.targetAngle to get atan2(y, x) from
      // atan2(-x, y).
      const angle = this.targetAngle - Math.PI
      const xMovement = Math.cos(angle) * movement
      const yMovement = Math.sin(angle) * movement
      if (
        Math.hypot(
          this.target.x - this.sprite.x,
          this.target.y - this.sprite.y,
        ) <= movement
      ) {
        this.sprite.x = this.target.x
        this.sprite.y = this.target.y
        this.target = new Point(-1, -1)
      } else {
        this.sprite.x += xMovement
        this.sprite.y += yMovement
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
    if (!this.sprite) {
      throw getDoesntExistError`${this.constructor.name} ${this.onResize.name} this.sprite`
    }
    if (this.target.equals(NO_TARGET)) return this.sprite.rotation
    return normalizeAngle(
      // -x, y is the west-clockwise convention which is used by PixiJS.
      Math.atan2(
        -(this.target.x - this.sprite.x),
        this.target.y - this.sprite.y,
      ) -
        // Subtract 90° to turn the player correctly so he’s facing the target.
        Math.PI / 2,
    )
  }
  private get deltaAngle(): Radians {
    if (!this.sprite) {
      throw getDoesntExistError`${this.constructor.name} ${'deltaAngle'} this.sprite`
    }
    return normalizeAngle(this.targetAngle - this.sprite.rotation)
  }

  private onResize = () => {
    if (!this.sprite) {
      throw getDoesntExistError`${this.constructor.name} ${this.onResize.name} this.sprite`
    }
    this.sprite.width = this.sceneManager.width / 10
    this.sprite.height = this.sprite.width * 1.1
  }
}
