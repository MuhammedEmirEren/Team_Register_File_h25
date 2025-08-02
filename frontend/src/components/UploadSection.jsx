import React, { useRef } from 'react';

const UploadSection = ({ 
  isDragOver, 
  onDragOver, 
  onDragLeave, 
  onDrop, 
  onFileSelect, 
  fileInputRef 
}) => {
  const cameraInputRef = useRef(null);
  
  const sampleImages = [
    {
      id: 1,
      src: '/sample1.jpg',
      alt: 'Sample Product 1'
    },
    {
      id: 2,
      src: '/sample2.jpg', 
      alt: 'Sample Product 2'
    },
    {
      id: 3,
      src: '/sample3.jpg',
      alt: 'Sample Product 3'
    }
  ];

  const handleSampleImageClick = (imageSrc) => {
    // Create a file object from the sample image
    fetch(imageSrc)
      .then(response => response.blob())
      .then(blob => {
        const file = new File([blob], `sample-${Date.now()}.jpg`, { type: 'image/jpeg' });
        const event = { target: { files: [file] } };
        onFileSelect(event);
      })
      .catch(error => {
        console.error('Error loading sample image:', error);
      });
  };

  const handleCameraCapture = () => {
    // Check if camera is available
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert('Camera is not available on this device/browser. Please use the file upload option instead.');
      return;
    }

    // Create a hidden video element for camera capture
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    // Set video properties
    video.autoplay = true;
    video.playsInline = true;
    video.style.position = 'fixed';
    video.style.top = '0';
    video.style.left = '0';
    video.style.width = '100%';
    video.style.height = '100%';
    video.style.zIndex = '9999';
    video.style.backgroundColor = 'black';
    
    // Add video to DOM
    document.body.appendChild(video);
    
    // Get camera stream
    navigator.mediaDevices.getUserMedia({ 
      video: { 
        facingMode: 'environment', // Use back camera if available
        width: { ideal: 1920 },
        height: { ideal: 1080 }
      } 
    })
    .then(stream => {
      video.srcObject = stream;
      
      // Create capture button
      const captureBtn = document.createElement('button');
      captureBtn.textContent = '📸 Capture Photo';
      captureBtn.style.position = 'fixed';
      captureBtn.style.bottom = '20px';
      captureBtn.style.left = '50%';
      captureBtn.style.transform = 'translateX(-50%)';
      captureBtn.style.zIndex = '10000';
      captureBtn.style.padding = '12px 24px';
      captureBtn.style.backgroundColor = '#007bff';
      captureBtn.style.color = 'white';
      captureBtn.style.border = 'none';
      captureBtn.style.borderRadius = '8px';
      captureBtn.style.fontSize = '16px';
      captureBtn.style.cursor = 'pointer';
      
      // Create cancel button
      const cancelBtn = document.createElement('button');
      cancelBtn.textContent = '❌ Cancel';
      cancelBtn.style.position = 'fixed';
      cancelBtn.style.bottom = '20px';
      cancelBtn.style.right = '20px';
      cancelBtn.style.zIndex = '10000';
      cancelBtn.style.padding = '12px 24px';
      cancelBtn.style.backgroundColor = '#dc3545';
      cancelBtn.style.color = 'white';
      cancelBtn.style.border = 'none';
      cancelBtn.style.borderRadius = '8px';
      cancelBtn.style.fontSize = '16px';
      cancelBtn.style.cursor = 'pointer';
      
      document.body.appendChild(captureBtn);
      document.body.appendChild(cancelBtn);
      
      // Handle capture
      captureBtn.onclick = () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0);
        
        canvas.toBlob(blob => {
          const file = new File([blob], `camera-capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
          const event = { target: { files: [file] } };
          onFileSelect(event);
          
          // Cleanup
          stream.getTracks().forEach(track => track.stop());
          document.body.removeChild(video);
          document.body.removeChild(captureBtn);
          document.body.removeChild(cancelBtn);
        }, 'image/jpeg', 0.9);
      };
      
      // Handle cancel
      cancelBtn.onclick = () => {
        stream.getTracks().forEach(track => track.stop());
        document.body.removeChild(video);
        document.body.removeChild(captureBtn);
        document.body.removeChild(cancelBtn);
      };
    })
    .catch(error => {
      console.error('Error accessing camera:', error);
      alert('Unable to access camera. Please check your browser permissions and try again.');
      document.body.removeChild(video);
    });
  };

  return (
    <section className="upload-section">
      <div className="upload-container">
        <div 
          className={`upload-area ${isDragOver ? 'dragover' : ''}`}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
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
            onChange={onFileSelect}
          />
          <button className="browse-btn">
            Browse Files
          </button>
        </div>

        {/* Camera and Sample Images Section */}
        <div className="camera-and-samples-section">
          {/* Camera Capture Button - Independent */}
          <div className="camera-section">
            <div className="camera-button" onClick={handleCameraCapture}>
              <div className="camera-button-content">
                <div className="camera-icon">
                  <span style={{fontSize: '2.5rem'}}>📷</span>
                </div>
                <div className="camera-text">
                  <span>Take Photo</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sample Images Section */}
          <div className="sample-images-section">
            <div className="sample-images-header">
              <h4>No image? Try one of these:</h4>
            </div>
            <div className="sample-images-grid">
              {sampleImages.map((image) => (
                <div 
                  key={image.id}
                  className="sample-image-card"
                  onClick={() => handleSampleImageClick(image.src)}
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
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UploadSection; 