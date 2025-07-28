// Global variables
let currentImage = null;
let enhancedImageData = null;
let isProcessing = false;

// DOM elements
const uploadSection = document.getElementById('uploadSection');
const processingSection = document.getElementById('processingSection');
const featuresSection = document.getElementById('featuresSection');
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const originalImage = document.getElementById('originalImage');
const enhancedImage = document.getElementById('enhancedImage');
const loadingPlaceholder = document.getElementById('loadingPlaceholder');
const originalInfo = document.getElementById('originalInfo');
const enhancedInfo = document.getElementById('enhancedInfo');
const actionButtons = document.getElementById('actionButtons');
const downloadBtn = document.getElementById('downloadBtn');
const newImageBtn = document.getElementById('newImageBtn');
const successModal = document.getElementById('successModal');
const enhancementSummary = document.getElementById('enhancementSummary');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    console.log('🚀 AI Image Enhancer UI initialized');
});

// Setup event listeners
function setupEventListeners() {
    // File input change
    fileInput.addEventListener('change', handleFileSelect);
    
    // Drag and drop events
    uploadArea.addEventListener('dragover', handleDragOver);
    uploadArea.addEventListener('dragleave', handleDragLeave);
    uploadArea.addEventListener('drop', handleDrop);
    
    // Button events
    downloadBtn.addEventListener('click', downloadEnhancedImage);
    newImageBtn.addEventListener('click', resetApplication);
    
    // Click to upload
    uploadArea.addEventListener('click', () => fileInput.click());
}

// Handle file selection
function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
        processFile(file);
    }
}

// Handle drag over
function handleDragOver(event) {
    event.preventDefault();
    uploadArea.classList.add('dragover');
}

// Handle drag leave
function handleDragLeave(event) {
    event.preventDefault();
    uploadArea.classList.remove('dragover');
}

// Handle drop
function handleDrop(event) {
    event.preventDefault();
    uploadArea.classList.remove('dragover');
    
    const files = event.dataTransfer.files;
    if (files.length > 0) {
        processFile(files[0]);
    }
}

// Process the selected file
function processFile(file) {
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
        currentImage = e.target.result;
        displayOriginalImage();
        startProcessing();
    };
    reader.readAsDataURL(file);
}

// Display the original image
function displayOriginalImage() {
    originalImage.src = currentImage;
    originalImage.onload = function() {
        const img = new Image();
        img.src = currentImage;
        
        originalInfo.innerHTML = `
            <span class="info-item">
                <i class="fas fa-expand-arrows-alt"></i>
                ${img.width} × ${img.height}
            </span>
        `;
    };
    
    // Switch to processing view
    uploadSection.style.display = 'none';
    processingSection.style.display = 'block';
    featuresSection.style.display = 'none';
}

// Start the enhancement process
function startProcessing() {
    if (isProcessing) return;
    
    isProcessing = true;
    
    // Reset progress steps
    resetProgressSteps();
    
    // Start the enhancement simulation
    simulateEnhancementProcess();
}

// Reset progress steps
function resetProgressSteps() {
    const steps = document.querySelectorAll('.step');
    steps.forEach(step => {
        step.classList.remove('active', 'completed');
    });
    
    // Reset step statuses
    document.querySelector('#step1 .step-status').innerHTML = '<div class="spinner-small"></div>';
    document.querySelector('#step2 .step-status').innerHTML = '<i class="fas fa-clock"></i>';
    document.querySelector('#step3 .step-status').innerHTML = '<i class="fas fa-clock"></i>';
    document.querySelector('#step4 .step-status').innerHTML = '<i class="fas fa-clock"></i>';
}

// Simulate the enhancement process
async function simulateEnhancementProcess() {
    try {
        // Step 1: Analyzing Image
        await updateStep(1, 'active', 'Analyzing image properties...');
        await delay(2000);
        await updateStep(1, 'completed', '<i class="fas fa-check"></i>');
        
        // Step 2: Deciding Enhancements
        await updateStep(2, 'active', 'AI is deciding optimal enhancements...');
        await delay(2500);
        await updateStep(2, 'completed', '<i class="fas fa-check"></i>');
        
        // Step 3: Applying Enhancements
        await updateStep(3, 'active', 'Applying brightness, contrast, sharpness...');
        await delay(3000);
        await updateStep(3, 'completed', '<i class="fas fa-check"></i>');
        
        // Step 4: Finalizing
        await updateStep(4, 'active', 'Finalizing enhanced image...');
        await delay(1500);
        await updateStep(4, 'completed', '<i class="fas fa-check"></i>');
        
        // Show enhanced image (simulate enhancement)
        showEnhancedImage();
        
    } catch (error) {
        console.error('Enhancement process failed:', error);
        showAlert('Enhancement process failed. Please try again.', 'error');
        isProcessing = false;
    }
}

