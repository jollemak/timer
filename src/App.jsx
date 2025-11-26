import { useState, useEffect, useRef } from "react";

export default function App() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [targetTime, setTargetTime] = useState(0);
  const [inputMinutes, setInputMinutes] = useState("");
  const [inputSeconds, setInputSeconds] = useState("");
  const [mode, setMode] = useState("stopwatch"); // "stopwatch" or "countdown"
  const intervalRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    // Create audio context for alarm sound
    if (!audioRef.current) {
      audioRef.current = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZUQ8NS6nk7K5aFg1Mn+Lzu3AeBjiS2PDBdygFKXvJ8NuVRAsTYLfs6qdWFApDnt/wvG0gBTKI0vLSfzQGHm++7+OYUQ8NS6nk7K5aFg1Mn+Lzu3AeBjiS2PDBdygFKXvJ8NuVRAsTYLfs6qdWFApDnt/wvG0gBTKI0vLSfzQGHm++7+OYUQ8NS6nk7K5aFg1Mn+Lzu3AeBjiS2PDBdygFKXvJ8NuVRAsTYLfs6qdWFApDnt/wvG0gBTKI0vLSfzQGHm++7+OYUQ8NS6nk7K5aFg1Mn+Lzu3AeBjiS2PDBdygFKXvJ8NuVRAsTYLfs6qdWFApDnt/wvG0gBTKI0vLSfzQGHm++7+OYUQ8NS6nk7K5aFg1Mn+Lzu3AeBjiS2PDBdygFKXvJ8NuVRAsTYLfs6qdWFApDnt/wvG0gBTKI0vLSfzQGHm++7+OYUQ8NS6nk7K5aFg1Mn+Lzu3AeBjiS2PDBdygFKXvJ8NuVRAsTYLfs6qdWFApDnt/wvG0gBTKI0vLSfzQGHm++7+OYUQ8NS6nk7K5aFg1Mn+Lzu3AeBjiS2PDBdygFKXvJ8NuVRAsTYLfs6qdWFApDnt/wvG0gBTKI0vLSfzQGHm++7+OYUQ8NS6nk7K5aFg1Mn+Lzu3AeBjiS2PDBdygFKXvJ8NuVRAsTYLfs6qdWFApDnt/wvG0gBTKI0vLSfzQGHm++7+OYUQ8NS6nk7K5aFg1Mn+Lzu3AeBjiS2PDBdygFKXvJ8NuVRAsTYLfs6qdWFApDnt/wvG0gBTKI0vLSfzQGHm++7+OYUQ8NS6nk7K5aFg1Mn+Lzu3AeBjiS2PDBdygFKXvJ8NuVRAsTYLfs6qdWFApDnt/wvG0gBTKI0vLSfzQGHm++7+OYUQ8NS6nk7K5aFg1Mn+Lzu3AeBjiS2PDBdygFKXvJ8NuVRAsTYLfs6qdWFApDnt/wvG0gBTKI0vLSfzQGHm++7+OYUQ8NS6nk7K5aFg1Mn+Lzu3AeBjiS2PDBdygFKXvJ8NuVRAsTYLfs6qdWFApDnt/wvG0gBTKI0vLSfzQGHm++7+OYUQ8NS6nk7K5aFg1Mn+Lzu3AeBjiS2PDBdygFKXvJ8NuVRAsTYLfs6qdWFApDnt/wvG0gBTKI0vLSfzQGHm++7+OYUQ8NS6nk7K5aFg1Mn+Lzu3AeBjiS2PDBdygFKXvJ8NuVRAsTYLfs6qdWFApDnt/wvG0gBTKI0vLSfzQGHm++7+OYUQ8NS6nk7K5aFg1Mn+Lzu3AeBjiS2PDBdygFKXvJ8NuVRAsTYLfs6qdWFApDnt/wvG0gBTKI0vLSfzQGHm++7+OYUQ8NS6nk7K5aFg1Mn+Lzu3AeBjiS2PDBdygFKXvJ8NuVRAsTYLfs6qdWFApDnt/wvG0gBTKI0vLSfzQGHm++7+OYUQ8NS6nk7K5aFg1Mn+Lzu3AeBjiS2PDBdygFKXvJ8NuVRAsTYLfs=');
    }
  }, []);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime((prevTime) => {
          const newTime = mode === "stopwatch" ? prevTime + 10 : prevTime - 10;
          
          // Check if countdown has reached zero
          if (mode === "countdown" && newTime <= 0) {
            setIsRunning(false);
            playAlarm();
            showNotification();
            return 0;
          }
          
          return newTime;
        });
      }, 10);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, mode]);

  const playAlarm = () => {
    if (audioRef.current) {
      audioRef.current.loop = true;
      audioRef.current.play().catch(err => console.log("Audio play failed:", err));
      
      // Stop alarm after 10 seconds
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
          audioRef.current.loop = false;
        }
      }, 10000);
    }
  };

  const showNotification = () => {
    if ("Notification" in window) {
      if (Notification.permission === "granted") {
        new Notification("Timer Finished!", {
          body: "Your countdown timer has reached zero!",
          icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='75' font-size='75'>⏰</text></svg>"
        });
      } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(permission => {
          if (permission === "granted") {
            new Notification("Timer Finished!", {
              body: "Your countdown timer has reached zero!",
              icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='75' font-size='75'>⏰</text></svg>"
            });
          }
        });
      }
    }
  };

  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const ms = Math.floor((milliseconds % 1000) / 10);

    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${String(ms).padStart(2, "0")}`;
  };

  const handleStartStop = () => {
    if (!isRunning && mode === "countdown" && time === 0) {
      // Starting countdown - set time from input
      const totalMs = (parseInt(inputMinutes || 0) * 60 + parseInt(inputSeconds || 0)) * 1000;
      if (totalMs > 0) {
        setTime(totalMs);
        setTargetTime(totalMs);
        setIsRunning(true);
        
        // Request notification permission when starting countdown
        if ("Notification" in window && Notification.permission === "default") {
          Notification.requestPermission();
        }
      }
    } else {
      setIsRunning(!isRunning);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
    setTargetTime(0);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.loop = false;
    }
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setIsRunning(false);
    setTime(0);
    setTargetTime(0);
    setInputMinutes("");
    setInputSeconds("");
  };

  return (
    <div className="min-h-screen flex items-start justify-center bg-linear-to-br from-gray-900 to-gray-900">
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
