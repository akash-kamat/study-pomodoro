import { useState, useEffect } from "react";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { Button } from 'pixel-retroui';
import "./App.css";

type Mode = 'focus' | 'short' | 'long';

const MODES = {
  focus: { time: 25 * 60, text: 'Time to Focus!' },
  short: { time: 5 * 60, text: 'Take a Breath' },
  long: { time: 15 * 60, text: 'Long Rest' }
};

function App() {
  const [mode, setMode] = useState<Mode>('focus');
  const [timeLeft, setTimeLeft] = useState(MODES.focus.time);
  const [isActive, setIsActive] = useState(false);
  const [isPinned, setIsPinned] = useState(false);

  const playNotificationSound = () => {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;

    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 1.5);

    osc.start();
    osc.stop(ctx.currentTime + 1.5);
  };

  useEffect(() => {
    let interval: number | undefined;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      playNotificationSound();
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(MODES[mode].time);
  };

  const switchMode = (newMode: Mode) => {
    setMode(newMode);
    setIsActive(false);
    setTimeLeft(MODES[newMode].time);
  };

  const appWindow = getCurrentWindow();

  const handleClose = () => {
    appWindow.close();
  };

  const togglePin = async () => {
    const newPinnedState = !isPinned;
    setIsPinned(newPinnedState);
    await appWindow.setAlwaysOnTop(newPinnedState);
  };

  return (
    <main className="app-container">
      <div className="titlebar" data-tauri-drag-region>
        <span className="focus-text">{MODES[mode].text}</span>
        <div className="window-controls">
          <button
            className={`pin-button ${isPinned ? 'active' : ''}`}
            onClick={togglePin}
            title="Always on Top"
          ></button>
          <button className="close-button" onClick={handleClose} title="Close"></button>
        </div>
      </div>

      <div className="content">
        <div className="chimmy-sprite"></div>

        <div className="timer-display">
          {Math.floor(timeLeft / 60).toString().padStart(2, '0')}:
          {(timeLeft % 60).toString().padStart(2, '0')}
        </div>

        <div className="timer-controls">
          <button
            onClick={toggleTimer}
            className="control-button start-button"
            title={isActive ? "Pause" : "Start"}
          ></button>
          <button
            onClick={resetTimer}
            className="control-button reset-button"
            title="Reset"
          ></button>
        </div>

        <div className="mode-toggles">
          <Button
            bg="#ff8e8e"
            textColor="#2c2c2c"
            borderColor="#454545"
            shadow="#c45e5e"
            className={`mode-btn-retro ${mode === 'focus' ? 'active' : ''}`}
            onClick={() => switchMode('focus')}
          >
            FOCUS
          </Button>
          <Button
            bg="#8ecae6"
            textColor="#2c2c2c"
            borderColor="#454545"
            shadow="#5e9ac4"
            className={`mode-btn-retro ${mode === 'short' ? 'active' : ''}`}
            onClick={() => switchMode('short')}
          >
            SHORT
          </Button>
          <Button
            bg="#90be6d"
            textColor="#2c2c2c"
            borderColor="#454545"
            shadow="#5e8c4d"
            className={`mode-btn-retro ${mode === 'long' ? 'active' : ''}`}
            onClick={() => switchMode('long')}
          >
            LONG
          </Button>
        </div>
      </div>
    </main>
  );
}

export default App;
