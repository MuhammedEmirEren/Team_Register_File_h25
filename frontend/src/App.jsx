import { useState, useRef } from 'react';
import './App.css';

function App() {
  const [currentImage, setCurrentImage] = useState(null);
  const [enhancedImageData, setEnhancedImageData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showProcessing, setShowProcessing] = useState(false);
  const [showSelection, setShowSelection] = useState(false);
  const [showFinal, setShowFinal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [enhancementDetails, setEnhancementDetails] = useState({});
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [generatedTitle, setGeneratedTitle] = useState('');
  const [generatedDescription, setGeneratedDescription] = useState('');
  
  // Settings state
  const [settings, setSettings] = useState({
    background: 'white',
    titleGeneration: true,
    descriptionGeneration: true
  });
  
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
      setShowProcessing(false);
      setShowSelection(false);
      setShowFinal(false);
    };
    reader.readAsDataURL(file);
  };

  const handleEnhance = async () => {
    if (!currentImage) {
      showAlert('Please upload an image first', 'error');
      return;
    }
    
    setShowProcessing(true);
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
      
      // Show selection stage
      showSelectionStage();
      
    } catch (error) {
      console.error('Enhancement process failed:', error);
      showAlert('Enhancement process failed. Please try again.', 'error');
      setIsProcessing(false);
    }
  };

  const showSelectionStage = () => {
    setShowProcessing(false);
    setShowSelection(true);
    setIsProcessing(false);
    
    // Generate mock title and description if enabled
    if (settings.titleGeneration) {
      setGeneratedTitle('Premium Cotton T-Shirt - Comfortable and Stylish');
    }
    if (settings.descriptionGeneration) {
      setGeneratedDescription('High-quality cotton t-shirt with excellent comfort and durability. Perfect for everyday wear with a modern fit and soft texture.');
    }
  };

  const handleOptionSelect = (optionNumber) => {
    setSelectedOption(optionNumber);
    setEnhancedImageData(currentImage); // Using same image as placeholder
    setShowFinal(true);
    setShowSelection(false);
  };

  const resetApplication = () => {
    setCurrentImage(null);
    setEnhancedImageData(null);
    setIsProcessing(false);
    setShowProcessing(false);
    setShowSelection(false);
    setShowFinal(false);
    setCurrentStep(0);
    setEnhancementDetails({});
    setIsDragOver(false);
    setSelectedOption(null);
    setGeneratedTitle('');
    setGeneratedDescription('');
    
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

  const toggleSetting = (setting) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
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
        {/* Upload Stage */}
        {!currentImage && (
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

        {/* Image and Settings Stage */}
        {currentImage && !showProcessing && !showSelection && !showFinal && (
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
                      onClick={() => setSettings(prev => ({
                        ...prev,
                        background: prev.background === 'black' ? 'white' : 'black'
                      }))}
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
                
                <button className="enhance-btn" onClick={handleEnhance}>
                  ✨ Enhance
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Processing Stage */}
        {showProcessing && (
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
                      <h5>Deciding Enhancements</h5>
                      <p>Choosing optimal enhancement strategy...</p>
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
        )}

        {/* Selection Stage */}
        {showSelection && (
          <section className="selection-section">
            <div className="selection-container">
              <h3>🎯 Choose Version</h3>
              <div className="options-grid">
                {[1, 2, 3].map((option) => (
                  <div 
                    key={option} 
                    className="option-card"
                    onClick={() => handleOptionSelect(option)}
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
        )}

        {/* Final Stage */}
        {showFinal && (
          <section className="final-section">
            <div className="final-container">
              <div className="comparison-panel">
                <div className="original-panel">
                  <h3>🖼️ Original Image</h3>
                  <div className="image-display">
                    <img src={currentImage} alt="Original" />
                  </div>
                  <div className="image-info">
                    <span>📏 Original dimensions</span>
                  </div>
                </div>
                
                <div className="enhanced-panel">
                  <h3>✨ Enhanced Image</h3>
                  <div className="image-display">
                    <img src={enhancedImageData} alt="Enhanced" />
                  </div>
                  <div className="image-info">
                    <span>📏 Enhanced dimensions</span>
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
                <button className="btn btn-primary" onClick={downloadEnhancedImage}>
                  💾 Download Enhanced Image
                </button>
                <button className="btn btn-secondary" onClick={resetApplication}>
                  ➕ Enhance Another Image
                </button>
              </div>
            </div>
          </section>
        )}

        {/* How it Works Section */}
        {!currentImage && (
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
                  <h3>Multiple Options</h3>
                  <p>Get three different enhancement versions to choose the perfect one for your needs</p>
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
                  <h3>Smart Generation</h3>
                  <p>Automatically generates titles and descriptions for your enhanced images</p>
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
    </div>
  );
}

export default App;
