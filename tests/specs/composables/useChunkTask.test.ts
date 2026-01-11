import { useChunkTask } from '@/composables/useChunkTask'
import { useFakeTimers } from '@/tests/utils/commons'

describe('useChunkTask', () => {
  useFakeTimers()

  describe('start', () => {
    it('should process items in batches', async () => {
      const { start, isProcessing } = useChunkTask()
      const items = Array.from({ length: 50 }, (_, i) => i)
      const taskFn = vi.fn((item: number) => Promise.resolve(item * 2))
      const onChunkComplete = vi.fn()

      const promise = start(items, taskFn, onChunkComplete, { batchSize: 10, batchDelay: 0 })

      expect(isProcessing.value).toBe(true)

      await vi.runAllTimersAsync()
      await promise

      expect(taskFn).toHaveBeenCalledTimes(50)
      expect(onChunkComplete).toHaveBeenCalledTimes(5)
      expect(isProcessing.value).toBe(false)
    })

    it('should handle empty list', async () => {
      const { start, isProcessing } = useChunkTask()
      const taskFn = vi.fn()
      const onChunkComplete = vi.fn()

      await start([], taskFn, onChunkComplete, {})

      expect(taskFn).not.toHaveBeenCalled()
      expect(onChunkComplete).not.toHaveBeenCalled()
      expect(isProcessing.value).toBe(false)
    })

    it('should handle errors', async () => {
      const { start, error } = useChunkTask()
      const items = [1, 2]
      const taskFn = vi.fn(() => Promise.reject(new Error('Task failed')))
      const onChunkComplete = vi.fn()

      await expect(start(items, taskFn, onChunkComplete, {})).rejects.toThrow('Task failed')
      expect(error.value).toEqual(new Error('Task failed'))
    })
  })

  describe('stop', () => {
    it('should stop processing', async () => {
      const { start, stop, isProcessing } = useChunkTask()
      const items = Array.from({ length: 100 }, (_, i) => i)
      const taskFn = vi.fn((item: number) => Promise.resolve(item))
      const onChunkComplete = vi.fn()

      start(items, taskFn, onChunkComplete, { batchSize: 10, batchDelay: 0 })

      expect(isProcessing.value).toBe(true)

      stop()

      expect(isProcessing.value).toBe(false)
    })
  })
})
