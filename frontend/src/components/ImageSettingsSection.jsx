import React from 'react';

const ImageSettingsSection = ({ 
  currentImage, 
  settings, 
  onSettingChange, 
  onEnhance 
}) => {
  const toggleSetting = (setting) => {
    onSettingChange({
      ...settings,
      [setting]: !settings[setting]
    });
  };

  const toggleBackground = () => {
    onSettingChange({
      ...settings,
      background: settings.background === 'black' ? 'white' : 'black'
    });
  };

  return (
    <section className="image-settings-section">
      <div className="image-settings-container">
        <div className="image-panel">
          <h3>🖼️ Original Image</h3>
          <div className="image-display">
            <img src={currentImage} alt="Original" />
          </div>
          <div className="image-info">
            <span>📏 Image loaded</span>
          </div>
        </div>
        
        <div className="settings-panel">
          <h3>⚙️ Choose Settings</h3>
          <div className="settings-options">
            <div className="setting-item">
              <label>Background: {settings.background === 'black' ? 'Black' : 'White'}</label>
              <div 
                className={`toggle ${settings.background === 'black' ? 'active' : ''}`}
                onClick={toggleBackground}
              >
                <div className="toggle-slider"></div>
              </div>
            </div>
            
            <div className="setting-item">
              <label>Title Generation</label>
              <input 
                type="checkbox" 
                checked={settings.titleGeneration}
                onChange={() => toggleSetting('titleGeneration')}
              />
            </div>
            
            <div className="setting-item">
              <label>Description Generation</label>
              <input 
                type="checkbox" 
                checked={settings.descriptionGeneration}
                onChange={() => toggleSetting('descriptionGeneration')}
              />
            </div>
          </div>
          
          <button className="enhance-btn" onClick={onEnhance}>
            ✨ Enhance
          </button>
        </div>
      </div>
    </section>
  );
};

export default ImageSettingsSection; 