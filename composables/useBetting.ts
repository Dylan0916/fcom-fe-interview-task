import type { Match, Selection, BetState, BetType } from '@/types/betting'
import { BET_TYPES } from '@/constants/betting'
import { getBettingKey } from '@/utils/betting'

export function useBetting(matches: Match[]) {
  const selections = ref<Selection[]>([])

  const betStates = computed<Map<string, BetState>>(() => {
    const states = new Map<string, BetState>()
    // 先計算每個 match 的選擇數量（用於判斷是否有衝突）
    const matchSelectionCounts = new Map<string, number>()
    const selectedKeys = new Set<string>()

    selections.value.forEach(selection => {
      const count = matchSelectionCounts.get(selection.matchId) || 0

      matchSelectionCounts.set(selection.matchId, count + 1)
      selectedKeys.add(getBettingKey(selection.matchId, selection.betType))
    })

    matches.forEach(match => {
      const selectionCount = matchSelectionCounts.get(match.id) || 0
      const hasConflict = selectionCount > 1

      BET_TYPES.forEach(betType => {
        const key = getBettingKey(match.id, betType)
        const isSelected = selectedKeys.has(key)
        const isInConflict = hasConflict && isSelected

        states.set(key, {
          isSelected,
          isInConflict,
          hasConflict,
          odds: match.odds[betType],
        })
      })
    })

    return states
  })

  function toggleSelection(matchId: string, betType: BetType) {
    const existingIndex = selections.value.findIndex(s => s.matchId === matchId && s.betType === betType)

    if (existingIndex >= 0) {
      selections.value.splice(existingIndex, 1)
    } else {
      selections.value.push({ matchId, betType })
    }
  }

  function groupSelectionsByMatch() {
    const states = betStates.value
    const selectionsByMatchId = new Map<string, BetState[]>()
    let hasAnyConflict = false

    matches.forEach(match => {
      const matchSelections: BetState[] = []

      BET_TYPES.forEach(betType => {
        const key = getBettingKey(match.id, betType)
        const betState = states.get(key)

        if (betState?.isSelected) {
          matchSelections.push(betState)

          if (betState.hasConflict) {
            hasAnyConflict = true
          }
        }
      })

      if (matchSelections.length > 0) {
        selectionsByMatchId.set(match.id, matchSelections)
      }
    })

    return { selectionsByMatchId, hasAnyConflict }
  }

  function calculateOddsWithConflict(selectionsByMatchId: Map<string, BetState[]>) {
    let minOdds = 1
    let maxOdds = 1

    selectionsByMatchId.forEach(betStates => {
      if (betStates.length === 1) {
        const [firstState] = betStates

        if (firstState) {
          minOdds *= firstState.odds
          maxOdds *= firstState.odds
        }
      } else {
        const odds = betStates.map(state => state.odds)

        minOdds *= Math.min(...odds)
        maxOdds *= Math.max(...odds)
      }
    })

    return { min: minOdds, max: maxOdds }
  }

  function calculateOddsWithoutConflict(selectionsByMatchId: Map<string, BetState[]>) {
    return Array.from(selectionsByMatchId.values())
      .flat()
      .reduce((acc, state) => acc * state.odds, 1)
  }

  function calculateTotalOdds() {
    const { selectionsByMatchId, hasAnyConflict } = groupSelectionsByMatch()

    if (selectionsByMatchId.size === 0) {
      return { min: 1, max: 1 }
    }

    if (hasAnyConflict) {
      const { min, max } = calculateOddsWithConflict(selectionsByMatchId)

      return { min, max }
    }

    const total = calculateOddsWithoutConflict(selectionsByMatchId)

    return { min: total, max: total }
  }

  function clearSelections() {
    selections.value = []
  }

  return {
    selections: readonly(selections),
    betStates: readonly(betStates),
    toggleSelection,
    calculateTotalOdds,
    clearSelections,
  }
}
