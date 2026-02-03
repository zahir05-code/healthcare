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

export interface HealthLog {
  id: string;
  seniorId: string;
  timestamp: Date;
  bloodPressureSystolic: number;
  bloodPressureDiastolic: number;
  bloodSugar: number;
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
  dailyAdherence: { day: string; adherence: number }[];
  activityLevel: 'low' | 'medium' | 'high';
  sosRequests: number;
}

export interface Contact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
}

export interface NotificationSettings {
  vitals: {
    enabled: boolean;
    time: string; // "HH:mm"
  };
  medication: {
    enabled: boolean;
    time: string; // "HH:mm"
  };
}
