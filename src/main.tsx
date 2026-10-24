import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import App from './App';
import { ThemeProvider } from './lib/theme';
import { DemoProvider } from './lib/store';
import { ToastProvider } from './components/ui/Toast';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <MotionConfig reducedMotion="user">
        <ThemeProvider>
          <ToastProvider>
            <DemoProvider>
              <App />
            </DemoProvider>
          </ToastProvider>
        </ThemeProvider>
      </MotionConfig>
    </BrowserRouter>
  </StrictMode>,
);
