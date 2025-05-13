
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { TaskProvider } from './context/TaskContext';
import { Toaster } from './components/ui/toaster';
import { CategoryProvider } from './context/CategoryContext';

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <AuthProvider>
      <TaskProvider>
        <App />
        <Toaster />
      </TaskProvider>
    </AuthProvider>
  </BrowserRouter>
);
