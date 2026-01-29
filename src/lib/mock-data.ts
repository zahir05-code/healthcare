import type { User, CheckLog, Schedule, WeeklyReport } from './types';
import { subDays, addHours, startOfWeek } from 'date-fns';

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
