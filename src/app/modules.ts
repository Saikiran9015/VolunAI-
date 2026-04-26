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
          label: 'Tasks',
          description: 'Accept tasks, upload proof, track hours served.',
        },
        {
          id: 'rewards',
          label: 'Rewards',
          description: 'Points, badges, certificates, leaderboards.',
        },
        {
          id: 'verification',
          label: 'Verification',
          description: 'Upload ID/skills, optional police verification.',
        },
        {
          id: 'certification',
          label: 'Certifications',
          description: 'View and download your earned certificates.',
        },
        {
          id: 'training',
          label: 'Training Notifications',
          description: 'Access courses and training materials.',
        },
        // Only specific common modules for volunteer
        ...common.filter(m => m.id === 'blood' || m.id === 'settings')
      ]
    case 'ngo':
      return [
        {
          id: 'requests',
          label: 'Requests',
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
          id: 'verification',
          label: 'NGO Verification',
          description: 'Upload documents for verification (trust building).',
        },
        ...common,
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

