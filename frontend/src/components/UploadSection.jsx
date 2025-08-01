import React from 'react';

const UploadSection = ({ 
  isDragOver, 
  onDragOver, 
  onDragLeave, 
  onDrop, 
  onFileSelect, 
  fileInputRef 
}) => {
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
    </section>
  );
};

export default UploadSection; 