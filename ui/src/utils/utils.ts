import { Component, Destroy, Tick } from '@types'

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
  return 'onTick' in component
}

export const isDestroy = (
  component: Component | Destroy | undefined | null,
): component is Destroy => {
  if (!component) return false
  return 'destroy' in component
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
