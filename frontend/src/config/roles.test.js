import { describe, it, expect } from 'vitest'
import { ROLE_CATEGORIES, SIGNUP_CATEGORIES, getRole, dashboardPathFor, DEFAULT_ROLE } from './roles'

describe('roles config', () => {
  it('defines the three roles', () => {
    expect(ROLE_CATEGORIES.map((r) => r.id)).toEqual(['Administrator', 'Employee', 'Partner'])
  })

  it('does not let visitors sign up as Administrator', () => {
    expect(SIGNUP_CATEGORIES.map((r) => r.id)).toEqual(['Employee', 'Partner'])
  })

  it('maps each role to its dashboard', () => {
    expect(dashboardPathFor('Administrator')).toBe('/admin')
    expect(dashboardPathFor('Employee')).toBe('/employee')
    expect(dashboardPathFor('Partner')).toBe('/partner')
  })

  it('falls back to the default role for unknown input', () => {
    expect(getRole('Nonsense').id).toBe(DEFAULT_ROLE)
    expect(dashboardPathFor(undefined)).toBe('/employee')
  })
})
