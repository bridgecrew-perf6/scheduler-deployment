import { useState } from "react";

export default function useVisualMode(initial) {
  // const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  const transition = function (newMode, replace = false) {
    if (replace === true) {
      // setMode(newMode)
      setHistory(prev => { return [...prev.slice(0, prev.length - 1), newMode] })
    }
    else {
      // setMode(newMode)
      setHistory((prev) => [...prev, newMode])
    }
  }

  const back = function () {
    if (history.length >= 2) {
      // setMode(history[history.length - 2])
      setHistory(prev => {
        return prev.slice(0, prev.length - 1)
      })
    }

  }
  const mode = history[history.length-1]
  return { mode, transition, back };
}