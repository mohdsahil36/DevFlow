"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";

export default function StopWatch() {
  const [time, setTime] = useState(0);
  const currentTimeRef = useRef<number>(0);

  function startStopWatch() {
    currentTimeRef.current = Date.now();
  }

  function pauseStopWatch() {}

  function resetStopWatch() {}

  return (
    <div className="max-w-3xl mx-auto bg-red-500">
      <h1 className="text-center">{time}</h1>
      <div className="text-center">
        <Button onClick={startStopWatch}>Start</Button>
        <Button onClick={pauseStopWatch}>Pause</Button>
        <Button onClick={resetStopWatch}>Stop</Button>
      </div>
    </div>
  );
}
