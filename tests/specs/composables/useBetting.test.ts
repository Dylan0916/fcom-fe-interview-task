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
      const { toggleSelection, selectionMap } = useBetting(mockMatches)

      toggleSelection('1', 'home')

      expect(selectionMap.value.size).toBe(1)
      expect(selectionMap.value.get('1')).toEqual(new Set(['home']))
    })

    it('should remove selection when already selected', () => {
      const { toggleSelection, selectionMap } = useBetting(mockMatches)

      toggleSelection('1', 'home')
      toggleSelection('1', 'home')

      expect(selectionMap.value.size).toBe(0)
    })

    it('should handle multiple selections', () => {
      const { toggleSelection, selectionMap } = useBetting(mockMatches)

      toggleSelection('1', 'home')
      toggleSelection('1', 'draw')
      toggleSelection('2', 'away')

      expect(selectionMap.value.size).toBe(2)
      expect(selectionMap.value.get('1')).toEqual(new Set(['home', 'draw']))
      expect(selectionMap.value.get('2')).toEqual(new Set(['away']))
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

  describe('totalOdds', () => {
    it('should return default odds when no selections', () => {
      const { totalOdds } = useBetting(mockMatches)

      expect(totalOdds.value).toEqual({ min: 1, max: 1 })
    })

    it('should calculate total odds without conflict', () => {
      const { totalOdds, toggleSelection } = useBetting(mockMatches)

      toggleSelection('1', 'home')
      toggleSelection('2', 'away')

      expect(totalOdds.value).toEqual({ min: 1.25 * 2.5, max: 1.25 * 2.5 })
    })

    it('should calculate odds range with conflict', () => {
      const { totalOdds, toggleSelection } = useBetting(mockMatches)

      toggleSelection('1', 'home')
      toggleSelection('1', 'away')
      toggleSelection('2', 'draw')

      expect(totalOdds.value).toEqual({ min: 1.25 * 12, max: 3.75 * 12 })
    })

    it('should handle multiple conflicts', () => {
      const { totalOdds, toggleSelection } = useBetting(mockMatches)

      toggleSelection('1', 'home')
      toggleSelection('1', 'draw')
      toggleSelection('2', 'home')
      toggleSelection('2', 'away')

      expect(totalOdds.value).toEqual({ min: 1.25 * 1.5, max: 10 * 2.5 })
    })
  })

  describe('clearSelections', () => {
    it('should clear all selections', () => {
      const { toggleSelection, clearSelections, selectionMap } = useBetting(mockMatches)

      toggleSelection('1', 'home')
      toggleSelection('2', 'draw')

      expect(selectionMap.value.size).toBe(2)

      clearSelections()

      expect(selectionMap.value.size).toBe(0)
    })
  })
})
