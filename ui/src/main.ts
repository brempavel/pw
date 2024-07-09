import { SceneManager } from '@scene-manager'
import { Match } from '@components'

const sceneManager = await new SceneManager(window).init()
await sceneManager.setScene(new Match(sceneManager))
