import React from 'react';

const ImagePreviewModal = ({ 
  isOpen, 
  selectedImage, 
  optionNumber, 
  onCancel, 
  onConfirm,
  isGeneratingDescription
}) => {
  if (!isOpen) return null;

  return (
    <div className="image-preview-modal-overlay">
      <div className="image-preview-modal">
        <div className="image-preview-header">
          <h3>Preview - Option {optionNumber}</h3>
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
              alt={`Enhanced Option ${optionNumber}`}
              className="preview-image"
            />
          </div>
        </div>
        
        <div className="image-preview-actions">
          <button 
            className="btn btn-secondary"
            onClick={onCancel}
            disabled={isGeneratingDescription}
          >
            Cancel
          </button>
          <button 
            className="btn btn-primary"
            onClick={onConfirm}
            disabled={isGeneratingDescription}
          >
            {isGeneratingDescription ? (
              <>
                <span className="loading-spinner"></span>
                Generating Descriptions...
              </>
            ) : (
              'Confirm Selection'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImagePreviewModal; 