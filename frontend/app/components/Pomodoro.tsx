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
      // order of time because we have to traverse through the array
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
    <div className="flex min-h-[20rem] items-center justify-center px-4">
      <div className="w-full max-w-md space-y-5">
        {/* Card */}
        <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-md p-5 text-center shadow-sm space-y-5">
          {/* Header */}
          <div className="text-xs font-medium text-[var(--text-secondary)] tracking-wide">
            Pomodoro
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
                    className="
                      w-12 text-center text-sm
                      border border-[var(--border-default)]
                      rounded-md
                      bg-[var(--bg-surface)]
                      focus:outline-none focus:ring-2 focus:ring-[var(--green-primary)]
                    "
                  />
                  <span className="text-[10px] text-[var(--text-secondary)]">
                    {key}
                  </span>
                </div>

                {index < orderOfTime.length - 1 && (
                  <span className="text-sm text-[var(--text-secondary)]">
                    :
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Timer */}
          <div className="relative flex items-center justify-center">
            <svg
              className="absolute w-40 h-40 -rotate-90"
              viewBox="0 0 100 100"
            >
              {/* Background */}
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="var(--border-default)"
                strokeWidth="5"
                fill="none"
              />

              {/* Progress */}
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="var(--green-primary)"
                strokeWidth="5"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-[stroke-dashoffset] duration-150"
              />
            </svg>

            <div className="flex h-40 w-40 items-center justify-center rounded-full bg-[var(--bg-surface)]">
              <span className="text-xl font-semibold text-[var(--text-primary)]">
                {formatTime(time || previewTime)}
              </span>
            </div>
          </div>

          {/* Status */}
          <p className="text-xs text-[var(--text-secondary)]">
            {!time ? "Ready" : "Running"}
          </p>

          {/* Buttons */}
          <div className="flex justify-center gap-3">
            {/* Start */}
            <button
              onClick={() => start(convertedTime(), "pomodoro")}
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
              onClick={pause}
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
              onClick={reset}
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
      </div>
    </div>
  );
}
