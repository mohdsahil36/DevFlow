"use client";

import { useState, useRef } from "react";

const timeFactors = {
  Hours: "h",
  Minutes: "m",
  Seconds: "s",
};

const timeConfig = {
  [timeFactors.Hours]: { value: 0, factor: 60 * 60 * 1000 },
  [timeFactors.Minutes]: { value: 25, factor: 60 * 1000 },
  [timeFactors.Seconds]: { value: 0, factor: 1000 },
};

const orderOfTime = [
  timeFactors.Hours,
  timeFactors.Minutes,
  timeFactors.Seconds,
];

export default function Pomodoro() {
  const [config, setConfig] = useState(structuredClone(timeConfig));
  const [time, setTime] = useState<number>(0);

  const currentTimeRef = useRef<number>(0);

  function startPomodoro() {
    currentTimeRef.current = Date.now();
  }

  function resetPomodoro() {
    setTime(0);
    setConfig(structuredClone(timeConfig));
  }

  return (
    <div className="min-h-[calc(100vh-120px)] flex items-center justify-center font-mono">
      <div className="w-full max-w-md space-y-6">
        {/* Card */}
        <div
          className="border-2 border-black bg-[#f8f6f2] 
                        shadow-[3px_3px_0px_#1f1f1f] p-6 text-center space-y-6"
        >
          {/* Header */}
          <div className="bg-[#1f1f1f] text-white text-xs px-2 py-1 inline-block">
            POMODORO
          </div>

          {/* Segmented Inputs */}
          <div className="flex items-center justify-center gap-2">
            {orderOfTime.map((unit, index) => (
              <div key={unit} className="flex items-center gap-2">
                <div className="flex flex-col items-center">
                  <input
                    type="number"
                    value={config[unit].value}
                    className="w-16 text-center border border-black bg-white 
                               text-sm py-2"
                  />

                  <span className="text-[10px] text-gray-500">{unit}</span>
                </div>

                {/* Colon separator */}
                {index < orderOfTime.length - 1 && (
                  <span className="text-lg font-bold">:</span>
                )}
              </div>
            ))}
          </div>

          {/* Circular Timer */}
          <div className="relative flex items-center justify-center">
            <div className="w-44 h-44 rounded-full border-2 border-black flex items-center justify-center">
              <div
                className="w-36 h-36 rounded-full border border-black 
                              bg-white flex items-center justify-center"
              >
                <span className="text-2xl font-bold">{time}</span>
              </div>
            </div>

            {/* Progress placeholder */}
            <div className="absolute w-44 h-44 rounded-full border-t-4 border-yellow-400 rotate-45 opacity-70" />
          </div>

          {/* Status */}
          <p className="text-xs text-gray-500">
            {!time ? "Ready to focus" : "Focus mode: ON"}
          </p>

          {/* Controls */}
          <div className="flex justify-center gap-4">
            <button
              onClick={startPomodoro}
              className="px-4 py-2 border-2 border-black bg-[#dbeafe] text-xs
                         shadow-[3px_3px_0px_#1f1f1f]"
            >
              Start
            </button>

            <button
              className="px-4 py-2 border-2 border-black bg-[#fef08a] text-xs
                         shadow-[2px_2px_0px_#1f1f1f]"
            >
              Pause
            </button>

            <button
              onClick={resetPomodoro}
              className="px-4 py-2 border border-black bg-white text-xs"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
