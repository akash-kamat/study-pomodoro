import { useState, useEffect } from "react";
import { getCurrentWindow } from "@tauri-apps/api/window";
import "./App.css";

function App() {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: number | undefined;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(25 * 60);
  };

  const appWindow = getCurrentWindow();

  const handleClose = () => {
    appWindow.close();
  };

  return (
    <main className="app-container">
      <div className="titlebar" data-tauri-drag-region>
        <div className="window-controls">
          <span className="focus-text">focus work</span>
          <button className="close-button" onClick={handleClose} title="Close"></button>
        </div>
      </div>

      <div className="content">
        <div className="timer-display">
          {Math.floor(timeLeft / 60).toString().padStart(2, '0')}:
          {(timeLeft % 60).toString().padStart(2, '0')}
        </div>

        <div className="timer-controls">
          <button onClick={toggleTimer} className="pixel-btn">
            {isActive ? "PAUSE" : "START"}
          </button>
          <button onClick={resetTimer} className="pixel-btn">
            RESET
          </button>
        </div>
      </div>
    </main>
  );
}

export default App;
