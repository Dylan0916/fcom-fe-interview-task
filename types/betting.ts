export type BetType = 'home' | 'draw' | 'away'

export type Match = {
  id: string
  homeTeam: string
  awayTeam: string
  odds: Record<BetType, number>
}

export type Selection = {
  matchId: string
  betType: BetType
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
