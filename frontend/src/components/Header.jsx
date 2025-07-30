import React from 'react';

const Header = () => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <span style={{fontSize: '2rem', marginRight: '0.75rem'}}>✨</span>
          <h1>AI Image Enhancer</h1>
        </div>
        <div className="tagline">
          <p>Intelligent image enhancement powered by AI</p>
        </div>
      </div>
    </header>
  );
};

export default Header; 