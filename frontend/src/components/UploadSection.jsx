import React from 'react';

const UploadSection = ({ 
  isDragOver, 
  onDragOver, 
  onDragLeave, 
  onDrop, 
  onFileSelect, 
  fileInputRef 
}) => {
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
      </div>
    </section>
  );
};

export default UploadSection; 