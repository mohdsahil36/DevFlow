"use client";

export default function Pomodoro() {
  return (
    <div className="min-h-[calc(100vh-120px)] flex items-center justify-center font-mono">
      <div className="w-full max-w-md space-y-6">
        <div
          className="border-2 border-black bg-[#f8f6f2] 
                        shadow-[3px_3px_0px_#1f1f1f] p-6 text-center space-y-6"
        >
          <div className="bg-[#1f1f1f] text-white text-xs px-2 py-1 inline-block">
            POMODORO
          </div>

          <div className="flex flex-col gap-2 text-left">
            <label className="text-xs">Focus Duration (minutes)</label>
            <input
              type="number"
              placeholder="25"
              className="border border-black bg-white px-3 py-2 text-sm 
                         rounded-none focus:outline-none"
            />
          </div>

          <div className="relative flex items-center justify-center">
            <div className="w-44 h-44 rounded-full border-2 border-black flex items-center justify-center">
              <div
                className="w-36 h-36 rounded-full border border-black 
                              bg-white flex items-center justify-center"
              >
                <span className="text-2xl font-bold">25:00</span>
              </div>
            </div>

            <div className="absolute w-44 h-44 rounded-full border-t-4 border-yellow-400 rotate-45 opacity-70" />
          </div>

          <p className="text-xs text-gray-500">Ready to focus</p>

          <div className="flex justify-center gap-4">
            <button
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

            <button className="px-4 py-2 border border-black bg-white text-xs">
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
