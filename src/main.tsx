
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Check for dark mode preference immediately to reduce flash of wrong theme
const setInitialTheme = () => {
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const storedTheme = localStorage.getItem('theme');
  
  if (storedTheme === 'dark' || (storedTheme === null && systemPrefersDark)) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

// Execute immediately
setInitialTheme();

createRoot(document.getElementById("root")!).render(<App />);
