import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { usePageTitle } from './usePageTitle'

function Page({ title }) {
  usePageTitle(title)
  return null
}

describe('usePageTitle', () => {
  it('sets a titled document title', () => {
    render(<Page title="Sign In" />)
    expect(document.title).toBe('Sign In · Reticen8 Academy')
  })

  it('uses the base title when given null', () => {
    render(<Page title={null} />)
    expect(document.title).toContain('Reticen8 Academy')
    expect(document.title).not.toContain('·')
  })

  it('leaves the title untouched when given false', () => {
    document.title = 'Existing Title'
    render(<Page title={false} />)
    expect(document.title).toBe('Existing Title')
  })
})
