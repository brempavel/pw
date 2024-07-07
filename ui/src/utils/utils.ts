export const debounce = (callback: Function, delay: number) => {
  let debouncedCallId: number
  return () => {
    clearTimeout(debouncedCallId)
    debouncedCallId = setTimeout(callback, delay)
  }
}
