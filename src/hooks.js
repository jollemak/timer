import { useState, useEffect, useRef, useCallback } from "react";

const ALARM_SOUND = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZUQ8NS6nk7K5aFg1Mn+Lzu3AeBjiS2PDBdygFKXvJ8NuVRAsTYLfs6qdWFApDnt/wvG0gBTKI0vLSfzQGHm++7+OYUQ8NS6nk7K5aFg1Mn+Lzu3AeBjiS2PDBdygFKXvJ8NuVRAsTYLfs6qdWFApDnt/wvG0gBTKI0vLSfzQGHm++7+OYUQ8NS6nk7K5aFg1Mn+Lzu3AeBjiS2PDBdygFKXvJ8NuVRAsTYLfs6qdWFApDnt/wvG0gBTKI0vLSfzQGHm++7+OYUQ8NS6nk7K5aFg1Mn+Lzu3AeBjiS2PDBdygFKXvJ8NuVRAsTYLfs6qdWFApDnt/wvG0gBTKI0vLSfzQGHm++7+OYUQ8NS6nk7K5aFg1Mn+Lzu3AeBjiS2PDBdygFKXvJ8NuVRAsTYLfs6qdWFApDnt/wvG0gBTKI0vLSfzQGHm++7+OYUQ8NS6nk7K5aFg1Mn+Lzu3AeBjiS2PDBdygFKXvJ8NuVRAsTYLfs6qdWFApDnt/wvG0gBTKI0vLSfzQGHm++7+OYUQ8NS6nk7K5aFg1Mn+Lzu3AeBjiS2PDBdygFKXvJ8NuVRAsTYLfs6qdWFApDnt/wvG0gBTKI0vLSfzQGHm++7+OYUQ8NS6nk7K5aFg1Mn+Lzu3AeBjiS2PDBdygFKXvJ8NuVRAsTYLfs6qdWFApDnt/wvG0gBTKI0vLSfzQGHm++7+OYUQ8NS6nk7K5aFg1Mn+Lzu3AeBjiS2PDBdygFKXvJ8NuVRAsTYLfs6qdWFApDnt/wvG0gBTKI0vLSfzQGHm++7+OYUQ8NS6nk7K5aFg1Mn+Lzu3AeBjiS2PDBdygFKXvJ8NuVRAsTYLfs6qdWFApDnt/wvG0gBTKI0vLSfzQGHm++7+OYUQ8NS6nk7K5aFg1Mn+Lzu3AeBjiS2PDBdygFKXvJ8NuVRAsTYLfs6qdWFApDnt/wvG0gBTKI0vLSfzQGHm++7+OYUQ8NS6nk7K5aFg1Mn+Lzu3AeBjiS2PDBdygFKXvJ8NuVRAsTYLfs6qdWFApDnt/wvG0gBTKI0vLSfzQGHm++7+OYUQ8NS6nk7K5aFg1Mn+Lzu3AeBjiS2PDBdygFKXvJ8NuVRAsTYLfs6qdWFApDnt/wvG0gBTKI0vLSfzQGHm++7+OYUQ8NS6nk7K5aFg1Mn+Lzu3AeBjiS2PDBdygFKXvJ8NuVRAsTYLfs6qdWFApDnt/wvG0gBTKI0vLSfzQGHm++7+OYUQ8NS6nk7K5aFg1Mn+Lzu3AeBjiS2PDBdygFKXvJ8NuVRAsTYLfs6qdWFApDnt/wvG0gBTKI0vLSfzQGHm++7+OYUQ8NS6nk7K5aFg1Mn+Lzu3AeBjiS2PDBdygFKXvJ8NuVRAsTYLfs=';

