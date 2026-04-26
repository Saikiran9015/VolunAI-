export type UserRole = 'donor' | 'volunteer' | 'ngo' | 'admin'

export const USER_ROLES: Array<{ role: UserRole; label: string }> = [
  { role: 'donor', label: 'Donor' },
  { role: 'volunteer', label: 'Volunteer' },
  { role: 'ngo', label: 'NGO Admin' },
]

