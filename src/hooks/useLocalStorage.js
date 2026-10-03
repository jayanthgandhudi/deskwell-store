import { useEffect, useState } from "react";

export function readStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback; // storage blocked or corrupted JSON
  }
}

export function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => readStorage(key, initial));
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* ignore: the app still works without persistence */
    }
  }, [key, value]);
  return [value, setValue];
}
