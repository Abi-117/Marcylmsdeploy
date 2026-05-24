export type Role = "admin" | "teacher" | "student";
export type Level = "Foundation" | "Intermediate" | "Advanced";
export type ClassStatus = "Upcoming" | "Live" | "Completed";
export type Platform = "Google Meet" | "Zoom" | "Offline";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  course?: string;
  level?: Level;
  batch?: string;
  joined?: string;
}

export interface Course {
  id: string;
  name: string;
  slug: string;
  category: "Music" | "Speech";
  icon: string;
  description: string;
  levels: Level[];
  fee: number;
  students: number;
  teachers: string[];
  image?: string;
}

export interface Batch {
  id: string;
  name: string;
  course: string;
  teacher: string;
  level: Level;
  schedule: string;
  capacity: number;
  enrolled: number;
  waiting: number;
  mode: "Online" | "Offline" | "Hybrid";
}

export interface ClassSession {
  id: string;
  title: string;
  batchId: string;
  batchName: string;
  teacher: string;
  course: string;
  date: string; // ISO
  duration: number; // min
  platform: Platform;
  meetingLink?: string;
  status: ClassStatus;
  notes?: string;
  assignment?: string;
  recordingUrl?: string;
}

export interface Payment {
  id: string;
  studentId: string;
  studentName: string;
  level: Level;
  amount: number;
  status: "Paid" | "Pending" | "Overdue";
  date: string;
  invoice: string;
}

export interface PracticeLog {
  id: string;
  date: string;
  minutes: number;
  course: string;
  notes?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "class" | "homework" | "fee" | "event" | "attendance";
  time: string;
  read: boolean;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  venue: string;
  description: string;
  image?: string;
  spots: number;
  registered: number;
}
