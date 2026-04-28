"use client";

import StopWatch from "@/app/components/Stopwatch";
import Pomodoro from "@/app/components/Pomodoro";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function PomodoroPage() {
  return (
    <div className="min-h-[30rem] bg-[#f8f8f6] p-4 font-mono">
      <div className="max-w-2xl mx-auto space-y-4">
        {/* Tabs */}
        <Tabs defaultValue="pomodoro" className="w-full text-center">
          {/* Tabs Header */}
          <TabsList className="flex gap-2 bg-transparent p-0">
            {["pomodoro", "stopwatch"].map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                className="
                  px-4 py-2 border-2 border-black text-xs uppercase
                  bg-white
                  shadow-[3px_3px_0px_#000]
                  data-[state=active]:translate-x-[2px]
                  data-[state=active]:translate-y-[2px]
                  data-[state=active]:shadow-none
                  transition-all
                "
              >
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Pomodoro */}
          <TabsContent value="pomodoro">
            <div
              className="
                border-2 border-black bg-white p-6 mt-4
                shadow-[4px_4px_0px_#000]
                space-y-4
              "
            >
              <div>
                <h2 className="text-sm uppercase tracking-wide">Pomodoro</h2>
                <p className="text-xs text-gray-600">
                  Focus timer for deep work sessions
                </p>
              </div>

              <Pomodoro />
            </div>
          </TabsContent>

          {/* Stopwatch */}
          <TabsContent value="stopwatch">
            <div
              className="
                border-2 border-black bg-white p-6 mt-4
                shadow-[4px_4px_0px_#000]
                space-y-4
              "
            >
              <div>
                <h2 className="text-sm uppercase tracking-wide">Stopwatch</h2>
                <p className="text-xs text-gray-600">
                  Track time manually with precision
                </p>
              </div>

              <StopWatch />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
