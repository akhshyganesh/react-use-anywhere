import React from 'react';
import { useNavigate } from 'react-router-dom';

export const Login: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="container">
      <h1>Login Page</h1>
      <p>You were redirected here from a non-React service file</p>
      <button 
        className="button"
        onClick={() => navigate('/')}
      >
        Go Back Home
      </button>
    </div>
  );
};