import React, { useEffect } from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom';
import { navigationService } from './services/navigationService';
import { Home } from './components/Home';
import { Login } from './components/Login';
import './App.css';

const App: React.FC = () => {
  const navigate = useNavigate();

  // Here's the key part: Injecting the navigate function into our service
  useEffect(() => {
    navigationService.setNavigate(navigate);
    return () => navigationService.setNavigate(() => {});
  }, [navigate]);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
};

export default App;