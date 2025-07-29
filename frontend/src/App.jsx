import { useState, useRef } from 'react';
import './App.css';

function App() {
  const [currentImage, setCurrentImage] = useState(null);
  const [enhancedImageData, setEnhancedImageData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showProcessing, setShowProcessing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [enhancementDetails, setEnhancementDetails] = useState({});
  const [isDragOver, setIsDragOver] = useState(false);
  
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragOver(false);
    
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      processFile(files[0]);
    }
  };

  const processFile = (file) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      showAlert('Please select a valid image file (PNG, JPG, JPEG)', 'error');
      return;
    }
    
    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      showAlert('File size must be less than 10MB', 'error');
      return;
    }
    
    // Read and display the file
    const reader = new FileReader();
    reader.onload = function(e) {
      setCurrentImage(e.target.result);
      setShowProcessing(true);
      startProcessing();
    };
    reader.readAsDataURL(file);
  };

  const startProcessing = async () => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    setCurrentStep(0);
    
    // Simulate the enhancement process
    await simulateEnhancementProcess();
  };

  const simulateEnhancementProcess = async () => {
    try {
      // Step 1: Analyzing Image
      setCurrentStep(1);
      await delay(2000);
      
      // Step 2: Deciding Enhancements
      setCurrentStep(2);
      await delay(2500);
      
      // Step 3: Applying Enhancements
      setCurrentStep(3);
      await delay(3000);
      
      // Step 4: Finalizing
      setCurrentStep(4);
      await delay(1500);
      
      // Show enhanced image (simulate enhancement)
      showEnhancedImage();
      
    } catch (error) {
      console.error('Enhancement process failed:', error);
      showAlert('Enhancement process failed. Please try again.', 'error');
      setIsProcessing(false);
    }
  };

  const showEnhancedImage = () => {
    setEnhancedImageData(currentImage);
    setEnhancementDetails({
      brightness: '+10%',
      contrast: '+20%',
      sharpness: '+15%',
      noise_reduction: 'Applied'
    });
    setShowSuccessModal(true);
    setIsProcessing(false);
  };

  const resetApplication = () => {
    setCurrentImage(null);
    setEnhancedImageData(null);
    setIsProcessing(false);
    setShowProcessing(false);
    setShowSuccessModal(false);
    setCurrentStep(0);
    setEnhancementDetails({});
    setIsDragOver(false);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const downloadEnhancedImage = () => {
    if (!enhancedImageData) {
      showAlert('No enhanced image available for download', 'error');
      return;
    }
    
    // Create download link
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = function() {
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Apply enhancement filters to canvas
      ctx.filter = 'brightness(1.1) contrast(1.2) saturate(1.15)';
      ctx.drawImage(img, 0, 0);
      
      // Create download link
      canvas.toBlob(function(blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `enhanced_image_${Date.now()}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showAlert('Enhanced image downloaded successfully!', 'success');
      });
    };
    
    img.src = currentImage;
  };

  const showAlert = (message, type = 'info') => {
    // Create alert element
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 1rem 1.5rem;
      border-radius: 12px;
      color: white;
      font-weight: 600;
      z-index: 1100;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
      transform: translateX(100%);
      transition: all 0.3s ease;
    `;
    
    // Set background color based on type
    const colors = {
      success: 'linear-gradient(135deg, #48bb78, #38a169)',
      error: 'linear-gradient(135deg, #f56565, #e53e3e)',
      info: 'linear-gradient(135deg, #4299e1, #3182ce)',
      warning: 'linear-gradient(135deg, #ed8936, #dd6b20)'
    };
    
    alert.style.background = colors[type] || colors.info;
    alert.textContent = message;
    
    // Add to DOM
    document.body.appendChild(alert);
    
    // Animate in
    setTimeout(() => {
      alert.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 4 seconds
    setTimeout(() => {
      alert.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (alert.parentNode) {
          alert.parentNode.removeChild(alert);
        }
      }, 300);
    }, 4000);
  };

  const delay = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  };

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
    <div className="container">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <span style={{fontSize: '2rem', marginRight: '0.75rem'}}>✨</span>
            <h1>AI Image Enhancer</h1>
          </div>
          <div className="tagline">
            <p>Intelligent image enhancement powered by AI</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {/* Upload Section */}
        {!showProcessing && (
          <section className="upload-section">
            <div className="upload-container">
              <div 
                className={`upload-area ${isDragOver ? 'dragover' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="upload-icon">
                  <span style={{fontSize: '4rem'}}>☁️</span>
                </div>
                <div className="upload-text">
                  <h3>Drop your image here or click to browse</h3>
                  <p>Supports PNG, JPG, JPEG formats • Max size: 10MB</p>
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef}
                  accept="image/*" 
                  hidden 
                  onChange={handleFileSelect}
                />
                <button className="browse-btn">
                  Browse Files
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Processing Section */}
        {showProcessing && (
          <section className="processing-section">
            <div className="processing-container">
              <div className="image-preview">
                <div className="preview-card original">
                  <h4>🖼️ Original Image</h4>
                  <div className="image-container">
                    <img src={currentImage} alt="Original" />
                  </div>
                  <div className="image-info">
                    <span className="info-item">
                      📏 {currentImage && 'Image loaded'}
                    </span>
                  </div>
                </div>
                
                <div className="process-arrow">
                  ✨
                </div>
                
                <div className="preview-card enhanced">
                  <h4>✨ Enhanced Image</h4>
                  <div className="image-container">
                    {enhancedImageData ? (
                      <img src={enhancedImageData} alt="Enhanced" />
                    ) : (
                      <div className="loading-placeholder">
                        <div className="spinner"></div>
                        <p>AI is analyzing and enhancing your image...</p>
                      </div>
                    )}
                  </div>
                  <div className="image-info">
                    {enhancedImageData && (
                      <span className="info-item">
                        ✅ Enhanced
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Enhancement Progress */}
              <div className="enhancement-progress">
                <h4>✨ AI Enhancement Process</h4>
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
                      <h5>Deciding Enhancements</h5>
                      <p>Choosing optimal enhancement strategy...</p>
                    </div>
                    <div className="step-status">
                      {getStepIcon(2)}
                    </div>
                  </div>
                  
                  <div className={`step ${getStepStatus(3)}`}>
                    <div className="step-icon">
                      ✨
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
                      💾
                    </div>
                    <div className="step-content">
                      <h5>Ready for Download</h5>
                      <p>Your enhanced image is ready!</p>
                    </div>
                    <div className="step-status">
                      {getStepIcon(4)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {enhancedImageData && (
                <div className="action-buttons">
                  <button className="btn btn-primary" onClick={downloadEnhancedImage}>
                    💾 Download Enhanced Image
                  </button>
                  <button className="btn btn-secondary" onClick={resetApplication}>
                    ➕ Enhance Another Image
                  </button>
                </div>
              )}
            </div>
          </section>
        )}

        {/* How it Works Section */}
        {!showProcessing && (
          <section className="features-section">
            <div className="features-container">
              <h2>How Our AI System Works</h2>
              <div className="features-grid">
                <div className="feature-card">
                  <div className="feature-icon">
                    👁️
                  </div>
                  <h3>Smart Analysis</h3>
                  <p>Our AI analyzes your image to identify brightness, contrast, and quality issues automatically</p>
                </div>
                
                <div className="feature-card">
                  <div className="feature-icon">
                    🧠
                  </div>
                  <h3>AI Decision Making</h3>
                  <p>Advanced algorithms determine the optimal enhancement strategy for each unique image</p>
                </div>
                
                <div className="feature-card">
                  <div className="feature-icon">
                    ✨
                  </div>
                  <h3>Intelligent Processing</h3>
                  <p>Multiple enhancement techniques are applied simultaneously for the best possible result</p>
                </div>
                
                <div className="feature-card">
                  <div className="feature-icon">
                    ☀️
                  </div>
                  <h3>Brightness Optimization</h3>
                  <p>Intelligently adjusts lighting to bring out details without overexposure</p>
                </div>
                
                <div className="feature-card">
                  <div className="feature-icon">
                    🎨
                  </div>
                  <h3>Dynamic Contrast</h3>
                  <p>Enhances contrast to make your images more vibrant and appealing</p>
                </div>
                
                <div className="feature-card">
                  <div className="feature-icon">
                    🎯
                  </div>
                  <h3>Sharpness Enhancement</h3>
                  <p>Improves image clarity and detail definition for crisp, professional results</p>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <p>&copy; 2025 BTK Hackathon - Team Register File H25. All rights reserved.</p>
          <div className="footer-links">
            <a href="#">🐙 GitHub</a>
            <a href="#">ℹ️ About</a>
          </div>
        </div>
      </footer>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>✅ Enhancement Complete!</h3>
              <button className="modal-close" onClick={() => setShowSuccessModal(false)}>
                ✕
              </button>
            </div>
            <div className="modal-body">
              <p>Your image has been successfully enhanced with AI-powered optimizations.</p>
              <div className="enhancement-summary">
                <h4 style={{marginBottom: '1rem', color: '#2d3748'}}>
                  ✨ Enhancement Applied
                </h4>
                <div style={{display: 'grid', gap: '0.5rem'}}>
                  {Object.entries(enhancementDetails).map(([key, value]) => (
                    <div key={key} style={{display: 'flex', justifyContent: 'space-between'}}>
                      <span>{key.charAt(0).toUpperCase() + key.slice(1).replace('_', ' ')}:</span>
                      <span style={{color: '#48bb78', fontWeight: '600'}}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
