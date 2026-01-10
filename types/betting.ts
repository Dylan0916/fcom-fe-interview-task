export type BetType = 'home' | 'draw' | 'away'
export type BetId = string
export type BetKey = `${BetId}-${BetType}`

export type Match = {
  id: BetId
  homeTeam: string
  awayTeam: string
  odds: Record<BetType, number>
}

export type BetState = {
  isSelected: boolean
  isInConflict: boolean
  hasConflict: boolean
  odds: number
}

export type BetConfig = {
  label: string
  betType: BetType
}
