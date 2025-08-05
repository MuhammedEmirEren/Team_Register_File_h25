import React from 'react';

const ImageShowcaseModal = ({ 
  selectedImage, 
  onCancel,
}) => {


  return (
    <div className="image-preview-modal-overlay">
      <div className="image-preview-modal">
        <div className="image-preview-header">
          <h3>Original Image </h3>
          <button 
            className="modal-close-btn"
            onClick={onCancel}
            aria-label="Close preview"
          >
            ✕
          </button>
        </div>
        
        <div className="image-preview-content">
          <div className="image-preview-container">
            <img 
              src={selectedImage} 
              alt={"Original Image"}
              className="preview-image"
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default ImageShowcaseModal; 