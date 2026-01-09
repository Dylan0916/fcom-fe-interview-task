export function usePolling() {
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  const isPolling = ref(false)

  tryOnScopeDispose(stop)

  function start(callback: () => void, interval: number) {
    let lastExecutionTime = 0

    isPolling.value = true

    function execute() {
      lastExecutionTime = performance.now()
      callback()
    }

    function scheduleNext() {
      const now = performance.now()
      const timeSinceLastExecution = now - lastExecutionTime
      const remainingTime = Math.max(0, interval - timeSinceLastExecution)

      timeoutId = setTimeout(() => {
        execute()
        scheduleNext()
      }, remainingTime)
    }

    execute()
    scheduleNext()
  }

  function stop() {
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
    isPolling.value = false
  }

  return { isPolling, start, stop }
}
