import { render, screen } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'

import MatchCard, { type Props } from '@/components/q6/MatchCard.vue'
import type { Match, BetState, BetType } from '@/types/betting'

describe('MatchCard', () => {
  const mockMatch: Match = {
    id: '1',
    homeTeam: 'Team A',
    awayTeam: 'Team B',
    odds: {
      home: 1.25,
      draw: 10.0,
      away: 3.75,
    },
  }

  function createRenderer(testProps: Partial<Props> & { onOddsClick?: (betType: BetType) => void } = {}) {
    const props = {
      match: mockMatch,
      betStates: createBetStates(),
      ...testProps,
    }

    return render(MatchCard, { props })
  }

  function createBetStates(betState: Partial<BetState> = {}) {
    const states = new Map<string, BetState>()
    const defaultState: BetState = {
      isSelected: false,
      isInConflict: false,
      hasConflict: false,
      odds: 1.0,
      ...betState,
    }

    states.set('1-home', { ...defaultState, odds: 1.25 })
    states.set('1-draw', { ...defaultState, odds: 10.0 })
    states.set('1-away', { ...defaultState, odds: 3.75 })

    return states
  }

  it('should render match teams', () => {
    createRenderer()

    expect(screen.getByText('Team A vs Team B')).toBeInTheDocument()
  })

  it('should render all bet options', () => {
    createRenderer()

    expect(screen.getByText('Home: 1.25')).toBeInTheDocument()
    expect(screen.getByText('Draw: 10')).toBeInTheDocument()
    expect(screen.getByText('Away: 3.75')).toBeInTheDocument()
  })

  it('should pass selected state to buttons', () => {
    const betStates = createBetStates({ isSelected: true })

    betStates.set('1-home', { isSelected: true, isInConflict: false, hasConflict: false, odds: 1.25 })

    createRenderer({ betStates })

    const buttons = screen.getAllByRole('button')
    const homeButton = buttons.find(btn => btn.textContent?.includes('Home'))

    expect(homeButton?.className).not.toContain('bg-gray-300')
    expect(homeButton?.className).toContain('bg-green-500')
    expect(homeButton?.className).not.toContain('bg-red-400')
  })

  it('should pass conflict state to buttons', () => {
    const betStates = createBetStates({ isSelected: true, isInConflict: true, hasConflict: true })

    betStates.set('1-home', { isSelected: true, isInConflict: true, hasConflict: true, odds: 1.25 })

    createRenderer({ betStates })

    const buttons = screen.getAllByRole('button')
    const homeButton = buttons.find(btn => btn.textContent?.includes('Home'))

    expect(homeButton?.className).not.toContain('bg-gray-300')
    expect(homeButton?.className).not.toContain('bg-green-500')
    expect(homeButton?.className).toContain('bg-red-400')
  })

  it('should emit oddsClick event', async () => {
    const onOddsClick = vi.fn()

    createRenderer({ onOddsClick })

    const homeButton = screen.getByText('Home: 1.25')

    expect(onOddsClick).not.toHaveBeenCalled()

    await userEvent.click(homeButton)

    expect(onOddsClick).toHaveBeenCalledWith('home')
  })
})
