import React, { useEffect } from 'react';
import { useHookInjection } from '../../lib';
import { simulateTokenCheck } from '../services/authService';
import { navigationService } from '../services/navigationService';

export const Home: React.FC = () => {
  // Automatically inject navigation hook into the service
  useHookInjection(navigationService, {
    onReady: () => {
      console.log('Navigation service is ready!');
    },
    onError: (error) => {
      console.error('Failed to inject navigation:', error);
    },
  });

  return (
    <div className="container">
      <h1>Home Page</h1>
      <h2>React Hook Injection Pattern Demo</h2>
      <p>This demonstrates how to use React hooks in non-React files using the production-ready library.</p>
      
      <button 
        className="button"
        onClick={simulateTokenCheck}
      >
        Simulate Token Expiry
      </button>
      
      <p className="info">
        Clicking this button will trigger a function in a non-React service file, 
        which will then use the navigation service to redirect to the login page.
      </p>

      <div className="features">
        <h3>Library Features:</h3>
        <ul>
          <li>✅ Production-ready with TypeScript support</li>
          <li>✅ Compatible with React 16.8+ (hooks support)</li>
          <li>✅ No multiple React instances issue</li>
          <li>✅ Works with any React router (react-router-dom, reach-router, etc.)</li>
          <li>✅ Comprehensive error handling</li>
          <li>✅ Singleton and factory patterns</li>
          <li>✅ Automatic hook injection with useHookInjection</li>
        </ul>
      </div>
    </div>
  );
};