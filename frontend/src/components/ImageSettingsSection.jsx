import React from 'react';
import BackgroundGenerationElement from './BackgroundGenerationElement';

const ImageSettingsSection = ({ 
  currentImage, 
  settings, 
  onSettingChange, 
  onEnhance 
}) => {
  const [showGeneration, setShowGeneration] = React.useState(false);

  const showGenerationPanel = (show) => {
    setShowGeneration(show);
  };

  const closeGenerationPanel = () => {
    setShowGeneration(false);
  };

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

  const handleBackgroundImageClick = (imagePath) => {
    //convert imagepath to base64 to give backend
    fetch(imagePath.src)
      .then(response => response.blob())
      .then(blob => {
        const reader = new FileReader();
        reader.onloadend = () => {
          onSettingChange({
            ...settings,
            background: {background_id: imagePath.id, background_base64: reader.result}
          });
        };
        reader.readAsDataURL(blob);
        console.log('Background image set:', reader.result);
        console.log('Settings updated:', {settings});
      })
      .catch(error => {
        console.error('Error loading background image:', error);
      });
  };

  const sampleImages = [
    {
      id: 1,
      src: '/bg_1.jpeg',
      alt: 'Sample Background 1'
    },
    {
      id: 2,
      src: '/bg_2.jpeg',
      alt: 'Sample Background 2'
    },
    {
      id: 3,
      src: '/bg_3.jpeg',
      alt: 'Sample Background 3'
    },
    {id: 4,
      src: '/bg_4.jpg',
      alt: 'Sample Background 4'
    },
    {id: 5,
      src: '/bg_5.jpg',
      alt: 'Sample Background 5'
    }
  ];

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
              <label>Background: </label>
              <div className="sample-images-grid">
                {sampleImages.map((image) => (
                  <div 
                    key={image.id}
                    className={`sample-image-card ${settings.background.background_id === image.id ? 'selected' : ''}`}
                    onClick={() => handleBackgroundImageClick(image)}
                  >
                    <div className="sample-image-container">
                      <img 
                        src={image.src} 
                        alt={image.alt}
                        className="sample-image"
                      />
                    </div>
                  </div>
                ))}
                <div className="sample-image-card ai-option" onClick={() => showGenerationPanel(true)}>
                  <div className="sample-image-container ai-container">
                    <div className="ai-icon">
                      🤖
                    </div>
                    <span className="ai-label">Generate With AI</span>
                  </div>
                </div>
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
      {showGeneration && (
      <BackgroundGenerationElement
        onClose={closeGenerationPanel}
      />
      )}
    </section>
  );
};

export default ImageSettingsSection; 