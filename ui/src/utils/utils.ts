import { Component, Destroy, Tick } from '@types'

export const debounce = (callback: Function, delay: number) => {
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
