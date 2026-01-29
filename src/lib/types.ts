export interface User {
  id: string;
  name: string;
  role: 'senior' | 'guardian';
  avatarUrl: string;
  seniorId?: string; // For guardians
  guardianIds?: string[]; // For seniors
}

export interface CheckLog {
  id: string;
  seniorId: string;
  timestamp: Date;
  activityType: 'medication' | 'call' | 'schedule_view' | 'sos';
  status: 'completed' | 'missed' | 'delayed';
  notes?: string;
}

export interface Schedule {
  id: string;
  seniorId: string;
  title: string;
  description: string;
  startTime: Date;
  type: 'medication' | 'appointment' | 'other';
}

export interface WeeklyReport {
  id: string;
  seniorId: string;
  weekOf: Date;
  summary: string;
  medicationAdherence: number;
  activityLevel: 'low' | 'medium' | 'high';
  sosRequests: number;
}
