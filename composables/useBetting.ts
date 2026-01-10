import type { Match, BetState, BetType, BetId, BetKey } from '@/types/betting'
import { BET_TYPES } from '@/constants/betting'
import { getBettingKey } from '@/utils/betting'

export function useBetting(matches: MaybeRef<Match[]>) {
  const selectionMap = ref(new Map<BetId, Set<BetType>>())

  const matchesRef = computed(() => unref(matches))
  const matchMap = computed(() => new Map(matchesRef.value.map(match => [match.id, match])))
  const betStates = computed(() => {
    const states = new Map<BetKey, BetState>()

    matchesRef.value.forEach(match => {
      const selectedTypes = selectionMap.value.get(match.id)
      const selectionCount = selectedTypes?.size || 0
      const hasConflict = selectionCount > 1

      BET_TYPES.forEach(betType => {
        const key = getBettingKey(match.id, betType)
        const isSelected = selectedTypes?.has(betType) || false

        states.set(key, {
          isSelected,
          isInConflict: hasConflict && isSelected,
          hasConflict,
          odds: match.odds[betType],
        })
      })
    })

    return states
  })
  const totalOdds = computed(() => {
    if (selectionMap.value.size === 0) {
      return { min: 1, max: 1 }
    }

    let minTotal = 1
    let maxTotal = 1

    selectionMap.value.forEach((selectedTypes, matchId) => {
      const match = matchMap.value.get(matchId)

      if (!match) {
        return
      }

      const currentOdds = [...selectedTypes].map(betType => match.odds[betType])

      if (selectedTypes.size === 1) {
        const [firstOdds] = currentOdds

        minTotal *= firstOdds!
        maxTotal *= firstOdds!
      } else {
        minTotal *= Math.min(...currentOdds)
        maxTotal *= Math.max(...currentOdds)
      }
    })

    return { min: minTotal, max: maxTotal }
  })

  function toggleSelection(matchId: string, betType: BetType) {
    const selectedTypes = selectionMap.value.get(matchId)

    if (!selectedTypes) {
      selectionMap.value.set(matchId, new Set([betType]))
      return
    }

    if (selectedTypes.has(betType)) {
      selectedTypes.delete(betType)
      if (selectedTypes.size === 0) {
        selectionMap.value.delete(matchId)
      }
    } else {
      selectedTypes.add(betType)
    }
  }

  function clearSelections() {
    selectionMap.value = new Map()
  }

  return {
    selectionMap: readonly(selectionMap),
    betStates,
    totalOdds,
    toggleSelection,
    clearSelections,
  }
}
