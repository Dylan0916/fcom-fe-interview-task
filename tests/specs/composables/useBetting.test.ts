import { useBetting } from '@/composables/useBetting'
import type { Match } from '@/types/betting'

describe('useBetting', () => {
  const mockMatches: Match[] = [
    {
      id: '1',
      homeTeam: 'Team A',
      awayTeam: 'Team B',
      odds: {
        home: 1.25,
        draw: 10.0,
        away: 3.75,
      },
    },
    {
      id: '2',
      homeTeam: 'Team C',
      awayTeam: 'Team D',
      odds: {
        home: 1.5,
        draw: 12.0,
        away: 2.5,
      },
    },
  ]

  describe('toggleSelection', () => {
    it('should add selection when not selected', () => {
      const { toggleSelection, selections } = useBetting(mockMatches)

      toggleSelection('1', 'home')

      expect(selections.value).toHaveLength(1)
      expect(selections.value[0]).toEqual({ matchId: '1', betType: 'home' })
    })

    it('should remove selection when already selected', () => {
      const { toggleSelection, selections } = useBetting(mockMatches)

      toggleSelection('1', 'home')
      toggleSelection('1', 'home')

      expect(selections.value).toHaveLength(0)
    })

    it('should handle multiple selections', () => {
      const { toggleSelection, selections } = useBetting(mockMatches)

      toggleSelection('1', 'home')
      toggleSelection('1', 'draw')
      toggleSelection('2', 'away')

      expect(selections.value).toHaveLength(3)
    })
  })

  describe('betStates', () => {
    it('should initialize with all states as unselected', () => {
      const { betStates } = useBetting(mockMatches)

      const state = betStates.value.get(getBettingKey('1', 'home'))

      expect(state).toBeDefined()
      expect(state?.isSelected).toBe(false)
      expect(state?.isInConflict).toBe(false)
      expect(state?.hasConflict).toBe(false)
      expect(state?.odds).toBe(1.25)
    })

    it('should update state when selection is toggled', () => {
      const { toggleSelection, betStates } = useBetting(mockMatches)

      toggleSelection('1', 'home')

      const state = betStates.value.get(getBettingKey('1', 'home'))

      expect(state?.isSelected).toBe(true)
      expect(state?.isInConflict).toBe(false)
      expect(state?.hasConflict).toBe(false)
    })

    it('should mark conflict when multiple selections in same match', () => {
      const { toggleSelection, betStates } = useBetting(mockMatches)

      toggleSelection('1', 'home')
      toggleSelection('1', 'draw')

      const homeState = betStates.value.get(getBettingKey('1', 'home'))
      const drawState = betStates.value.get(getBettingKey('1', 'draw'))

      expect(homeState?.isSelected).toBe(true)
      expect(homeState?.isInConflict).toBe(true)
      expect(homeState?.hasConflict).toBe(true)

      expect(drawState?.isSelected).toBe(true)
      expect(drawState?.isInConflict).toBe(true)
      expect(drawState?.hasConflict).toBe(true)
    })

    it('should not mark conflict for selections in different matches', () => {
      const { toggleSelection, betStates } = useBetting(mockMatches)

      toggleSelection('1', 'home')
      toggleSelection('2', 'draw')

      const homeState = betStates.value.get(getBettingKey('1', 'home'))
      const drawState = betStates.value.get(getBettingKey('2', 'draw'))

      expect(homeState?.isSelected).toBe(true)
      expect(homeState?.isInConflict).toBe(false)

      expect(drawState?.isSelected).toBe(true)
      expect(drawState?.isInConflict).toBe(false)
    })
  })

  describe('calculateTotalOdds', () => {
    it('should return default odds when no selections', () => {
      const { calculateTotalOdds } = useBetting(mockMatches)

      const result = calculateTotalOdds()

      expect(result).toEqual({ min: 1, max: 1 })
    })

    it('should calculate total odds without conflict', () => {
      const { toggleSelection, calculateTotalOdds } = useBetting(mockMatches)

      toggleSelection('1', 'home')
      toggleSelection('2', 'away')

      const result = calculateTotalOdds()

      expect(result.min).toBe(1.25 * 2.5)
      expect(result.max).toBe(1.25 * 2.5)
    })

    it('should calculate odds range with conflict', () => {
      const { toggleSelection, calculateTotalOdds } = useBetting(mockMatches)

      toggleSelection('1', 'home')
      toggleSelection('1', 'away')
      toggleSelection('2', 'draw')

      const result = calculateTotalOdds()

      expect(result.min).toBe(1.25 * 12)
      expect(result.max).toBe(3.75 * 12)
    })

    it('should handle multiple conflicts', () => {
      const { toggleSelection, calculateTotalOdds } = useBetting(mockMatches)

      toggleSelection('1', 'home')
      toggleSelection('1', 'draw')
      toggleSelection('2', 'home')
      toggleSelection('2', 'away')

      const result = calculateTotalOdds()

      expect(result.min).toBe(1.25 * 1.5)
      expect(result.max).toBe(10 * 2.5)
    })
  })

  describe('clearSelections', () => {
    it('should clear all selections', () => {
      const { toggleSelection, clearSelections, selections } = useBetting(mockMatches)

      toggleSelection('1', 'home')
      toggleSelection('2', 'draw')

      expect(selections.value).toHaveLength(2)

      clearSelections()

      expect(selections.value).toHaveLength(0)
    })
  })
})
