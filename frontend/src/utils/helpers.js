// Helper function to show alerts
export const showAlert = (message, type = 'info') => {
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

// Helper function for delays
export const delay = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// File validation helper
export const validateFile = (file) => {
  // Validate file type
  if (!file.type.startsWith('image/')) {
    showAlert('Please select a valid image file (PNG, JPG, JPEG)', 'error');
    return false;
  }
  
  // Validate file size (10MB max)
  if (file.size > 10 * 1024 * 1024) {
    showAlert('File size must be less than 10MB', 'error');
    return false;
  }
  
  return true;
};

// Download helper function
export const downloadImage = (imageData, filename) => {
  // Create download link
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const img = new Image();
  
  img.onload = function() {
    canvas.width = img.width;
    canvas.height = img.height;
    
    // Apply enhancement filters to canvas
    ctx.filter = 'brightness(1) contrast(1) saturate(1)';
    ctx.drawImage(img, 0, 0);
    
    // Create download link
    canvas.toBlob(function(blob) {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename || `enhanced_image_${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      showAlert('Enhanced image downloaded successfully!', 'success');
    });
  };
  
  img.src = imageData;
}; 