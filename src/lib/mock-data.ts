import type { User, CheckLog, Schedule, WeeklyReport, HealthLog, Contact } from './types';
import { subDays, addHours, startOfWeek, subHours } from 'date-fns';

const now = new Date();

export const seniorUser: User = {
  id: 'senior1',
  name: '홍길동',
  role: 'senior',
  avatarUrl: 'https://picsum.photos/seed/user-avatar/200/200',
  guardianIds: ['guardian1'],
};

export const guardianUser: User = {
  id: 'guardian1',
  name: '홍진경',
  role: 'guardian',
  avatarUrl: 'https://picsum.photos/seed/guardian-avatar/200/200',
  seniorId: 'senior1',
};

export const emergencyContacts: Contact[] = [
  { id: 'contact1', name: '홍진경', phone: '111-222-3333', relationship: '딸' },
  { id: 'contact2', name: '김 의사', phone: '444-555-6666', relationship: '담당 의사' },
  { id: 'contact3', name: '이웃집 김씨', phone: '777-888-9999', relationship: '이웃' },
  { id: 'contact5', name: '주민 센터', phone: '000-111-2222', relationship: '서비스' },
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
    notes: '홍진경에게 전화함',
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
    notes: 'SOS 알림 발생'
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
    title: '아침 약 복용',
    description: '아토르바스타틴 1정 복용',
    startTime: new Date(now.setHours(8, 0, 0, 0)),
    type: 'medication',
  },
  {
    id: 'sched2',
    seniorId: 'senior1',
    title: '병원 진료',
    description: '김 의사 선생님과 검진',
    startTime: new Date(now.setHours(14, 0, 0, 0)),
    type: 'appointment',
  },
  {
    id: 'sched3',
    seniorId: 'senior1',
    title: '저녁 약 복용',
    description: '리시노프릴 1정 복용',
    startTime: new Date(now.setHours(20, 0, 0, 0)),
    type: 'medication',
  },
  {
    id: 'sched4',
    seniorId: 'senior1',
    title: '진경에게 전화',
    description: '주간 안부 전화',
    startTime: addHours(now, 2),
    type: 'other',
  },
];

export const weeklyReport: WeeklyReport = {
  id: 'report1',
  seniorId: 'senior1',
  weekOf: startOfWeek(now),
  summary:
    '홍길동님은 꾸준한 복약 준수율을 보이며 좋은 한 주를 보냈습니다. 활동 수준은 보통이었습니다. 한 건의 SOS 알림이 있었지만 신속하게 해결되었습니다. 후속 문제에 대한 모니터링이 권장됩니다.',
  medicationAdherence: 85,
  dailyAdherence: [
    { day: '일', adherence: 100 },
    { day: '월', adherence: 50 },
    { day: '화', adherence: 100 },
    { day: '수', adherence: 100 },
    { day: '목', adherence: 50 },
    { day: '금', adherence: 100 },
    { day: '토', adherence: 100 },
  ],
  activityLevel: 'medium',
  sosRequests: 1,
};