// Utility functions
export const formatTime = (milliseconds) => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const ms = Math.floor((milliseconds % 1000) / 10);

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${String(ms).padStart(2, "0")}`;
};

export const playAlarm = (audioRef) => {
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

export const stopAlarm = (audioRef) => {
  if (audioRef.current) {
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    audioRef.current.loop = false;
  }
};

export const showNotification = () => {
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

// Main Timer Hook
export function useTimer() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [targetTime, setTargetTime] = useState(0);
  const [inputMinutes, setInputMinutes] = useState("");
  const [inputSeconds, setInputSeconds] = useState("");
  const [mode, setMode] = useState("stopwatch");
  const [isLoaded, setIsLoaded] = useState(false);
  
  const [stopwatchState, setStopwatchState] = useState({ time: 0, isRunning: false });
  const [countdownState, setCountdownState] = useState({ 
    time: 0, 
    isRunning: false, 
    targetTime: 0, 
    inputMinutes: "", 
    inputSeconds: "" 
  });
  
  const intervalRef = useRef(null);
  const audioRef = useRef(null);
  const alarmPlayedRef = useRef(false);

  // Initialize audio
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(ALARM_SOUND);
    }
  }, []);

  // Load saved state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('timerState');
    if (savedState) {
      try {
        const {
          stopwatch,
          countdown,
          mode: savedMode,
          lastSavedTimestamp
        } = JSON.parse(savedState);

        setMode(savedMode || "stopwatch");
        
        if (stopwatch) {
          let swTime = stopwatch.time || 0;
          let swRunning = stopwatch.isRunning || false;
          
          if (swRunning && lastSavedTimestamp) {
            const elapsed = Date.now() - lastSavedTimestamp;
            swTime = swTime + elapsed;
          }
          
          setStopwatchState({ time: swTime, isRunning: swRunning });
          
          if (savedMode === "stopwatch") {
            setTime(swTime);
            setIsRunning(swRunning);
          }
        }
        
        if (countdown) {
          let cdTime = countdown.time || 0;
          let cdRunning = countdown.isRunning || false;
          const cdTargetTime = countdown.targetTime || 0;
          const cdInputMinutes = countdown.inputMinutes || "";
          const cdInputSeconds = countdown.inputSeconds || "";
          
          if (cdRunning && lastSavedTimestamp) {
            const elapsed = Date.now() - lastSavedTimestamp;
            cdTime = cdTime - elapsed;
            if (cdTime <= 0) {
              cdTime = 0;
              cdRunning = false;
              if (savedMode === "countdown") {
                setTimeout(() => {
                  playAlarm(audioRef);
                  showNotification();
                }, 100);
              }
            }
          }
          
          setCountdownState({ 
            time: cdTime, 
            isRunning: cdRunning, 
            targetTime: cdTargetTime,
            inputMinutes: cdInputMinutes,
            inputSeconds: cdInputSeconds
          });
          
          if (savedMode === "countdown") {
            setTime(cdTime);
            setIsRunning(cdRunning);
            setTargetTime(cdTargetTime);
            setInputMinutes(cdInputMinutes);
            setInputSeconds(cdInputSeconds);
          }
        }
      } catch (error) {
        console.log('Error loading saved timer state:', error);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    if (!isLoaded) return;
    
    const currentStopwatch = mode === "stopwatch" 
      ? { time, isRunning } 
      : stopwatchState;
    
    const currentCountdown = mode === "countdown"
      ? { time, isRunning, targetTime, inputMinutes, inputSeconds }
      : countdownState;
    
    const stateToSave = {
      stopwatch: currentStopwatch,
      countdown: currentCountdown,
      mode,
      lastSavedTimestamp: (currentStopwatch.isRunning || currentCountdown.isRunning) ? Date.now() : null
    };
    localStorage.setItem('timerState', JSON.stringify(stateToSave));
  }, [time, isRunning, targetTime, mode, inputMinutes, inputSeconds, isLoaded, stopwatchState, countdownState]);

  // Timer interval effect - updates both stopwatch and countdown in background
  useEffect(() => {
    const interval = setInterval(() => {
      // Update stopwatch if running
      if ((mode === "stopwatch" && isRunning) || (mode !== "stopwatch" && stopwatchState.isRunning)) {
        if (mode === "stopwatch") {
          setTime((prevTime) => prevTime + 10);
        } else {
          setStopwatchState((prev) => ({ ...prev, time: prev.time + 10 }));
        }
      }
      
      // Update countdown if running
      if ((mode === "countdown" && isRunning) || (mode !== "countdown" && countdownState.isRunning)) {
        if (mode === "countdown") {
          setTime((prevTime) => {
            const newTime = prevTime - 10;
            if (newTime <= 0 && !alarmPlayedRef.current) {
              setIsRunning(false);
              alarmPlayedRef.current = true;
              playAlarm(audioRef);
              showNotification();
              return 0;
            }
            return newTime <= 0 ? 0 : newTime;
          });
        } else {
          setCountdownState((prev) => {
            const newTime = prev.time - 10;
            if (newTime <= 0 && prev.isRunning && !alarmPlayedRef.current) {
              alarmPlayedRef.current = true;
              playAlarm(audioRef);
              showNotification();
              return { ...prev, time: 0, isRunning: false };
            }
            return newTime <= 0 ? { ...prev, time: 0, isRunning: false } : { ...prev, time: newTime };
          });
        }
      }
    }, 10);

    intervalRef.current = interval;

    return () => {
      clearInterval(interval);
    };
  }, [isRunning, mode, stopwatchState.isRunning, countdownState.isRunning]);

  const handleStartStop = useCallback(() => {
    if (!isRunning && mode === "countdown" && time === 0) {
      const totalMs = (parseInt(inputMinutes || 0) * 60 + parseInt(inputSeconds || 0)) * 1000;
      if (totalMs > 0) {
        setTime(totalMs);
        setTargetTime(totalMs);
        setIsRunning(true);
        alarmPlayedRef.current = false; // Reset alarm flag for new countdown
        
        if ("Notification" in window && Notification.permission === "default") {
          Notification.requestPermission();
        }
      }
    } else {
      setIsRunning(!isRunning);
    }
  }, [isRunning, mode, time, inputMinutes, inputSeconds]);

  const handleReset = useCallback(() => {
    setIsRunning(false);
    setTime(0);
    setTargetTime(0);
    alarmPlayedRef.current = false; // Reset alarm flag on reset
    
    if (mode === "stopwatch") {
      setStopwatchState({ time: 0, isRunning: false });
    } else {
      setCountdownState({ time: 0, isRunning: false, targetTime: 0, inputMinutes: "", inputSeconds: "" });
      setInputMinutes("");
      setInputSeconds("");
    }
    
    stopAlarm(audioRef);
  }, [mode]);

  const switchMode = useCallback((newMode) => {
    if (newMode === mode) return;
    
    if (mode === "stopwatch") {
      setStopwatchState({ time, isRunning });
    } else {
      setCountdownState({ time, isRunning, targetTime, inputMinutes, inputSeconds });
    }
    
    if (newMode === "stopwatch") {
      setTime(stopwatchState.time);
      setIsRunning(stopwatchState.isRunning);
      setTargetTime(0);
      setInputMinutes("");
      setInputSeconds("");
    } else {
      setTime(countdownState.time);
      setIsRunning(countdownState.isRunning);
      setTargetTime(countdownState.targetTime);
      setInputMinutes(countdownState.inputMinutes);
      setInputSeconds(countdownState.inputSeconds);
    }
    
    setMode(newMode);
  }, [mode, time, isRunning, targetTime, inputMinutes, inputSeconds, stopwatchState, countdownState]);

  return {
    // State
    time,
    isRunning,
    mode,
    inputMinutes,
    inputSeconds,
    
    // Setters
    setInputMinutes,
    setInputSeconds,
    
    // Actions
    handleStartStop,
    handleReset,
    switchMode,
    
    // Utilities
    formatTime,
  };
}