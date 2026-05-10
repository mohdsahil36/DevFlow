import { create } from "zustand";

type TimerType = "pomodoro" | "stopwatch" | null;

interface TimeStore {
  type: TimerType;

  // shared state
  time: number;
  isRunning: boolean;
  intervalRef: ReturnType<typeof setInterval> | null;

  // pomodoro
  endTime: number;
  remainingTime: number;

  // stopwatch
  startTime: number;

  // actions
  startPomodoro: (duration: number) => void;
  startStopwatch: () => void;
  pause: () => void;
  reset: () => void;
}

export const useTimeStore = create<TimeStore>((set, get) => ({
  type: null,

  // shared
  time: 0,
  isRunning: false,
  intervalRef: null,

  // pomodoro
  endTime: 0,
  remainingTime: 0,

  // stopwatch
  startTime: 0,

  startPomodoro: (duration) => {
    const currentInterval = get().intervalRef;

    // clear previous interval
    if (currentInterval) {
      clearInterval(currentInterval);
    }

    let total = 0;

    // resume support
    if (get().remainingTime > 0) {
      total = get().remainingTime;
    } else {
      total = duration;
    }

    if (total <= 0) return;

    const endTime = Date.now() + total;

    // update initial state
    set({
      type: "pomodoro",
      endTime,
      remainingTime: 0,
      isRunning: true,
      time: total,
    });

    // start interval
    const interval = setInterval(() => {
      const remaining = get().endTime - Date.now();

      // completed
      if (remaining <= 0) {
        clearInterval(interval);

        set({
          time: 0,
          isRunning: false,
          intervalRef: null,
          remainingTime: 0,
          endTime: 0,
        });

        return;
      }

      set({
        time: remaining,
      });
    }, 50);

    set({
      intervalRef: interval,
    });
  },

  startStopwatch: () => {
    if (get().type !== "stopwatch") {
      set({
        time: 0,
        type: "stopwatch",
        startTime: 0,
        isRunning: true,
      });
    }
    const currentInterval = get().intervalRef;

    // prevent multiple intervals
    if (currentInterval) clearInterval(currentInterval);

    // resume support
    const startTime = Date.now() - get().time;

    set({
      type: "stopwatch",
      startTime,
      isRunning: true,
    });

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;

      set({
        time: elapsed,
      });
    }, 50);

    set({
      intervalRef: interval,
    });
  },

  pause: () => {
    const interval = get().intervalRef;

    if (interval) {
      clearInterval(interval);
    }

    // pomodoro pause
    if (get().type === "pomodoro") {
      const remainingTime = Math.max(get().endTime - Date.now(), 0);

      set({
        remainingTime,
        time: remainingTime,
        isRunning: false,
        intervalRef: null,
      });
    }

    // stopwatch pause
    if (get().type === "stopwatch") {
      set({
        isRunning: false,
        intervalRef: null,
      });
    }
  },
  reset: () => {
    const interval = get().intervalRef;

    if (interval) {
      clearInterval(interval);
    }

    set({
      type: null,

      time: 0,
      isRunning: false,
      intervalRef: null,

      endTime: 0,
      remainingTime: 0,

      startTime: 0,
    });
  },
}));
