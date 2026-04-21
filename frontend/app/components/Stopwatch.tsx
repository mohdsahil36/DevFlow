"use client";

import { useState, useRef } from "react";

export default function StopWatch() {
  const [time, setTime] = useState(0);
  const stopwatchRef = useRef<number>(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function formatTime() {
    const ms = Math.floor((time % 1000) / 10);
    const sec = Math.floor((time / 1000) % 60);
    const min = Math.floor((time / (1000 * 60)) % 60);
    const hr = Math.floor((time / (1000 * 60 * 60)) % 24);

    return `${pad(hr)}:${pad(min)}:${pad(sec)}.${pad(ms)}`;
  }

  function pad(num: number) {
    return num.toString().padStart(2, "0");
  }

  function startStopWatch() {
    stopwatchRef.current = new Date().getTime() - time;
    intervalRef.current = setInterval(() => {
      setTime(new Date().getTime() - stopwatchRef.current);
    }, 10);
  }

  function pauseStopWatch() {
    if (intervalRef.current) clearInterval(intervalRef.current);
  }

  function resetStopWatch() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setTime(0);
  }

  return (
    <div className="max-w-md mx-auto font-mono space-y-6">
      {/* Header */}
      <div
        className="border-2 border-black bg-[#f8f6f2] 
                      shadow-[3px_3px_0px_#1f1f1f] p-4"
      >
        <div className="bg-[#1f1f1f] text-white text-xs px-2 py-1 inline-block mb-2">
          STOPWATCH
        </div>

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
