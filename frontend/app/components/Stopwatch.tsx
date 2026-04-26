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
  }, []);

  return (
    <div className="mx-auto max-w-md space-y-6 font-mono text-[#231f1a]">
      {/* Header */}
      <div
        className="border-2 border-[#231f1a] bg-[#fffdf5]
                   p-5 shadow-[6px_6px_0px_#231f1a]"
      >
        <h1 className="text-center text-xl font-bold tracking-wide">
          {formatTime()}
        </h1>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-4">
        <button
          onClick={startStopWatch}
          className="border-2 border-[#231f1a] bg-[#d7e6ff] px-4 py-2 text-xs font-bold tracking-wide
                     shadow-[4px_4px_0px_#231f1a]
                     active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
        >
          Start
        </button>

        <button
          onClick={pauseStopWatch}
          className="border-2 border-[#231f1a] bg-[#ffe08a] px-4 py-2 text-xs font-bold tracking-wide
                     shadow-[4px_4px_0px_#231f1a]
                     active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
        >
          Pause
        </button>

        <button
          onClick={resetStopWatch}
          className="border-2 border-[#231f1a] bg-[#ffd6d6] px-4 py-2 text-xs font-bold tracking-wide
                     shadow-[4px_4px_0px_#231f1a]
                     active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
