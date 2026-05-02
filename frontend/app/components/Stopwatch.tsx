"use client";

import { useState, useRef, useEffect } from "react";

export default function StopWatch() {
  const [time, setTime] = useState(0);

  const stopwatchRef = useRef<number>(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const needToResumeRef = useRef(false);

  function pad(num: number) {
    return num.toString().padStart(2, "0");
  }

  function formatTime() {
    const ms = Math.floor((time % 1000) / 10);
    const sec = Math.floor((time / 1000) % 60);
    const min = Math.floor((time / (1000 * 60)) % 60);
    const hr = Math.floor((time / (1000 * 60 * 60)) % 24);

    return `${pad(hr)}:${pad(min)}:${pad(sec)}.${pad(ms)}`;
  }

  function startStopWatch() {
    // prevent multiple intervals
    if (intervalRef.current) return;

    stopwatchRef.current = Date.now() - time;

    intervalRef.current = setInterval(() => {
      setTime(Date.now() - stopwatchRef.current);
    }, 10);
  }

  function pauseStopWatch() {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }

  function resetStopWatch() {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setTime(0);
    needToResumeRef.current = false;
  }

  function onBlur() {
    // remember if it was running
    needToResumeRef.current = intervalRef.current !== null;

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }

  function onFocus() {
    if (needToResumeRef.current) {
      startStopWatch();
      needToResumeRef.current = false;
    }
  }

  useEffect(() => {
    window.addEventListener("blur", onBlur);
    window.addEventListener("focus", onFocus);

    return () => {
      window.removeEventListener("blur", onBlur);
      window.removeEventListener("focus", onFocus);

      // cleanup interval on unmount
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  });

  return (
    <div className="mx-auto max-w-md space-y-5 text-[var(--text-primary)]">
      {/* Timer Display */}
      <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-md p-4 shadow-sm">
        <h1 className="text-center text-lg font-semibold tracking-tight">
          {formatTime()}
        </h1>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-3">
        {/* Start */}
        <button
          onClick={startStopWatch}
          className="
            px-4 py-2 text-xs font-medium rounded-md
            bg-[var(--green-primary)] text-white
            hover:bg-[var(--green-hover)]
            active:bg-[var(--green-active)]
            transition
          "
        >
          Start
        </button>

        {/* Pause */}
        <button
          onClick={pauseStopWatch}
          className="
            px-4 py-2 text-xs font-medium rounded-md
            bg-gray-100 text-[var(--text-primary)]
            hover:bg-gray-200
            active:bg-gray-300
            transition
          "
        >
          Pause
        </button>

        {/* Reset */}
        <button
          onClick={resetStopWatch}
          className="
            px-4 py-2 text-xs font-medium rounded-md
            bg-gray-100 text-[var(--text-primary)]
            hover:bg-gray-200
            active:bg-gray-300
            transition
          "
        >
          Reset
        </button>
      </div>
    </div>
  );
}
