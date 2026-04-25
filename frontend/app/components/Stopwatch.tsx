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
    <div className="max-w-md mx-auto font-mono space-y-6">
      {/* Header */}
      <div
        className="border-2 border-black bg-[#f8f6f2] 
                   shadow-[3px_3px_0px_#1f1f1f] p-4"
      >
        <h1 className="text-xl text-center font-bold tracking-wide">
          {formatTime()}
        </h1>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-4">
        <button
          onClick={startStopWatch}
          className="px-4 py-2 border-2 border-black bg-[#dbeafe] text-xs
                     shadow-[3px_3px_0px_#1f1f1f]
                     active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
        >
          Start
        </button>

        <button
          onClick={pauseStopWatch}
          className="px-4 py-2 border-2 border-black bg-[#fef08a] text-xs
                     shadow-[2px_2px_0px_#1f1f1f]
                     active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
        >
          Pause
        </button>

        <button
          onClick={resetStopWatch}
          className="px-4 py-2 border border-black bg-white text-xs"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
