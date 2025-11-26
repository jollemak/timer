import { useTimer } from "./hooks";

export default function App() {
  const {
    time,
    isRunning,
    mode,
    inputMinutes,
    inputSeconds,
    setInputMinutes,
    setInputSeconds,
    handleStartStop,
    handleReset,
    switchMode,
    formatTime,
  } = useTimer();

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-900 to-gray-900">
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-12 shadow-2xl border border-white/20 mt-5">
        <div className="flex gap-4 justify-center mb-8">
          <button
            onClick={() => switchMode("stopwatch")}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              mode === "stopwatch"
                ? "bg-blue-500 text-white"
                : "bg-white/20 text-white/60 hover:bg-white/30"
            }`}
          >
            Stopwatch
          </button>
          <button
            onClick={() => switchMode("countdown")}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              mode === "countdown"
                ? "bg-blue-500 text-white"
                : "bg-white/20 text-white/60 hover:bg-white/30"
            }`}
          >
            Countdown
          </button>
        </div>

        <h1 className="text-4xl font-bold text-white text-center mb-8">
          {mode === "stopwatch" ? "Stopwatch" : "Countdown Timer"}
        </h1>
        
        {mode === "countdown" && !isRunning && time === 0 ? (
          <div className="mb-8">
            <div className="flex gap-4 justify-center items-center mb-8">
              <div>
                <input
                  type="number"
                  min="0"
                  max="99"
                  placeholder="MM"
                  value={inputMinutes}
                  onChange={(e) => setInputMinutes(e.target.value)}
                  className="w-24 px-4 py-3 text-3xl font-mono font-bold text-center bg-white/20 text-white rounded-xl border-2 border-white/30 focus:border-blue-500 focus:outline-none"
                />
                <div className="text-white/60 text-sm text-center mt-2">Minutes</div>
              </div>
              <div className="text-4xl font-bold text-white">:</div>
              <div>
                <input
                  type="number"
                  min="0"
                  max="59"
                  placeholder="SS"
                  value={inputSeconds}
                  onChange={(e) => setInputSeconds(e.target.value)}
                  className="w-24 px-4 py-3 text-3xl font-mono font-bold text-center bg-white/20 text-white rounded-xl border-2 border-white/30 focus:border-blue-500 focus:outline-none"
                />
                <div className="text-white/60 text-sm text-center mt-2">Seconds</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-7xl font-mono font-bold text-white text-center mb-12 tracking-wider">
            {formatTime(time)}
          </div>
        )}

        <div className="flex gap-4 justify-center">
          <button
            onClick={handleStartStop}
            disabled={mode === "countdown" && !isRunning && time === 0 && !inputMinutes && !inputSeconds}
            className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
              isRunning
                ? "bg-red-500 hover:bg-red-600 text-white"
                : "bg-green-500 hover:bg-green-600 text-white"
            }`}
          >
            {isRunning ? "Pause" : "Start"}
          </button>
          
          <button
            onClick={handleReset}
            className="px-8 py-4 bg-gray-600 hover:bg-gray-700 text-white rounded-xl font-semibold text-lg transition-all transform hover:scale-105"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
