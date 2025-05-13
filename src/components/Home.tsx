import React from 'react';
import { simulateTokenCheck } from '../services/authService';

export const Home: React.FC = () => {
  return (
    <div className="container">
      <h1>Home Page</h1>
      <p>This demonstrates how to use React hooks in non-React files</p>
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
    </div>
  );
};