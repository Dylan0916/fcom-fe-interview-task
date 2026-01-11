import { render, screen } from '@testing-library/vue'

import SelectedOdds, { type Props } from '@/components/q6/SelectedOdds.vue'

describe('SelectedOdds', () => {
  function createRenderer(props: Props) {
    return render(SelectedOdds, { props })
  }

  it('should display single odds when min equals max', () => {
    createRenderer({
      minOdds: 3.28125,
      maxOdds: 3.28125,
    })

    expect(screen.getByText('3.28125')).toBeInTheDocument()
  })

  it('should display odds range when min does not equal max', () => {
    createRenderer({
      minOdds: 2.1875,
      maxOdds: 6.5625,
    })

    expect(screen.getByText('2.1875~6.5625')).toBeInTheDocument()
  })

  it('should handle zero odds', () => {
    createRenderer({
      minOdds: 0,
      maxOdds: 0,
    })

    expect(screen.getByText('0')).toBeInTheDocument()
  })

  it('should handle very large odds', () => {
    createRenderer({
      minOdds: 1000.5,
      maxOdds: 2000.75,
    })

    expect(screen.getByText('1000.5~2000.75')).toBeInTheDocument()
  })
})
