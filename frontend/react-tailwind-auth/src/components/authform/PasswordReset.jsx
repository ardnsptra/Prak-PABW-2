import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const PasswordResetCard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handlePasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');

    if (!token) {
      alert('Invalid or missing token');
      return;
    }

    try {
      const response = await fetch('http://localhost:3030/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword }),
      });

      if (response.ok) {
        alert('Password reset successfully');
        navigate('/');
      } else {
        const data = await response.json();
        throw new Error(data.message || 'Password reset failed');
      }
    } catch (error) {
      console.error('Password reset error:', error);
      alert('Password reset error');
    }
  };

  return (
    <div className="reset-password-card">
      <div className="card-container absolute w-full h-full flex items-center justify-center flex-col p-5 rounded-lg bg-white/10 backdrop-blur-lg border border-white/30">
        <form onSubmit={handleResetSubmit} className="reset-form">
          <h2>Reset Password</h2>
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={handlePasswordChange}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
          />
          <button type="submit">Reset Password</button>
        </form>
      </div>
    </div>
  );
};

export default PasswordResetCard;