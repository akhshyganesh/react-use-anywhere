import React from 'react';
import { useNavigationFromContext } from '../../lib';

export const Login: React.FC = () => {
  const navigate = useNavigationFromContext();

  const handleGoHome = () => {
    if (navigate) {
      navigate('/');
    }
  };

  return (
    <div className="container">
      <h1>Login Page</h1>
      <p>You were redirected here from a non-React service file using the Hook Injection Pattern!</p>
      <button 
        className="button"
        onClick={handleGoHome}
      >
        Go Back Home
      </button>
      <p className="info">
        This page uses the useNavigationFromContext hook to access the navigation function
        directly from the React context.
      </p>
    </div>
  );
};