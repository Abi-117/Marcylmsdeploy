import type { Course, Batch, ClassSession, Payment, Notification, Event, User, PracticeLog } from "@/types";

export const courses: Course[] = [
  { id: "c1", name: "Piano", slug: "piano", category: "Music", icon: "🎹", description: "Classical and contemporary piano with Trinity grade pathway.", levels: ["Foundation","Intermediate","Advanced"], fee: 4500, students: 142, teachers: ["Ananya Rao","Vikram Singh"] },
  { id: "c2", name: "Guitar", slug: "guitar", category: "Music", icon: "🎸", description: "Acoustic, electric and fingerstyle from basics to performance.", levels: ["Foundation","Intermediate","Advanced"], fee: 4000, students: 198, teachers: ["Rohan Mehta"] },
  { id: "c3", name: "Violin", slug: "violin", category: "Music", icon: "🎻", description: "Western classical violin technique and orchestral repertoire.", levels: ["Foundation","Intermediate","Advanced"], fee: 5000, students: 76, teachers: ["Priya Iyer"] },
  { id: "c4", name: "Keyboard", slug: "keyboard", category: "Music", icon: "🎛️", description: "Modern keyboard playing, chords, and live performance.", levels: ["Foundation","Intermediate","Advanced"], fee: 3800, students: 110, teachers: ["Karan Verma"] },
  { id: "c5", name: "Vocal", slug: "vocal", category: "Music", icon: "🎤", description: "Voice training, breath control, and stage performance.", levels: ["Foundation","Intermediate","Advanced"], fee: 4200, students: 165, teachers: ["Meera Kapoor","Ananya Rao"] },
  { id: "c6", name: "Drums", slug: "drums", category: "Music", icon: "🥁", description: "Rhythm, grooves, fills and full-kit performance.", levels: ["Foundation","Intermediate","Advanced"], fee: 4500, students: 84, teachers: ["Arjun Nair"] },
  { id: "c7", name: "Public Speaking", slug: "public-speaking", category: "Speech", icon: "🎙️", description: "Confidence, articulation, persuasion and presentation skills.", levels: ["Foundation","Intermediate","Advanced"], fee: 3500, students: 220, teachers: ["Dr. Neha Sharma"] },
  { id: "c8", name: "Western Music", slug: "western-music", category: "Music", icon: "🎼", description: "Theory, ear training, and ensemble musicianship.", levels: ["Foundation","Intermediate","Advanced"], fee: 4800, students: 92, teachers: ["Vikram Singh"] },
  { id: "c9", name: "Trinity Grade", slug: "trinity-grade", category: "Music", icon: "🏆", description: "Official Trinity College London grade examination preparation.", levels: ["Foundation","Intermediate","Advanced"], fee: 6500, students: 58, teachers: ["Priya Iyer","Ananya Rao"] },
];

export const batches: Batch[] = [
  { id: "b1", name: "Piano · Morning A", course: "Piano", teacher: "Ananya Rao", level: "Foundation", schedule: "Mon, Wed, Fri · 8:00 AM", capacity: 12, enrolled: 10, waiting: 2, mode: "Hybrid" },
  { id: "b2", name: "Guitar · Evening B", course: "Guitar", teacher: "Rohan Mehta", level: "Intermediate", schedule: "Tue, Thu · 6:00 PM", capacity: 15, enrolled: 14, waiting: 5, mode: "Online" },
  { id: "b3", name: "Vocal · Weekend Pro", course: "Vocal", teacher: "Meera Kapoor", level: "Advanced", schedule: "Sat, Sun · 10:00 AM", capacity: 10, enrolled: 8, waiting: 0, mode: "Offline" },
  { id: "b4", name: "Speech · Confidence", course: "Public Speaking", teacher: "Dr. Neha Sharma", level: "Foundation", schedule: "Mon, Wed · 5:00 PM", capacity: 20, enrolled: 18, waiting: 4, mode: "Online" },
  { id: "b5", name: "Violin · Trinity Track", course: "Violin", teacher: "Priya Iyer", level: "Intermediate", schedule: "Tue, Fri · 4:00 PM", capacity: 8, enrolled: 7, waiting: 1, mode: "Hybrid" },
  { id: "b6", name: "Drums · Beat Lab", course: "Drums", teacher: "Arjun Nair", level: "Foundation", schedule: "Thu, Sat · 7:00 PM", capacity: 10, enrolled: 6, waiting: 0, mode: "Offline" },
];

