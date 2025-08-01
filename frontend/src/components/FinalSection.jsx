import React, { useState, useEffect } from 'react';

const FinalSection = ({ 
  currentImage, 
  enhancedImageData, 
  settings, 
  generatedTitle, 
  generatedDescription, 
  onDownload, 
  onReset 
}) => {
  const [originalDimensions, setOriginalDimensions] = useState({ width: 0, height: 0 });
  const [enhancedDimensions, setEnhancedDimensions] = useState({ width: 0, height: 0 });
  const [modalImage, setModalImage] = useState(null);
  const [modalTitle, setModalTitle] = useState('');

  // Helper function to get image dimensions
  const getImageDimensions = (base64Data) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.width, height: img.height });
      };
      img.onerror = () => {
        resolve({ width: 0, height: 0 });
      };
      img.src = base64Data;
    });
  };

  // Get dimensions when images change
  useEffect(() => {
    if (currentImage) {
      getImageDimensions(currentImage).then(setOriginalDimensions);
    }
  }, [currentImage]);

  useEffect(() => {
    if (enhancedImageData) {
      getImageDimensions(enhancedImageData).then(setEnhancedDimensions);
    }
  }, [enhancedImageData]);

  const handleImageClick = (imageSrc, title) => {
    setModalImage(imageSrc);
    setModalTitle(title);
  };

  const closeModal = () => {
    setModalImage(null);
    setModalTitle('');
  };

  return (
    <section className="final-section">
      <div className="final-container">
        <div className="comparison-panel">
          <div className="original-panel">
            <h3>🖼️ Original Image</h3>
            <div className="image-display" onClick={() => handleImageClick(currentImage, 'Original Image')}>
              <img src={currentImage} alt="Original" />
            </div>
            <div className="image-info">
              <span>📏 {originalDimensions.width} x {originalDimensions.height}</span>
            </div>
          </div>
          
          <div className="enhanced-panel">
            <h3>✨ Enhanced Image</h3>
            <div className="image-display" onClick={() => handleImageClick(enhancedImageData, 'Enhanced Image')}>
              <img src={enhancedImageData} alt="Enhanced" />
            </div>
            <div className="image-info">
              <span>📏 {enhancedDimensions.width} x {enhancedDimensions.height}</span>
            </div>
          </div>
        </div>
        
        <div className="generation-panel">
          {settings.titleGeneration && (
            <div className="generation-item">
              <h4>📝 Title etc.</h4>
              <div className="generation-content">
                {generatedTitle || 'Generating title...'}
              </div>
            </div>
          )}
          
          {settings.descriptionGeneration && (
            <div className="generation-item">
              <h4>📄 Description etc.</h4>
              <div className="generation-content">
                {generatedDescription || 'Generating description...'}
              </div>
            </div>
          )}
        </div>
        
        <div className="final-actions">
          <button className="btn btn-primary" onClick={onDownload}>
            💾 Download Enhanced Image
          </button>
          <button className="btn btn-secondary" onClick={onReset}>
            ➕ Enhance Another Image
          </button>
        </div>
      </div>

      {/* Image Modal */}
      {modalImage && (
        <div className="image-modal-overlay" onClick={closeModal}>
          <div className="image-modal" onClick={(e) => e.stopPropagation()}>
            <div className="image-modal-header">
              <h3>{modalTitle}</h3>
              <button className="modal-close-btn" onClick={closeModal}>✕</button>
            </div>
            <div className="image-modal-content">
              <img src={modalImage} alt={modalTitle} className="modal-image" />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default FinalSection; 