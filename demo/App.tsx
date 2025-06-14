import React from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { HookInjectionProvider } from '../lib';
import { Home } from './components/Home';
import { Login } from './components/Login';
import './App.css';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <HookInjectionProvider navigationHook={useNavigate}>
        <AppRoutes />
      </HookInjectionProvider>
    </BrowserRouter>
  );
};

export default App;