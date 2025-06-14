import React from 'react';
import { useHookFromContext } from '../../lib';

export const Login: React.FC = () => {
  const navigation = useHookFromContext('navigation');

  const handleGoHome = () => {
    if (navigation) {
      navigation('/');
    }
  };

  return (
    <div className="container">
      <h1>Login Page</h1>
      <p>You were redirected here from a non-React service file using the Hook Injection Pattern!</p>
      <p>This demonstrates router-agnostic navigation - no React Router DOM required!</p>
      
      <button 
        className="button"
        onClick={handleGoHome}
      >
        Go Back Home
      </button>
      
      <p className="info">
        This page uses the <code>useHookFromContext</code> hook to access the navigation function
        directly from the React context. The navigation works with a simple hash-based routing system,
        but could easily be replaced with any router (React Router, Next.js Router, etc.).
      </p>
    </div>
  );
};