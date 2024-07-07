import { Destroy, Tick } from '@types'

export const NOOP_ON_TICK: Tick['onTick'] = () => {
  throw new Error(
    'NOOP_ON_TICK has been called. It’s an empty function and mustn’t be' +
      ' used. All Component.onTick’s which equal to NOOP_ON_TICK must be' +
      ' overwritten with a real function.',
  )
}

export const NOOP_DESTROY: Destroy['destroy'] = () => {
  throw new Error(
    'NOOP_ON_DESTROY has been called. It’s an empty function and mustn’t be' +
      ' used. All Component.destroy’s which equal to NOOP_ON_DESTROY must be' +
      ' overwritten with a real function.',
  )
}
