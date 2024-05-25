import React from 'react';
import '../../styles/index.css';
import AuthFlipCard from './AuthFlipCard';

function HomePage() {
  return (
    <div className="App">
      <div className="wave"></div>
      <div className="wave"></div>
      <div className="wave"></div>
      <AuthFlipCard />
    </div>
  );
}

export default HomePage;