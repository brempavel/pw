import { Application, Renderer } from 'pixi.js'

export type App = Application<Renderer>

export const initAndGetApp = async (): Promise<App> => {
  const app = new Application()
  await app.init({ resizeTo: window })
  window.document.body.appendChild(app.canvas)
  return app
}
