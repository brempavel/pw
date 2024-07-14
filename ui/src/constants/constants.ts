import { Destroy, Tick } from '@types'

const getNoopErrorMessage = (methodName: string, functionName: string) =>
  'It’s an empty function and mustn’t be used. All' +
  ` Component.${methodName}’s which are equal to ${functionName} must be` +
  ' overwritten with a real function.'

const noopOnTick = 'NOOP_ON_TICK'
export const NOOP_ON_TICK_ERROR_MESSAGE = getNoopErrorMessage(
  'onTick',
  noopOnTick,
)
export const NOOP_ON_TICK: Tick['onTick'] = () => {
  throw new Error(
    `${noopOnTick} has been called. ${NOOP_ON_TICK_ERROR_MESSAGE}`,
  )
}

const noopDestroy = 'NOOP_DESTROY'
export const NOOP_DESTROY_ERROR_MESSAGE = getNoopErrorMessage(
  'destroy',
  noopDestroy,
)
export const NOOP_DESTROY: Destroy['destroy'] = () => {
  throw new Error(
    `${noopDestroy} has been called. ${NOOP_DESTROY_ERROR_MESSAGE}`,
  )
}
