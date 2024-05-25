import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/authform/login';
import UserProfile from './components/home/profile';
import EmailVerification from './components/authform/EmailVerification';
import PasswordReset from './components/authform/PasswordReset';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<UserProfile />} />
        <Route path="/verify-email" element={<EmailVerification />} />
        <Route path="/reset-password" element={<PasswordReset />} />
      </Routes>
    </Router>
  );
}

export default App;