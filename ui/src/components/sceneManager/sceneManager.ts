import { Container, Application, WebGPURenderer, Ticker } from 'pixi.js'

import { Component } from '@types'

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

  async build(): Promise<SceneManager> {
    this.app = new Application<WebGPURenderer>()
    await this.app.init({ resizeTo: this.window })
    this.window.document.body.appendChild(this.app.canvas)

    this.app.ticker.add(this.onTick)

    return this
  }

  async setScene(scene: Component): Promise<void> {
    if (this.app) {
      await this.deleteScene()
    } else {
      await this.build()
    }

    const container = new Container()
    this.app!.stage.addChild(container)

    this.scene = await scene.build(container)
  }

  async deleteScene() {
    await this.scene?.destroy?.()
    this.app?.stage.removeChildren()
  }

  async destroy(): Promise<void> {
    this.app?.destroy(true, true)
    this.eventListeners.forEach((listener) =>
      this.window.removeEventListener(...listener),
    )
  }

  private onTick = (ticker: Ticker) => {
    if (this.scene !== undefined) {
      this.scene?.onTick?.(ticker)
    }
  }
}
