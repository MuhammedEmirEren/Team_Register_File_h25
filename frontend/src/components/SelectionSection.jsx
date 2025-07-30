import React from 'react';

const SelectionSection = ({ currentImage, onOptionSelect }) => {
  return (
    <section className="selection-section">
      <div className="selection-container">
        <h3>🎯 Choose Version</h3>
        <div className="options-grid">
          {[1, 2, 3].map((option) => (
            <div 
              key={option} 
              className="option-card"
              onClick={() => onOptionSelect(option)}
            >
              <div className="option-label">Option {option}</div>
              <div className="option-image">
                <img src={currentImage} alt={`Option ${option}`} />
              </div>
              <div className="option-info">
                <span>📏 1000 x 1004</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SelectionSection; 