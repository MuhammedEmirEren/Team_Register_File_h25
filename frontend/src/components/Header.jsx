import React from 'react';

const Header = () => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <img src="/logo.png" alt="Logo" className="logo-image" />
          <span style={{fontSize: '2rem', marginRight: '0.75rem'}}></span>
          <h1>GLOWii</h1>
        </div>
        <div className="tagline">
          <p>Intelligent product preparation for e-commerce</p>
        </div>
      </div>
    </header>
  );
};

export default Header; 