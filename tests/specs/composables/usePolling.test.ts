import { usePolling } from '@/composables/usePolling'
import { useFakeTimers } from '@/tests/utils/commons'

describe('usePolling', () => {
  useFakeTimers()

  describe('start', () => {
    it('should start polling', () => {
      const { start, isPolling } = usePolling()
      const callback = vi.fn()

      start(callback, 1000)

      expect(isPolling.value).toBe(true)
      expect(callback).toHaveBeenCalledTimes(1)
    })

    it('should execute callback at intervals', () => {
      const { start } = usePolling()
      const callback = vi.fn()

      start(callback, 1000)

      expect(callback).toHaveBeenCalledTimes(1)

      vi.advanceTimersByTime(1000)

      expect(callback).toHaveBeenCalledTimes(2)

      vi.advanceTimersByTime(1000)

      expect(callback).toHaveBeenCalledTimes(3)
    })

    it('should adjust timing based on execution time', () => {
      const { start } = usePolling()
      const callback = vi.fn(() => {
        vi.advanceTimersByTime(200)
      })

      start(callback, 1000)

      expect(callback).toHaveBeenCalledTimes(1)

      vi.advanceTimersByTime(800)

      expect(callback).toHaveBeenCalledTimes(2)
    })
  })

  describe('stop', () => {
    it('should stop polling', () => {
      const { start, stop, isPolling } = usePolling()
      const callback = vi.fn()

      start(callback, 1000)
      stop()

      expect(isPolling.value).toBe(false)

      expect(callback).toHaveBeenCalledTimes(1)

      vi.advanceTimersByTime(2000)

      expect(callback).toHaveBeenCalledTimes(1)
    })

    it('should handle stop when not started', () => {
      const { stop, isPolling } = usePolling()

      stop()

      expect(isPolling.value).toBe(false)
    })
  })
})
