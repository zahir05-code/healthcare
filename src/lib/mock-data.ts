import type { User, CheckLog, Schedule, WeeklyReport, HealthLog, Contact } from './types';
import { subDays, addHours, startOfWeek, subHours } from 'date-fns';

const now = new Date();

export const seniorUser: User = {
  id: 'senior1',
  name: 'John Doe',
  role: 'senior',
  avatarUrl: 'https://picsum.photos/seed/user-avatar/200/200',
  guardianIds: ['guardian1'],
};

export const guardianUser: User = {
  id: 'guardian1',
  name: 'Jane Doe',
  role: 'guardian',
  avatarUrl: 'https://picsum.photos/seed/guardian-avatar/200/200',
  seniorId: 'senior1',
};

export const emergencyContacts: Contact[] = [
  { id: 'contact1', name: 'Jane Doe', phone: '111-222-3333', relationship: 'Daughter' },
  { id: 'contact2', name: 'Dr. Smith', phone: '444-555-6666', relationship: 'Doctor' },
  { id: 'contact3', name: 'Neighbor Joe', phone: '777-888-9999', relationship: 'Neighbor' },
  { id: 'contact4', name: 'Emergency Services', phone: '911', relationship: 'Official' },
  { id: 'contact5', name: 'Community Center', phone: '000-111-2222', relationship: 'Service' },
];

export const checkLogs: CheckLog[] = [
  {
    id: 'log1',
    seniorId: 'senior1',
    timestamp: subDays(now, 1),
    activityType: 'medication',
    status: 'completed',
  },
  {
    id: 'log2',
    seniorId: 'senior1',
    timestamp: subDays(now, 1),
    activityType: 'call',
    status: 'completed',
    notes: 'Called Jane Doe',
  },
  {
    id: 'log3',
    seniorId: 'senior1',
    timestamp: new Date(),
    activityType: 'medication',
    status: 'completed',
  },
    {
    id: 'log4',
    seniorId: 'senior1',
    timestamp: subDays(now, 2),
    activityType: 'medication',
    status: 'missed',
  },
    {
    id: 'log5',
    seniorId: 'senior1',
    timestamp: subDays(now, 3),
    activityType: 'sos',
    status: 'completed',
    notes: 'SOS alert triggered'
  },
];

export const healthLogs: HealthLog[] = [
    {
        id: 'hlog1',
        seniorId: 'senior1',
        timestamp: subHours(now, 8),
        bloodPressureSystolic: 122,
        bloodPressureDiastolic: 81,
        bloodSugar: 95,
    },
    {
        id: 'hlog2',
        seniorId: 'senior1',
        timestamp: subDays(now, 1),
        bloodPressureSystolic: 125,
        bloodPressureDiastolic: 83,
        bloodSugar: 105,
    },
    {
        id: 'hlog3',
        seniorId: 'senior1',
        timestamp: subDays(now, 2),
        bloodPressureSystolic: 119,
        bloodPressureDiastolic: 78,
        bloodSugar: 92,
    },
    {
        id: 'hlog4',
        seniorId: 'senior1',
        timestamp: subDays(now, 3),
        bloodPressureSystolic: 130,
        bloodPressureDiastolic: 85,
        bloodSugar: 110,
    }
];

export const schedules: Schedule[] = [
  {
    id: 'sched1',
    seniorId: 'senior1',
    title: 'Morning Medication',
    description: 'Take 1 pill of Atorvastatin',
    startTime: new Date(now.setHours(8, 0, 0, 0)),
    type: 'medication',
  },
  {
    id: 'sched2',
    seniorId: 'senior1',
    title: "Doctor's Appointment",
    description: 'Check-up with Dr. Smith',
    startTime: new Date(now.setHours(14, 0, 0, 0)),
    type: 'appointment',
  },
  {
    id: 'sched3',
    seniorId: 'senior1',
    title: 'Evening Medication',
    description: 'Take 1 pill of Lisinopril',
    startTime: new Date(now.setHours(20, 0, 0, 0)),
    type: 'medication',
  },
  {
    id: 'sched4',
    seniorId: 'senior1',
    title: 'Call Jane',
    description: 'Weekly catch-up call',
    startTime: addHours(now, 2),
    type: 'other',
  },
];

export const weeklyReport: WeeklyReport = {
  id: 'report1',
  seniorId: 'senior1',
  weekOf: startOfWeek(now),
  summary:
    'John had a good week with consistent medication adherence. Activity levels were normal. One SOS alert was triggered but resolved quickly. It is recommended to monitor for any follow-up issues.',
  medicationAdherence: 85,
  activityLevel: 'medium',
  sosRequests: 1,
};
