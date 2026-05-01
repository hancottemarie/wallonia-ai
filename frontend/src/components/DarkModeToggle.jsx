import { useState, useEffect } from 'react';

export default function DarkModeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
  const root = window.document.documentElement;

  if (isDark) {
    root.classList.add('dark');
    root.style.colorScheme = 'dark';
  } else {
    root.classList.remove('dark');
    root.style.colorScheme = 'light';
  }
}, [isDark]);

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="fixed top-6 right-6 z-[100] p-4 rounded-2xl shadow-2xl
                 bg-white dark:bg-slate-800 text-2xl hover:scale-110
                 active:scale-95 transition-all duration-300 border border-slate-200 dark:border-slate-700"
    >
      {isDark ? '☀️' : '🌙'}
    </button>
  );
}
