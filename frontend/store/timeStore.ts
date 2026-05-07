import { create } from "zustand";

type TimerType = "pomodoro" | "stopwatch" | null;

interface TimeStore {
  type: TimerType;
  time: number;
  isRunning: boolean;
  endTime: number;
  remainingTime: number;
  intervalRef: ReturnType<typeof setInterval> | null;

  start: (duration: number, type: TimerType) => void;
  pause: () => void;
  reset: () => void;
}

export const useTimeStore = create<TimeStore>((set, get) => ({
  type: null,
  time: 0,
  isRunning: false,
  endTime: 0,
  remainingTime: 0,
  intervalRef: null,

  start: (duration, type) => {
    const currentInterval = get().intervalRef;

    // stop previous timer
    if (currentInterval) clearInterval(currentInterval);

    // decide total time (resume or fresh)
    let total = 0;
    if (get().remainingTime > 0) {
      total = get().remainingTime;
    } else {
      total = duration;
    }

    if (total <= 0) return;

    const endTime = Date.now() + total;

    // update state before starting
    set({
      endTime,
      isRunning: true,
      type,
      remainingTime: 0,
      time: total,
    });

    // start interval
    const interval = setInterval(() => {
      const remaining = get().endTime - Date.now();

      if (remaining <= 0) {
        clearInterval(interval);

        set({
          time: 0,
          isRunning: false,
          intervalRef: null,
          remainingTime: 0,
        });

        return;
      }

      set({ time: remaining });
    }, 50);

    // save interval
    set({ intervalRef: interval });
  },

  pause: () => {
    const interval = get().intervalRef;
    if (interval) clearInterval(interval);

    const remainingTime = get().endTime - Date.now();
    set({
      remainingTime: remainingTime,
      isRunning: false,
      intervalRef: null,
      time: remainingTime,
    });
  },

  reset: () => {
    const interval = get().intervalRef;

    if (interval) {
      clearInterval(interval);
    }

    set({
      time: 0,
      type: null,
      isRunning: false,
      intervalRef: null,
      remainingTime: 0,
      endTime: 0,
    });
  },
}));