const today = new Date();
const offsetDate = (days: number, hour = 18) => {
  const d = new Date(today);
  d.setDate(d.getDate() + days);
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
};

export const classes: ClassSession[] = [
  { id: "cl1", title: "Scales & Arpeggios", batchId: "b1", batchName: "Piano · Morning A", teacher: "Ananya Rao", course: "Piano", date: offsetDate(0, 8), duration: 60, platform: "Google Meet", meetingLink: "https://meet.google.com/abc-defg-hij", status: "Live", notes: "Warm up with C major scale." },
  { id: "cl2", title: "Chord Progressions", batchId: "b2", batchName: "Guitar · Evening B", teacher: "Rohan Mehta", course: "Guitar", date: offsetDate(0, 18), duration: 60, platform: "Zoom", meetingLink: "https://zoom.us/j/123456789", status: "Upcoming" },
  { id: "cl3", title: "Voice Modulation", batchId: "b4", batchName: "Speech · Confidence", teacher: "Dr. Neha Sharma", course: "Public Speaking", date: offsetDate(1, 17), duration: 45, platform: "Google Meet", meetingLink: "https://meet.google.com/xyz-pqrs-tuv", status: "Upcoming" },
  { id: "cl4", title: "Vibrato Technique", batchId: "b5", batchName: "Violin · Trinity Track", teacher: "Priya Iyer", course: "Violin", date: offsetDate(2, 16), duration: 60, platform: "Zoom", meetingLink: "https://zoom.us/j/987654321", status: "Upcoming" },
  { id: "cl5", title: "Recital Prep", batchId: "b3", batchName: "Vocal · Weekend Pro", teacher: "Meera Kapoor", course: "Vocal", date: offsetDate(-1, 10), duration: 90, platform: "Offline", status: "Completed", notes: "Worked on stage presence.", assignment: "Record warm-up routine", recordingUrl: "#" },
  { id: "cl6", title: "Beat Patterns", batchId: "b6", batchName: "Drums · Beat Lab", teacher: "Arjun Nair", course: "Drums", date: offsetDate(-2, 19), duration: 60, platform: "Offline", status: "Completed", assignment: "Practice 4/4 patterns 30 min/day" },
  { id: "cl7", title: "Sight Reading", batchId: "b1", batchName: "Piano · Morning A", teacher: "Ananya Rao", course: "Piano", date: offsetDate(3, 8), duration: 60, platform: "Google Meet", meetingLink: "https://meet.google.com/abc-defg-hij", status: "Upcoming" },
];

export const payments: Payment[] = [
  { id: "p1", studentId: "u1", studentName: "Aarav Patel", level: "Foundation", amount: 4500, status: "Paid", date: "2025-04-10", invoice: "INV-2025-0421" },
  { id: "p2", studentId: "u1", studentName: "Aarav Patel", level: "Intermediate", amount: 5500, status: "Pending", date: "2025-05-12", invoice: "INV-2025-0508" },
  { id: "p3", studentId: "u2", studentName: "Ishita Sen", level: "Foundation", amount: 4200, status: "Paid", date: "2025-03-22", invoice: "INV-2025-0312" },
  { id: "p4", studentId: "u3", studentName: "Kabir Khan", level: "Foundation", amount: 3500, status: "Overdue", date: "2025-04-30", invoice: "INV-2025-0419" },
  { id: "p5", studentId: "u4", studentName: "Saanvi Joshi", level: "Advanced", amount: 6500, status: "Paid", date: "2025-05-01", invoice: "INV-2025-0501" },
];

export const events: Event[] = [
  { id: "e1", title: "Spring Recital 2026", date: "2026-06-14T18:00:00Z", venue: "Royal Opera House, Mumbai", description: "Annual recital showcasing top students across all programs.", spots: 200, registered: 142 },
  { id: "e2", title: "Trinity Grade Showcase", date: "2026-07-08T17:30:00Z", venue: "Academy Auditorium", description: "Examination-ready performances by Trinity track students.", spots: 80, registered: 56 },
  { id: "e3", title: "Speech Championship Finals", date: "2026-05-30T16:00:00Z", venue: "TEDx Hall", description: "Public speaking finals for Foundation and Intermediate cohorts.", spots: 120, registered: 98 },
];

