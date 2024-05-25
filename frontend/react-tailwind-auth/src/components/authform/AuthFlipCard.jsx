import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';

const AuthFlipCard = () => {
  const navigate = useNavigate();
  const [isFlipped, setIsFlipped] = useState(false);
  const [isReset, setIsReset] = useState(false);
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });
  const [registerData, setRegisterData] = useState({
    username: '',
    email: '',
    password: '',
    fullName: '',
    dateOfBirth: '',
    photoProfile: null,
  });
  const [resetEmail, setResetEmail] = useState('');

  const flipCard = () => setIsFlipped(!isFlipped);
  const toggleReset = (e) => {
    e.preventDefault();
    setIsReset(!isReset);
    setResetEmail('');
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prev => ({ ...prev, [name]: value }));
  };

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterData(prev => ({ ...prev, [name]: value }));
  };

  const handleRegisterPhotoChange = (e) => {
    setRegisterData(prev => ({ ...prev, photoProfile: e.target.files[0] }));
  };

  const handleResetEmailChange = (e) => {
    setResetEmail(e.target.value);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!loginData.email.trim() || !loginData.password.trim()) {
      Swal.fire('Error', 'Email and Password are required', 'error');
      return;
    }
    try {
      const response = await fetch('http://localhost:3030/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();
      if (response.ok) {
        Cookies.set('token', data.token, { expires: 1 });
        setLoginData({ email: '', password: '' });
        navigate('/home');
      } else {
        throw new Error(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      Swal.fire('Error', 'Login error', 'error');
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('username', registerData.username);
    formData.append('email', registerData.email);
    formData.append('password', registerData.password);
    formData.append('fullName', registerData.fullName);
    formData.append('dateOfBirth', registerData.dateOfBirth);
    if (registerData.photoProfile) {
      formData.append('profile', registerData.photoProfile);
    }

    const isAnyFieldEmpty = Object.values(registerData).some(value => value === '' || value === null);
    if (isAnyFieldEmpty) {
      Swal.fire('Error', 'Please fill in all the fields', 'error');
      return;
    }

    try {
      const response = await fetch('http://localhost:3030/api/auth/register', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // const result = await response.json();
      setRegisterData({
        username: '',
        email: '',
        password: '',
        fullName: '',
        dateOfBirth: '',
        photoProfile: null,
      });
      Swal.fire('Success', 'Register successful. Redirecting to Gmail for email verification.', 'success')
      .then(() => {
        window.location.href = 'https://mail.google.com';
      });
    } catch (error) {
      console.error('Register failed:', error);
      Swal.fire('Error', 'Register Failed', 'error');
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    if (!resetEmail.trim()) {
      Swal.fire('Error', 'Please enter your email', 'error');
      return;
    }

    try {
      const response = await fetch('http://localhost:3030/api/auth/request-password-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail }),
      });

      if (response.ok) {
        Swal.fire('Success', 'Password reset link has been sent to your email.', 'success')
        .then(() => {
          window.location.href = 'https://mail.google.com';
        });
      setResetEmail('');
      } else {
        const data = await response.json();
        throw new Error(data.message || 'Password reset failed');
      }
    } catch (error) {
      console.error('Password reset error:', error);
      Swal.fire('Error', 'Password reset error', 'error');
    }
  };

  return (
    <div className="flip-card">
      <div className={`flip-card-inner ${isFlipped ? 'is-flipped' : ''} relative`}>
        <div className="flip-card-front absolute w-full h-full flex items-center justify-center flex-col p-5 rounded-lg bg-white/10 backdrop-blur-lg border border-white/30">
          {!isReset ? (
            <form onSubmit={handleLoginSubmit} className="w-full">
              <h2 className="text-center text-xl font-semibold">Sign in to your account</h2>
              <input
                type="email"
                name="email"
                placeholder="Email address"
                onChange={handleLoginChange}
                value={loginData.email}
                className="mt-2 p-2 rounded border w-full max-w-md"
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                onChange={handleLoginChange}
                value={loginData.password}
                className="mt-2 p-2 rounded border w-full max-w-md"
              />
              <button type="submit" className="mt-2 p-2 rounded bg-blue-500 text-white w-full max-w-md">Sign in</button>
              <button type="button" onClick={flipCard} className="mt-2 p-2 rounded bg-yellow-500 text-white w-full max-w-md">Go to Register</button>
              <p className="mt-2 text-black cursor-pointer" onClick={toggleReset}>Forgot Password?</p>
            </form>
          ) : (
            <form onSubmit={handleResetSubmit} className="w-full">
              <h2 className="text-center text-xl font-semibold">Reset Password</h2>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                onChange={handleResetEmailChange}
                value={resetEmail}
                className="mt-2 p-2 rounded border w-full max-w-md"
              />
              <button type="submit" className="mt-2 p-2 rounded bg-green-500 text-white w-full max-w-md">Send Reset Link</button>
              <button type="button" onClick={toggleReset} className="mt-2 p-2 rounded bg-blue-500 text-white w-full max-w-md">Back to Login</button>
            </form>
          )}
        </div>
        <div className="flip-card-back absolute w-full h-full flex items-center justify-center flex-col p-5 rounded-lg bg-white/10 backdrop-blur-lg border border-white/30">
          <form onSubmit={handleRegisterSubmit} className="w-full">
            <h2 className="text-center text-xl font-semibold">Register for an account</h2>
            <input
              type="text"
              name="username"
              placeholder="Username"
              onChange={handleRegisterChange}
              value={registerData.username}
              className="mt-2 p-2 rounded border w-full max-w-md"
            />
            <input
              type="email"
              name="email"
              placeholder="Email address"
              onChange={handleRegisterChange}
              value={registerData.email}
              className="mt-2 p-2 rounded border w-full max-w-md"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleRegisterChange}
              value={registerData.password}
              className="mt-2 p-2 rounded border w-full max-w-md"
            />
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              onChange={handleRegisterChange}
              value={registerData.fullName}
              className="mt-2 p-2 rounded border w-full max-w-md"
            />
            <input
              type="date"
              name="dateOfBirth"
              placeholder="Date of Birth"
              onChange={handleRegisterChange}
              value={registerData.dateOfBirth}
              className="mt-2 p-2 rounded border w-full max-w-md"
            />
            <input
              type="file"
              name="photoProfile"
              onChange={handleRegisterPhotoChange}
              className="mt-2 w-full max-w-md"
            />
            <button type="submit" className="mt-2 p-2 rounded bg-green-500 text-white w-full max-w-md">Register</button>
          </form>
          <button onClick={flipCard} className="mt-2 p-2 rounded bg-blue-500 text-white w-full max-w-md">Go to Sign In</button>
        </div>
      </div>
    </div>
  );
};

export default AuthFlipCard;
