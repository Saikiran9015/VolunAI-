import type { UserRole } from './roles'

export type AppModule =
  | 'donate'
  | 'donation-tracking'
  | 'item-pickup'
  | 'volunteer-tasks'
  | 'rewards'
  | 'emergency-alerts'
  | 'nearby-ngos'
  | 'inventory'
  | 'impact-reports'
  | 'verification'
  | 'requests'
  | 'blood'
  | 'fraud'
  | 'settings'
  | 'training'
  | 'certification'
  | 'wallet'
  | 'fund-causes'
  | 'donate-clothes'
  | 'my-donations'

export type ModuleLink = {
  id: AppModule
  label: string
  description: string
}

const common: ModuleLink[] = [
  {
    id: 'emergency-alerts',
    label: 'Emergency Alerts',
    description: 'Broadcast urgent needs to nearby volunteers/donors.',
  },
  {
    id: 'nearby-ngos',
    label: 'Nearby NGO Finder',
    description: 'Find NGOs, shelters, food centers via map/GPS.',
  },
  {
    id: 'blood',
    label: 'Blood Donation',
    description: 'Request blood & notify matching donors nearby.',
  },
  {
    id: 'settings',
    label: 'Settings',
    description: 'Profile, language, notification preferences.',
  },
]

export function modulesForRole(role: UserRole): ModuleLink[] {
  switch (role) {
    case 'donor':
      return [
        {
          id: 'wallet',
          label: 'Add Money / Wallet',
          description: 'Add funds securely for instant donations.',
        },
        {
          id: 'fund-causes',
          label: 'Fund Causes',
          description: 'Donate to education, medical, disaster relief, food, orphan care.',
        },
        {
          id: 'donate-clothes',
          label: 'Donate Clothes',
          description: 'Request pickup or drop-off for clothes, blankets, essentials.',
        },
        {
          id: 'blood',
          label: 'Blood Donation',
          description: 'Register as donor, emergency requests, nearby camps.',
        },
        {
          id: 'verification',
          label: 'KYC Verification',
          description: 'Verify identity for secure donations & tax receipts.',
        },
        {
          id: 'my-donations',
          label: 'My Donations',
          description: 'Donation history, receipts, status tracking.',
        },
        ...common.filter(m => m.id === 'settings')
      ]
    case 'volunteer':
      return [
        {
          id: 'volunteer-tasks',
          label: 'Volunteer Tasks',
          description: 'Accept tasks, upload proof, track hours served.',
        },
        {
          id: 'attendance',
          label: 'Attendance',
          description: 'Check-in/out of volunteer sessions and track hours.',
        },
        {
          id: 'rewards',
          label: 'Rewards & Badges',
          description: 'Points, badges, certificates, leaderboards.',
        },
        {
          id: 'certification',
          label: 'Teaching Certification',
          description: 'Earn and download your teaching and skill certificates.',
        },
        {
          id: 'training',
          label: 'Training Modules',
          description: 'Access courses and training materials.',
        },
        {
          id: 'verification',
          label: 'Verification',
          description: 'Upload ID/skills, optional police verification.',
        },
        // Only specific common modules for volunteer
        ...common.filter(m => m.id === 'blood' || m.id === 'settings')
      ]
    case 'ngo':
      return [
        {
          id: 'requests',
          label: 'Help Requests',
          description: 'Manage help requests and assign volunteers.',
        },
        {
          id: 'inventory',
          label: 'Inventory',
          description: 'Track stock of essentials with low-stock alerts.',
        },
        {
          id: 'impact-reports',
          label: 'Impact Reports',
          description: 'Families helped, meals served, volunteer hours.',
        },
        {
          id: 'emergency-alerts',
          label: 'Emergency Alerts',
          description: 'Broadcast and manage emergency notifications.',
        },
        {
          id: 'nearby-ngos',
          label: 'Nearby NGO Finder',
          description: 'Connect with other NGOs for resource sharing.',
        },
        {
          id: 'blood',
          label: 'Blood Donation',
          description: 'Manage blood donation drives and requests.',
        },
        {
          id: 'verification',
          label: 'NGO Verification',
          description: 'Upload documents for verification (trust building).',
        },
        {
          id: 'settings',
          label: 'Settings',
          description: 'Configure your NGO profile and preferences.',
        },
      ]
    case 'admin':
      return [
        {
          id: 'verification',
          label: 'Verifications',
          description: 'Verify NGOs and volunteers, audit documents.',
        },
        {
          id: 'fraud',
          label: 'Fraud Detection',
          description: 'Detect suspicious requests, spam, duplicate activity.',
        },
        {
          id: 'impact-reports',
          label: 'Platform Analytics',
          description: 'Live stats, alerts, operational dashboards.',
        },
        ...common,
      ]
    default:
      return common
  }
}

