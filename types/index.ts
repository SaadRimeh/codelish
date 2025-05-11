export interface Course {
  id: string;
  name: string;
}

export interface Group {
  id: string;
  name: string;
  courseId: string;
  appointmentDay: string;
  appointmentTime: string;
}

export interface AttendanceRecord {
  date: string; // ISO date string YYYY-MM-DD
  present: boolean;
}

export interface Student {
  id: string;
  name: string;
  phone: string;
  grade?: string;
  courseId: string;
  groupId: string;
  attendance?: AttendanceRecord[];
}