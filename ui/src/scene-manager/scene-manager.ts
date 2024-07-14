import { Container, Application, WebGPURenderer, Ticker } from 'pixi.js'

import { Component } from '@types'
import { getDoesntExistError, isDestroy, isTick } from '@utils'

export class SceneManager {
  private scene: Component | undefined
  private app: Application<WebGPURenderer> | undefined

  private eventListeners: [keyof WindowEventMap, () => any][] = []

  get width(): number {
    return this.window.innerWidth
  }
  get height(): number {
    return this.window.innerHeight
  }

  constructor(private window: Window) {}

  addEventListener(eventName: keyof WindowEventMap, listener: () => any) {
    this.window.addEventListener(eventName, listener)
    this.eventListeners.push([eventName, listener])
  }

  async init(): Promise<SceneManager> {
    this.app = new Application<WebGPURenderer>()
    if (import.meta.env.DEV) globalThis.__PIXI_APP__ = this.app
    await this.app.init({
      resizeTo: this.window,
      resolution: this.window.devicePixelRatio,
      autoDensity: true,
      antialias: true,
    })
    this.window.document.body.appendChild(this.app.canvas)

    this.app.ticker.add(this.onTick)

    return this
  }

  async setScene(scene: Component): Promise<void> {
    if (this.app) {
      await this.deleteScene()
    } else {
      await this.init()
    }
    if (!this.app) {
      throw getDoesntExistError`${this.constructor.name} ${this.setScene.name} this.app`
    }

    const container = new Container()

    this.scene = await scene.init({ container })

    this.app.stage.addChild(container)
  }

  async deleteScene() {
    if (isDestroy(this.scene)) await this.scene.destroy()
    this.app?.stage.removeChildren()
    this.eventListeners.forEach((listener) =>
      this.window.removeEventListener(...listener),
    )
  }

  async destroy(): Promise<void> {
    if (!this.app) {
      throw getDoesntExistError`${this.constructor.name} ${this.destroy.name} this.app`
    }
    this.app.destroy(true, true)
    this.eventListeners.forEach((listener) =>
      this.window.removeEventListener(...listener),
    )
  }

  private onTick = (ticker: Ticker) => {
    if (!this.app) {
      throw getDoesntExistError`${this.constructor.name} ${this.onTick.name} this.app`
    }
    this.app.renderer.resolution = this.window.devicePixelRatio
    if (isTick(this.scene)) this.scene.onTick(ticker)
  }
}
