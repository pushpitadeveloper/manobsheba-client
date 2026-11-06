"use client";
import { useEffect, useState } from "react";
import { useTheme } from "./Providers";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shrink-0" />
    );
  }

  return (
    <button
      onClick={toggleTheme}
      title={theme === "dark" ? "Light mode" : "Dark mode"}
      className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center justify-center text-lg hover:bg-slate-100 dark:hover:bg-slate-700 shrink-0"
    >
      {theme === "dark" ? "☀️" : "🌙"}
    </button>
  );
}