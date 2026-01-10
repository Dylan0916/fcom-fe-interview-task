import type { BetConfig, BetType } from '@/types/betting'

export const BET_CONFIGS: BetConfig[] = [
  { label: 'Home', betType: 'home' },
  { label: 'Draw', betType: 'draw' },
  { label: 'Away', betType: 'away' },
]

export const BET_TYPES: BetType[] = BET_CONFIGS.map(config => config.betType)
