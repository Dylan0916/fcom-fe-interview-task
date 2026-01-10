import type { BetType } from '@/types/betting'

export function getBettingKey(matchId: string, betType: BetType) {
  return `${matchId}-${betType}`
}