export const notifications: Notification[] = [
  { id: "n1", title: "Class starting soon", message: "Piano · Morning A starts in 15 minutes.", type: "class", time: "5m ago", read: false },
  { id: "n2", title: "Homework due", message: "Submit scale recording by tonight.", type: "homework", time: "1h ago", read: false },
  { id: "n3", title: "Fee reminder", message: "Intermediate fee unlocks after Foundation completion.", type: "fee", time: "2h ago", read: true },
  { id: "n4", title: "Spring Recital", message: "Registration closes in 3 days.", type: "event", time: "Yesterday", read: true },
];

export const students: User[] = [
  { id: "u1", name: "Aarav Patel", email: "aarav@ms.academy", role: "student", course: "Piano", level: "Foundation", batch: "Piano · Morning A", joined: "2025-04-10" },
  { id: "u2", name: "Ishita Sen", email: "ishita@ms.academy", role: "student", course: "Vocal", level: "Intermediate", batch: "Vocal · Weekend Pro", joined: "2025-02-12" },
  { id: "u3", name: "Kabir Khan", email: "kabir@ms.academy", role: "student", course: "Public Speaking", level: "Foundation", batch: "Speech · Confidence", joined: "2025-04-22" },
  { id: "u4", name: "Saanvi Joshi", email: "saanvi@ms.academy", role: "student", course: "Violin", level: "Advanced", batch: "Violin · Trinity Track", joined: "2024-08-18" },
  { id: "u5", name: "Reyansh Gupta", email: "reyansh@ms.academy", role: "student", course: "Guitar", level: "Foundation", batch: "Guitar · Evening B", joined: "2025-05-02" },
  { id: "u6", name: "Anika Desai", email: "anika@ms.academy", role: "student", course: "Drums", level: "Intermediate", batch: "Drums · Beat Lab", joined: "2025-01-15" },
];

export const teachers: User[] = [
  { id: "t1", name: "Ananya Rao", email: "ananya@ms.academy", role: "teacher", course: "Piano, Vocal" },
  { id: "t2", name: "Rohan Mehta", email: "rohan@ms.academy", role: "teacher", course: "Guitar" },
  { id: "t3", name: "Priya Iyer", email: "priya@ms.academy", role: "teacher", course: "Violin, Trinity Grade" },
  { id: "t4", name: "Dr. Neha Sharma", email: "neha@ms.academy", role: "teacher", course: "Public Speaking" },
  { id: "t5", name: "Arjun Nair", email: "arjun@ms.academy", role: "teacher", course: "Drums" },
  { id: "t6", name: "Meera Kapoor", email: "meera@ms.academy", role: "teacher", course: "Vocal" },
];

export const practiceLogs: PracticeLog[] = [
  { id: "pl1", date: "2026-05-09", minutes: 45, course: "Piano" },
  { id: "pl2", date: "2026-05-10", minutes: 30, course: "Piano" },
  { id: "pl3", date: "2026-05-11", minutes: 60, course: "Piano" },
  { id: "pl4", date: "2026-05-12", minutes: 25, course: "Piano" },
  { id: "pl5", date: "2026-05-13", minutes: 50, course: "Piano" },
  { id: "pl6", date: "2026-05-14", minutes: 40, course: "Piano" },
  { id: "pl7", date: "2026-05-15", minutes: 55, course: "Piano" },
];

export const revenueData = [
  { month: "Nov", revenue: 142000, students: 198 },
  { month: "Dec", revenue: 168000, students: 212 },
  { month: "Jan", revenue: 195000, students: 234 },
  { month: "Feb", revenue: 178000, students: 241 },
  { month: "Mar", revenue: 214000, students: 268 },
  { month: "Apr", revenue: 248000, students: 289 },
  { month: "May", revenue: 276000, students: 312 },
];

export const attendanceData = [
  { week: "W1", present: 92, absent: 8 },
  { week: "W2", present: 88, absent: 12 },
  { week: "W3", present: 95, absent: 5 },
  { week: "W4", present: 90, absent: 10 },
];
