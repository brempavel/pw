import { Component, Destroy, Tick } from '@types'
import {
  NOOP_DESTROY,
  NOOP_DESTROY_ERROR_MESSAGE,
  NOOP_ON_TICK,
  NOOP_ON_TICK_ERROR_MESSAGE,
} from '@constants'

export const debounce = (callback: Function, delay: number) => {
  const errorSuffix = 'debounce: no argument:'
  if (!callback) throw new Error(`${errorSuffix} callback.`)
  if (typeof delay !== 'number') throw new Error(`${errorSuffix} delay.`)
  let debouncedCallId: number
  return () => {
    clearTimeout(debouncedCallId)
    debouncedCallId = setTimeout(callback, delay)
  }
}

export const isTick = (
  component: Component | Tick | undefined | null,
): component is Tick => {
  if (!component) return false
  const onTick = 'onTick'
  if (!(onTick in component)) return false
  const method = component[onTick]
  if (typeof method !== 'function') {
    throw new Error('isTick: method isn’t a function.')
  }
  if (method === NOOP_ON_TICK) {
    throw new Error(
      'isDestroy: method is NOOP_ON_TICK. ' + NOOP_ON_TICK_ERROR_MESSAGE,
    )
  }
  return true
}

export const isDestroy = (
  component: Component | Destroy | undefined | null,
): component is Destroy => {
  if (!component) return false
  const destroy = 'destroy'
  if (!(destroy in component)) return false
  const method = component[destroy]
  if (typeof method !== 'function') {
    throw new Error('isDestroy: method isn’t a function.')
  }
  if (method === NOOP_DESTROY) {
    throw new Error(
      'isDestroy: method is NOOP_DESTROY. ' + NOOP_DESTROY_ERROR_MESSAGE,
    )
  }
  return true
}

export const getDoesntExistError = (
  strings: TemplateStringsArray,
  component: string,
  method: string,
): Error => {
  const errorSuffix = 'getDoesntExistError: no argument:'
  if (!component) {
    throw new Error(`${errorSuffix} component.`)
  }
  if (!method) {
    throw new Error(`${errorSuffix} method.`)
  }
  let [missing] = strings.filter((string) => string.replace(/\s/g, ''))
  if (!missing) {
    throw new Error(`${errorSuffix} missing.`)
  }
  return new Error(`${component}: ${method}: ${missing.trim()} doesn’t exist.`)
}
