type UseChunkTaskOptions = {
  batchSize?: number
  batchDelay?: number
  idleTimeout?: number
}

export function useChunkTask() {
  const isProcessing = ref(false)
  const error = ref<Error | null>(null)
  const isAborted = ref(false)

  tryOnScopeDispose(stop)

  async function start<T, R>(list: T[], taskFn: (item: T) => Promise<R>, onChunkComplete: (chunkResults: R[]) => void | Promise<void>, options: UseChunkTaskOptions) {
    const { batchSize = 20, batchDelay = 1000, idleTimeout = 2000 } = options

    isProcessing.value = true
    error.value = null
    isAborted.value = false

    function processChunkResults(chunkResults: R[]) {
      const schedule = window.requestIdleCallback || (cb => setTimeout(cb))

      return new Promise<void>(resolve => {
        schedule(
          async () => {
            if (!isAborted.value) {
              await onChunkComplete(chunkResults)
            }
            resolve()
          },
          { timeout: idleTimeout }
        )
      })
    }

    try {
      for (let i = 0; i < list.length; i += batchSize) {
        if (isAborted.value) {
          return
        }

        const chunk = list.slice(i, i + batchSize)
        const chunkResults = await Promise.all(chunk.map(item => taskFn(item)))

        await processChunkResults(chunkResults)

        if (i + batchSize < list.length && !isAborted.value) {
          await new Promise(resolve => setTimeout(resolve, batchDelay))
        }
      }
    } catch (err: any) {
      error.value = err
      throw err
    } finally {
      isProcessing.value = false
    }
  }

  function stop() {
    isAborted.value = true
    isProcessing.value = false
  }

  return { isProcessing, error, isAborted, start, stop }
}
