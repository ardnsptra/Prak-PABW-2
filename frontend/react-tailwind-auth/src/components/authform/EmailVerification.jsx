import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const EmailVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    const verifyEmail = async () => {
      const queryParams = new URLSearchParams(location.search);
      const token = queryParams.get('token');
      
      if (!token) {
        alert('Invalid verification link');
        return;
      }
      
      try {
        const response = await fetch(`http://localhost:3030/api/auth/verify-email?token=${token}`);
        
        if (response.ok) {
          alert('Email verified successfully. Redirecting to login page.');
          navigate('/');
        } else {
          const data = await response.json();
          throw new Error(data.message || 'Email verification failed');
        }
      } catch (error) {
        console.error('Verification error:', error);
        alert('Verification failed');
      }
    };
    
    verifyEmail();
  }, [location, navigate]);
  
  return (
    <div>
      <h2>Verifying your email...</h2>
    </div>
  );
};

export default EmailVerification;
