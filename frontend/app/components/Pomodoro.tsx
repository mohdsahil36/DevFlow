"use client";

import { useState, type ChangeEvent } from "react";
import { useTimeStore } from "@/store/timeStore";

const timeFactors = {
  Hours: "h",
  Minutes: "m",
  Seconds: "s",
};

const timeConfig = {
  [timeFactors.Hours]: { value: "0", factor: 60 * 60 * 1000 },
  [timeFactors.Minutes]: { value: "0", factor: 60 * 1000 },
  [timeFactors.Seconds]: { value: "0", factor: 1000 },
};

const orderOfTime = [
  timeFactors.Hours,
  timeFactors.Minutes,
  timeFactors.Seconds,
];

export default function Pomodoro() {
  const [config, setConfig] = useState(structuredClone(timeConfig));

  const { time, start, pause, reset } = useTimeStore();

  function handleChange(key: string, e: ChangeEvent<HTMLInputElement>) {
    const newValue = Number(e.target.value).toString();
    const newConfig = structuredClone(config);
    newConfig[key].value = newValue;
    setConfig(newConfig);
  }

  function convertedTime() {
    let convertedTime = 0;
    orderOfTime.forEach((key) => {
      const { value, factor } = config[key];
      if (!isNaN(Number(value))) {
        convertedTime += Number(value) * factor;
      }
    });

    return convertedTime;
  }

  function pad(num: number) {
    return num.toString().padStart(2, "0");
  }

  function formatTime(time: number) {
    const sec = Math.floor((time / 1000) % 60);
    const min = Math.floor((time / (1000 * 60)) % 60);
    const hr = Math.floor((time / (1000 * 60 * 60)) % 24);
    return `${pad(hr)}:${pad(min)}:${pad(sec)}`;
  }

  // preview time from inputs
  const previewTime = orderOfTime.reduce((acc, key) => {
    const { value, factor } = config[key];
    return acc + (Number(value) || 0) * factor;
  }, 0);

  // circular progress
  const totalTime = previewTime || time || 1;
  const isRunning = time > 0;

  const progress = isRunning ? time / totalTime : 1;

  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = (1 - progress) * circumference;

  return (
    <div className="flex min-h-[20rem] items-center justify-center px-4 font-mono text-[#231f1a]">
      <div className="w-full max-w-md space-y-6">
        <div className="space-y-6 border-2 border-[#231f1a] bg-[#fffdf5] p-6 text-center shadow-[6px_6px_0px_#231f1a]">
          {/* Header */}
          <div className="text-xs font-bold tracking-[0.35em] text-[#5b5245]">
            POMODORO
          </div>

          {/* Inputs */}
          <div className="flex items-center justify-center gap-2">
            {orderOfTime.map((key, index) => (
              <div key={key} className="flex items-center gap-2">
                <div className="flex flex-col items-center">
                  <input
                    type="number"
                    value={config[key].value}
                    onChange={(e) => handleChange(key, e)}
                    className="w-14 border-2 border-[#231f1a] bg-[#fff8dc] py-1 text-center text-sm outline-none focus:bg-[#fff3bf]"
                  />
                  <span className="text-[10px] text-[#7a6f61]">{key}</span>
                </div>

                {index < orderOfTime.length - 1 && (
                  <span className="text-sm text-[#7a6f61]">:</span>
                )}
              </div>
            ))}
          </div>

          {/* Timer */}
          <div className="relative flex items-center justify-center">
            <svg
              className="absolute w-44 h-44 -rotate-90"
              viewBox="0 0 100 100"
            >
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="#d8cfbd"
                strokeWidth="5"
                fill="none"
              />

              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="#5D3FD3"
                strokeWidth="5"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-[stroke-dashoffset] duration-150"
              />
            </svg>

            <div className="flex h-44 w-44 items-center justify-center rounded-full border-2 border-[#231f1a] bg-[#fff9ea] shadow-[inset_0_0_0_3px_#efe3cc]">
              <span className="text-2xl font-bold text-[#231f1a]">
                {formatTime(time || previewTime)}
              </span>
            </div>
          </div>

          {/* Status */}
          <p className="text-sm text-[#7a6f61]">
            {!time ? "Ready to focus" : "Focus mode ON"}
          </p>

          {/* Buttons */}
          <div className="flex justify-center gap-3">
            {/* Start */}
            <button
              onClick={() => {
                start(convertedTime(), "pomodoro");
              }}
              className="
                border-2 border-[#231f1a] bg-[#fff3bf] px-4 py-2 text-xs font-bold tracking-wide text-[#231f1a]
                shadow-[4px_4px_0px_#231f1a]
                cursor-pointer select-none
                active:translate-x-[2px] active:translate-y-[2px]
                active:shadow-none
                transition-all duration-75
              "
            >
              Start
            </button>

            {/* Pause */}
            <button
              onClick={pause}
              className="
                border-2 border-[#231f1a] bg-[#fff3bf] px-4 py-2 text-xs font-bold tracking-wide text-[#231f1a]
                shadow-[4px_4px_0px_#231f1a]
                cursor-pointer select-none
                active:translate-x-[2px] active:translate-y-[2px]
                active:shadow-none
                transition-all duration-75
              "
            >
              Pause
            </button>

            {/* Reset */}
            <button
              onClick={reset}
              className="
                border-2 border-[#231f1a] bg-[#fff3bf] px-4 py-2 text-xs font-bold tracking-wide text-[#231f1a]
                shadow-[4px_4px_0px_#231f1a]
                cursor-pointer select-none
                active:translate-x-[2px] active:translate-y-[2px]
                active:shadow-none
                transition-all duration-75
              "
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
