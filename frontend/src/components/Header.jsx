import React from 'react';

const Header = () => {
  const handleLogoClick = () => {
    window.location.reload();
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
          <img src="/logo.png" alt="Logo" className="logo-image" />
          <span style={{fontSize: '2rem', marginRight: '0.75rem'}}></span>
          <h1>GLOWii</h1>
        </div>
        <div className="tagline">
          <p>Intelligent product preparation for e-commerce &nbsp;&nbsp;</p>
        </div>
      </div>
    </header>
  );
};

export default Header; 