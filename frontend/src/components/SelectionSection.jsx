import React, { useState } from 'react';
import ImagePreviewModal from './ImagePreviewModal';

const SelectionSection = ({ currentImages, onOptionSelect }) => {
  const [previewModal, setPreviewModal] = useState({
    isOpen: false,
    selectedImage: null,
    optionNumber: null
  });

  const handleOptionClick = (optionNumber) => {
    setPreviewModal({
      isOpen: true,
      selectedImage: currentImages[`option${optionNumber}`],
      optionNumber: optionNumber
    });
  };

  const handleCancelPreview = () => {
    setPreviewModal({
      isOpen: false,
      selectedImage: null,
      optionNumber: null
    });
  };

  const handleConfirmSelection = () => {
    onOptionSelect(previewModal.optionNumber);
    setPreviewModal({
      isOpen: false,
      selectedImage: null,
      optionNumber: null
    });
  };

  return (
    <section className="selection-section">
      <div className="selection-container">
        <h3>🎯 Choose Version</h3>
        <p className="selection-instruction">Click on any option to preview it in full size</p>
        <div className="options-grid">
          {[1, 2, 3].map((option) => (
            <div 
              key={option} 
              className="option-card"
              onClick={() => handleOptionClick(option)}
            >
              <div className="option-label">Option {option}</div>
              <div className="option-image">
                <img src={currentImages[`option${option}`]} alt={`Option ${option}`} />
              </div>
              <div className="option-info">
                <span>📏 1000 x 1004</span>
                <span className="preview-hint">Click to preview</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ImagePreviewModal
        isOpen={previewModal.isOpen}
        selectedImage={previewModal.selectedImage}
        optionNumber={previewModal.optionNumber}
        onCancel={handleCancelPreview}
        onConfirm={handleConfirmSelection}
      />
    </section>
  );
};

export default SelectionSection; 