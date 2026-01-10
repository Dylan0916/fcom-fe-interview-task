import type { BetId, BetKey, BetType } from '@/types/betting'

export function getBettingKey(matchId: BetId, betType: BetType): BetKey {
  return `${matchId}-${betType}`
}
