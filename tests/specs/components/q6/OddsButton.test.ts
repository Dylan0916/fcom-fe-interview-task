import { render, screen } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'

import OddsButton, { type Props } from '@/components/q6/OddsButton.vue'

describe('OddsButton', () => {
  function createRenderer(testProps: Partial<Props> = {}) {
    const props = {
      label: 'Home',
      odds: 1.25,
      isSelected: false,
      isInConflict: false,
      ...testProps,
    }

    return render(OddsButton, { props })
  }

  it('should render label and odds', () => {
    createRenderer()

    expect(screen.getByText('Home: 1.25')).toBeInTheDocument()
  })

  it('should apply gray background when not selected', () => {
    createRenderer()

    const button = screen.getByText('Home: 1.25')

    expect(button.className).toContain('bg-gray-300')
    expect(button.className).not.toContain('bg-green-500')
    expect(button.className).not.toContain('bg-red-400')
  })

  it('should apply green background when selected', () => {
    createRenderer({ isSelected: true })

    const button = screen.getByText('Home: 1.25')

    expect(button.className).not.toContain('bg-gray-300')
    expect(button.className).toContain('bg-green-500')
    expect(button.className).not.toContain('bg-red-400')
  })

  it('should apply red background when in conflict', () => {
    createRenderer({ isSelected: true, isInConflict: true })

    const button = screen.getByText('Home: 1.25')

    expect(button.className).not.toContain('bg-gray-300')
    expect(button.className).not.toContain('bg-green-500')
    expect(button.className).toContain('bg-red-400')
  })
})
