import React from 'react';

const ProcessingSection = ({ currentStep }) => {
  const getStepStatus = (stepNumber) => {
    if (currentStep > stepNumber) return 'completed';
    if (currentStep === stepNumber) return 'active';
    return 'pending';
  };

  const getStepIcon = (stepNumber) => {
    const status = getStepStatus(stepNumber);
    if (status === 'completed') return '✓';
    if (status === 'active') return <div className="spinner-small"></div>;
    return '⏱';
  };

  return (
    <section className="processing-section">
      <div className="processing-container">
        <div className="enhancement-progress">
          <h4>⚙️ AI Enhancement Process</h4>
          <div className="progress-steps">
            <div className={`step ${getStepStatus(1)}`}>
              <div className="step-icon">
                🔍
              </div>
              <div className="step-content">
                <h5>Analyzing Image</h5>
                <p>AI is examining your image properties...</p>
              </div>
              <div className="step-status">
                {getStepIcon(1)}
              </div>
            </div>
            
            <div className={`step ${getStepStatus(2)}`}>
              <div className="step-icon">
                🧠
              </div>
              <div className="step-content">
                <h5>Detecting Object</h5>
                <p>AI is identifying objects within the image...</p>
              </div>
              <div className="step-status">
                {getStepIcon(2)}
              </div>
            </div>
            
            <div className={`step ${getStepStatus(3)}`}>
              <div className="step-icon">
                ⚡
              </div>
              <div className="step-content">
                <h5>Applying Enhancements</h5>
                <p>Brightness, contrast, sharpness optimization...</p>
              </div>
              <div className="step-status">
                {getStepIcon(3)}
              </div>
            </div>
            
            <div className={`step ${getStepStatus(4)}`}>
              <div className="step-icon">
                ✨
              </div>
              <div className="step-content">
                <h5>Ready for Selection</h5>
                <p>Your enhanced options are ready!</p>
              </div>
              <div className="step-status">
                {getStepIcon(4)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessingSection; 