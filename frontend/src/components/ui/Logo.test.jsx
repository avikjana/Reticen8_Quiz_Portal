import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Logo from './Logo'

const renderLogo = (props) =>
  render(
    <MemoryRouter>
      <Logo {...props} />
    </MemoryRouter>
  )

describe('Logo', () => {
  it('renders the wordmark image and the Academy label', () => {
    renderLogo()
    expect(screen.getByAltText('Reticen8')).toBeInTheDocument()
    expect(screen.getByText('Academy')).toBeInTheDocument()
  })

  it('links to the home page when used as a link', () => {
    renderLogo()
    expect(screen.getByRole('link', { name: /Reticen8 Academy home/i })).toHaveAttribute('href', '/')
  })

  it('can hide the label and render as a non-link', () => {
    renderLogo({ asLink: false, label: null })
    expect(screen.queryByText('Academy')).not.toBeInTheDocument()
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })
})
