import { Shield, Briefcase, Users } from 'lucide-react'

export const ROLE_CATEGORIES = [
  {
    id: 'Administrator',
    label: 'Administrator',
    shortLabel: 'Admin',
    roleTag: 'Administrator',
    desc: '',
    icon: Shield,
    color: 'purple',
    badgeClass: 'bg-purple-100 text-purple-800 border-purple-200',
    btnClass: 'bg-[#4b6cf7] hover:bg-[#3b5ce6]',
    ringClass: 'focus:ring-purple-500/20 focus:border-purple-600',
    avatarClass: 'bg-purple-100 text-purple-700',
    textClass: 'text-purple-700',
    dashboardPath: '/admin',
    dashboardLabel: 'Admin Dashboard',
    selfSignup: false,
  },
  {
    id: 'Customer',
    label: 'Customer',
    shortLabel: 'Customer',
    roleTag: 'Customer',
    desc: '',
    icon: Briefcase,
    color: 'blue',
    badgeClass: 'bg-blue-100 text-blue-800 border-blue-200',
    btnClass: 'bg-[#4b6cf7] hover:bg-[#3b5ce6]',
    ringClass: 'focus:ring-[#4b6cf7]/20 focus:border-[#4b6cf7]',
    avatarClass: 'bg-blue-100 text-[#4b6cf7]',
    textClass: 'text-[#4b6cf7]',
    dashboardPath: '/customer',
    dashboardLabel: 'Customer Dashboard',
    selfSignup: true,
    signupRoleTitle: 'Customer',
  },
  {
    id: 'Partner',
    label: 'Partner',
    shortLabel: 'Partner',
    roleTag: 'Partner',
    desc: '',
    icon: Users,
    color: 'blue',
    badgeClass: 'bg-blue-100 text-blue-800 border-blue-200',
    btnClass: 'bg-[#4b6cf7] hover:bg-[#3b5ce6]',
    ringClass: 'focus:ring-blue-500/20 focus:border-blue-600',
    avatarClass: 'bg-blue-100 text-blue-700',
    textClass: 'text-blue-700',
    dashboardPath: '/partner',
    dashboardLabel: 'Partner Portal',
    selfSignup: true,
    signupRoleTitle: 'Partner',
    signupTag: 'Partner',
    signupTitleOnly: true,
  },
]

export const DEFAULT_ROLE = 'Customer'

export const getRole = (id) =>
  ROLE_CATEGORIES.find((c) => c.id === id) || ROLE_CATEGORIES.find((c) => c.id === DEFAULT_ROLE)

export const SIGNUP_CATEGORIES = ROLE_CATEGORIES.filter((c) => c.selfSignup)

export const dashboardPathFor = (role) => getRole(role).dashboardPath
