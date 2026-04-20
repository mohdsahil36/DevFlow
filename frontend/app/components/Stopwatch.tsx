"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";

export default function StopWatch() {
  const [time, setTime] = useState(0);
  const stopwatchRef = useRef<number>(0); //here we will store the values of the time in ms
  const intervalRef = useRef(0);

  function formatTime() {
    const ms = Math.floor((time % 1000) / 10); // hundredths of a second
    const sec = Math.floor((time / 1000) % 60); // seconds (0–59)
    const min = Math.floor((time / (1000 * 60)) % 60); // minutes (0–59)
    const hr = Math.floor(time / (1000 * 60 * 60)); // hours

    return `${pad(hr)}:${pad(min)}:${pad(sec)}.${pad(ms)}`;
  }

  function pad(num: number) {
    return num.toString().padStart(2, "0");
  }

  function startStopWatch() {
    stopwatchRef.current = new Date().getTime();
    intervalRef.current = setInterval(() => {
      setTime(new Date().getTime() - stopwatchRef.current);
    }, 10);
  }

  function pauseStopWatch() {}

  function resetStopWatch() {}

  return (
    <div className="max-w-3xl mx-auto bg-red-500">
      <h1 className="text-center">{formatTime()}</h1>
      <div className="text-center">
        <Button onClick={startStopWatch}>Start</Button>
        <Button onClick={pauseStopWatch}>Pause</Button>
        <Button onClick={resetStopWatch}>Stop</Button>
      </div>
    </div>
  );
}
