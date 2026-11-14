// Single source of truth for the three account types: labels, colours and
// (in development builds only) the demo sign-in details.
import { Shield, Briefcase, Users } from 'lucide-react'

const dev = (value) => (import.meta.env.DEV ? value : '')

export const ROLE_CATEGORIES = [
  {
    id: 'Administrator',
    label: 'Administrator',
    shortLabel: 'Admin',
    roleTag: 'System & Security Admin',
    desc: 'Full enterprise control, audit logs, and user provisioning.',
    icon: Shield,
    color: 'purple',
    badgeClass: 'bg-purple-100 text-purple-800 border-purple-200',
    btnClass: 'theme-fixed bg-purple-600 hover:bg-purple-700',
    ringClass: 'focus:ring-purple-500/20 focus:border-purple-600',
    avatarClass: 'bg-purple-100 text-purple-700',
    textClass: 'text-purple-700',
    dashboardPath: '/admin',
    dashboardLabel: 'Admin Dashboard',
    selfSignup: false, // admins are created by an existing admin
    demoEmail: dev('admin@reticen8.com'),
    demoPass: dev('AdminPassword123!'),
  },
  {
    id: 'Employee',
    label: 'Employee',
    shortLabel: 'Engineer',
    roleTag: 'Security Engineer',
    desc: 'Internal firewall labs, threat defense curriculum, and sandboxes.',
    icon: Briefcase,
    color: 'emerald',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    btnClass: 'bg-action-600 hover:bg-action-700',
    ringClass: 'focus:ring-brand-600/20 focus:border-brand-600',
    avatarClass: 'bg-emerald-100 text-brand-600',
    textClass: 'text-brand-600',
    dashboardPath: '/employee',
    dashboardLabel: 'Employee Dashboard',
    selfSignup: true,
    signupRoleTitle: 'Security Operations Engineer',
    demoEmail: dev('employee@reticen8.com'),
    demoPass: dev('EmployeePassword123!'),
  },
  {
    id: 'Partner',
    label: 'Partner',
    shortLabel: 'Partner',
    roleTag: 'Authorized Training Partner',
    desc: 'Partner academy portal, seat management, and co-branded credentials.',
    icon: Users,
    color: 'blue',
    badgeClass: 'bg-blue-100 text-blue-800 border-blue-200',
    btnClass: 'theme-fixed bg-blue-600 hover:bg-blue-700',
    ringClass: 'focus:ring-blue-500/20 focus:border-blue-600',
    avatarClass: 'bg-blue-100 text-blue-700',
    textClass: 'text-blue-700',
    dashboardPath: '/partner',
    dashboardLabel: 'Partner Portal',
    selfSignup: true,
    signupRoleTitle: 'Authorized Training Partner',
    // On the sign-up form the Partner box shows only this title
    signupTag: 'Authorized Partner',
    signupTitleOnly: true,
    demoEmail: dev('partner@reticen8.com'),
    demoPass: dev('PartnerPassword123!'),
  },
]

export const DEFAULT_ROLE = 'Employee'

export const getRole = (id) =>
  ROLE_CATEGORIES.find((c) => c.id === id) || ROLE_CATEGORIES.find((c) => c.id === DEFAULT_ROLE)

export const SIGNUP_CATEGORIES = ROLE_CATEGORIES.filter((c) => c.selfSignup)

export const dashboardPathFor = (role) => getRole(role).dashboardPath
