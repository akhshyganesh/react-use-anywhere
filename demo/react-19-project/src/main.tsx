import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { configureLogging } from 'react-use-anywhere';

// Enable logging in development for debugging
// This is disabled by default to keep console clean
if (import.meta.env.DEV) {
  configureLogging({ enabled: true });
}

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
