export type TaskPriority = "high" | "med" | "low";
export type TaskStatus = "Done" | "In Progress" | "To Do";

export interface SampleTask {
  id: number;
  text: string;
  status: TaskStatus;
  priority: TaskPriority;
}

export interface VelocityPoint {
  day: string;
  tasks: number;
}

export interface UpcomingEvent {
  time: string;
  title: string;
  tag: "eng" | "design" | "mgmt";
  color: string; // CSS var string — used only in recharts / SVG dot, unavoidable
}

/* ── SAMPLE DATA — replace with live API/store data ── */

export const SAMPLE_TASKS: SampleTask[] = [
  { id: 1, text: "Design system tokens", status: "Done", priority: "high" },
  { id: 2, text: "API integration spec", status: "Done", priority: "high" },
  { id: 3, text: "Auth flow refactor", status: "In Progress", priority: "med" },
  {
    id: 4,
    text: "Dashboard bento layout",
    status: "In Progress",
    priority: "med",
  },
  { id: 5, text: "Write unit tests", status: "To Do", priority: "low" },
  { id: 6, text: "E2E test coverage", status: "To Do", priority: "low" },
];

export const VELOCITY_DATA: VelocityPoint[] = [
  { day: "Mon", tasks: 2 },
  { day: "Tue", tasks: 4 },
  { day: "Wed", tasks: 3 },
  { day: "Thu", tasks: 1 },
  { day: "Fri", tasks: 5 },
  { day: "Sat", tasks: 6 },
  { day: "Sun", tasks: 5 },
];

export const UPCOMING_EVENTS: UpcomingEvent[] = [
  {
    time: "10:00",
    title: "Sprint planning",
    tag: "eng",
    color: "var(--db-green-primary)",
  },
  {
    time: "13:30",
    title: "Design review — dashboard",
    tag: "design",
    color: "var(--db-blue)",
  },
  {
    time: "16:00",
    title: "1:1 with team lead",
    tag: "mgmt",
    color: "var(--db-amber)",
  },
];

export const CALENDAR_EVENT_DAYS = new Set([3, 7, 10, 14, 17, 21, 25, 28]);
