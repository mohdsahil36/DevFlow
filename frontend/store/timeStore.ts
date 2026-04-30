import { create } from "zustand";

type TimerType = "pomodoro" | "stopwatch" | null;

interface TimeStore {
  type: TimerType;
  time: number;
  isRunning: boolean;

  start: () => void; // starting the timer
  pause: () => void; // pausing the timer
  reset: () => void; // resetting the timer
}