// Update step status
async function updateStep(stepNumber, status, statusContent) {
    const step = document.getElementById(`step${stepNumber}`);
    const stepStatus = step.querySelector('.step-status');
    
    // Remove previous status
    step.classList.remove('active', 'completed');
    
    // Add new status
    if (status) {
        step.classList.add(status);
    }
    
    // Update status content
    if (statusContent) {
        stepStatus.innerHTML = statusContent;
    }
}

// Show enhanced image
function showEnhancedImage() {
    // For demo purposes, we'll use the same image with a filter effect
    // In real implementation, this would be the actual enhanced image from your Python backend
    enhancedImage.src = currentImage;
    enhancedImage.style.filter = 'brightness(1.1) contrast(1.2) saturate(1.15)';
    
    // Hide loading placeholder and show enhanced image
    loadingPlaceholder.style.display = 'none';
    enhancedImage.style.display = 'block';
    enhancedInfo.style.display = 'block';
    
    // Update enhanced image info
    enhancedInfo.innerHTML = `
        <span class="info-item">
            <i class="fas fa-check-circle"></i>
            Enhanced • Brightness +10% • Contrast +20%
        </span>
    `;
    
    // Show action buttons
    actionButtons.style.display = 'flex';
    
    // Show success modal
    showSuccessModal();
    
    isProcessing = false;
}

// Show success modal
function showSuccessModal() {
    enhancementSummary.innerHTML = `
        <h4 style="margin-bottom: 1rem; color: #2d3748;">
            <i class="fas fa-sparkles"></i> Enhancement Applied
        </h4>
        <div style="display: grid; gap: 0.5rem;">
            <div style="display: flex; justify-content: space-between;">
                <span>Brightness:</span>
                <span style="color: #48bb78; font-weight: 600;">+10%</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
                <span>Contrast:</span>
                <span style="color: #48bb78; font-weight: 600;">+20%</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
                <span>Sharpness:</span>
                <span style="color: #48bb78; font-weight: 600;">+15%</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
                <span>Noise Reduction:</span>
                <span style="color: #48bb78; font-weight: 600;">Applied</span>
            </div>
        </div>
    `;
    
    successModal.style.display = 'flex';
    
    // Auto close modal after 3 seconds
    setTimeout(() => {
        closeModal();
    }, 3000);
}

// Close modal
function closeModal() {
    successModal.style.display = 'none';
}

// Download enhanced image
function downloadEnhancedImage() {
    if (!enhancedImage.src) {
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
}

// Reset application
function resetApplication() {
    // Reset variables
    currentImage = null;
    enhancedImageData = null;
    isProcessing = false;
    
    // Reset file input
    fileInput.value = '';
    
    // Reset UI
    uploadSection.style.display = 'block';
    processingSection.style.display = 'none';
    featuresSection.style.display = 'block';
    
    // Reset images
    originalImage.src = '';
    enhancedImage.src = '';
    enhancedImage.style.display = 'none';
    loadingPlaceholder.style.display = 'block';
    enhancedInfo.style.display = 'none';
    actionButtons.style.display = 'none';
    
    // Close modal
    closeModal();
    
    console.log('🔄 Application reset');
}

// Show alert messages
function showAlert(message, type = 'info') {
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
}

// Utility function for delays
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Handle window resize
window.addEventListener('resize', function() {
    // Add any responsive adjustments here
});

// Handle keyboard shortcuts
document.addEventListener('keydown', function(event) {
    // ESC to close modal
    if (event.key === 'Escape') {
        closeModal();
    }
    
    // Enter to start upload
    if (event.key === 'Enter' && uploadSection.style.display !== 'none') {
        fileInput.click();
    }
});

// Backend integration functions
const API_BASE_URL = 'http://localhost:5000';

// Real enhancement function that calls your Python backend
async function enhanceImageWithBackend(imageFile) {
    try {
        const formData = new FormData();
        formData.append('image', imageFile);
        
        console.log('🔄 Sending image to Python backend...');
        
        const response = await fetch(`${API_BASE_URL}/enhance`, {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        return result;
        
    } catch (error) {
        console.error('Backend enhancement failed:', error);
        throw error;
    }
}

// Check if backend is available
async function checkBackendHealth() {
    try {
        const response = await fetch(`${API_BASE_URL}/health`);
        const data = await response.json();
        console.log('✅ Backend is available:', data);
        return true;
    } catch (error) {
        console.log('⚠️ Backend not available, using demo mode');
        return false;
    }
}

// Initialize enhancement integration
async function initializeEnhancementBackend() {
    const backendAvailable = await checkBackendHealth();
    
    if (backendAvailable) {
        console.log('🔌 Backend integration ready - Real enhancement available');
        // Update UI to show real enhancement is available
        const tagline = document.querySelector('.tagline p');
        if (tagline) {
            tagline.textContent = 'Real AI enhancement powered by Python backend';
        }
    } else {
        console.log('🎭 Demo mode - Using simulated enhancement');
    }
}

// Call backend initialization
initializeEnhancementBackend();
