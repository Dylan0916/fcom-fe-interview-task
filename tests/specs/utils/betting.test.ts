import { getBettingKey } from '@/utils/betting'

describe('betting utils', () => {
  describe('getBettingKey', () => {
    const testList = [
      {
        matchId: '1',
        betType: 'home' as const,
        expected: '1-home',
      },
      {
        matchId: '2',
        betType: 'draw' as const,
        expected: '2-draw',
      },
      {
        matchId: 'match-123',
        betType: 'home' as const,
        expected: 'match-123-home',
      },
      {
        matchId: 'abc',
        betType: 'draw' as const,
        expected: 'abc-draw',
      },
    ]

    it.each(testList)('should generate correct key for matchId $matchId and betType $betType', ({ matchId, betType, expected }) => {
      expect(getBettingKey(matchId, betType)).toBe(expected)
    })
  })
})
