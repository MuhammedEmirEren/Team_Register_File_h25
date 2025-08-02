import { useState, useRef } from 'react';
import { showAlert, delay, validateFile, downloadImage } from '../utils/helpers';
import apiService from '../services/apiService';

// Helper function to get image dimensions from base64 data
const getImageDimensions = (base64Data) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
    };
    img.onerror = () => {
      resolve({ width: 0, height: 0 });
    };
    img.src = base64Data;
  });
};

export const useImageEnhancerWithAPI = () => {
  const [currentImage, setCurrentImage] = useState(null);
  const [enhancedImageData, setEnhancedImageData] = useState(null);
  const [enhancedImages, setEnhancedImages] = useState({
    option1: { image: null, dimensions: { width: 0, height: 0 } },
    option2: { image: null, dimensions: { width: 0, height: 0 } },
    option3: { image: null, dimensions: { width: 0, height: 0 } }
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [showProcessing, setShowProcessing] = useState(false);
  const [showSelection, setShowSelection] = useState(false);
  const [showFinal, setShowFinal] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [generatedTitle, setGeneratedTitle] = useState('');
  const [generatedDescription, setGeneratedDescription] = useState('');
  const [searchUrl, setSearchUrl] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedImagePath, setUploadedImagePath] = useState(null);
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);

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

  const processFile = async (file) => {
    if (!validateFile(file)) return;
    
    try {
      // Read and display the file
      const reader = new FileReader();
      reader.onload = function(e) {
        setCurrentImage(e.target.result);
        setShowProcessing(false);
        setShowSelection(false);
        setShowFinal(false);
        setSearchUrl('');
      };
      reader.readAsDataURL(file);

      // Upload the file to the server
      showAlert('Uploading image...', 'info');
      const imagePath = await apiService.uploadImage(file);
      setUploadedImagePath(imagePath);
      showAlert('Image uploaded successfully!', 'success');
      
    } catch (error) {
      console.error('Error processing file:', error);
      showAlert('Error uploading image. Please try again.', 'error');
    }
  };

  const handleEnhance = async () => {
    if (!currentImage || !uploadedImagePath) {
      showAlert('Please upload an image first', 'error');
      return;
    }
    
    setShowProcessing(true);
    setIsProcessing(true);
    setCurrentStep(0);
    setSearchUrl('');
    
    try {
      await enhanceImageWithAPI();
    } catch (error) {
      console.error('Enhancement failed:', error);
      showAlert('Enhancement process failed. Please try again.', 'error');
      setIsProcessing(false);
      setShowProcessing(false);
    }
  };

  const enhanceImageWithAPI = async () => {
    try {
      // Step 1: Object Detection
      setCurrentStep(1);
      await delay(1000);
      
      // Step 2: Background Removal
      setCurrentStep(2);
      await delay(1000);
      
      // Step 3: Applying Enhancements
      setCurrentStep(3);
      
      // Call your actual API
      const response = await apiService.enhanceImage(uploadedImagePath, settings.background);
      
      // Get dimensions for each enhanced image
      const dimensions1 = await getImageDimensions(response.enhanced_image_1);
      const dimensions2 = await getImageDimensions(response.enhanced_image_2);
      const dimensions3 = await getImageDimensions(response.enhanced_image_3);
      
      // Store the enhanced images with their dimensions
      setEnhancedImages({
        option1: { image: response.enhanced_image_1, dimensions: dimensions1 },
        option2: { image: response.enhanced_image_2, dimensions: dimensions2 },
        option3: { image: response.enhanced_image_3, dimensions: dimensions3 }
      });
      
      // Step 4: Finalizing
      setCurrentStep(4);
      await delay(1000);
      
      // Show selection stage
      showSelectionStage();
      
    } catch (error) {
      console.error('Enhancement process failed:', error);
      throw error;
    }
  };

  const showSelectionStage = () => {
    setShowProcessing(false);
    setShowSelection(true);
    setIsProcessing(false);
  };

  const handleOptionSelect = async (optionNumber) => {
    try {
      setSelectedOption(optionNumber);
      
      // Get the selected enhanced image
      const selectedImageData = enhancedImages[`option${optionNumber}`];
      setEnhancedImageData(selectedImageData.image);

      // Show final section immediately so loading state is visible
      setShowFinal(true);
      setShowSelection(false);

      if(settings.descriptionGeneration || settings.titleGeneration) {
        // Set loading state for description generation
        setIsGeneratingDescription(true);
        
        // Generate description if enabled
        showAlert('Generating description...', 'info');
        const response = await apiService.chooseImageAndGenerateDescription(optionNumber);
        console.log('Response from API:', response);
        // Parse the description response
        if (response.description) {
          try {
            const descriptionData = JSON.parse(response.description);
            console.log('Parsed description data:', descriptionData);
            if (descriptionData.title) setGeneratedTitle(descriptionData.title);
            if (descriptionData.description) setGeneratedDescription(descriptionData.description);
          } catch (e) {
            // If it's not JSON, use as plain text
            setGeneratedDescription(response.description);
          }
        }
        else
        {
          setGeneratedDescription('No description generated or it is not in the expected format.');
        }
        
        console.log('Generated Title:', generatedTitle);
        console.log('Generated Description:', generatedDescription);
        // Set a default title if not generated
        /*
        if (settings.titleGeneration && !generatedTitle) {
          setGeneratedTitle('Enhanced Product Image');
        }*/
      }
      
      // Clear loading state
      setIsGeneratingDescription(false);
      
    } catch (error) {
      console.error('Error selecting option:', error);
      showAlert('Error processing selection. Please try again.', 'error');
      setIsGeneratingDescription(false);
    }
  };

  const resetApplication = () => {
    setCurrentImage(null);
    setEnhancedImageData(null);
    setEnhancedImages({
      option1: null,
      option2: null,
      option3: null
    });
    setIsProcessing(false);
    setShowProcessing(false);
    setShowSelection(false);
    setShowFinal(false);
    setCurrentStep(0);
    setIsDragOver(false);
    setSelectedOption(null);
    setGeneratedTitle('');
    setGeneratedDescription('');
    setSearchUrl('');
    setUploadedImagePath(null);
    setIsGeneratingDescription(false);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDownload = () => {
    if (!enhancedImageData) {
      showAlert('No enhanced image available for download', 'error');
      return;
    }
    
    downloadImage(enhancedImageData);
  };

  const getSearchUrl = async (query) => {
    try {
      console.log('Searching for:', query);
      const url = await apiService.searchProduct(query);
      setSearchUrl(url);
      console.log('API returned URL:', url);
      console.log('Search URL state updated to:', url);
      return url;
    } catch (error) {
      console.error('Error searching product:', error);
      showAlert('Error searching product. Please try again.', 'error');
    }
  };

  return {
    // State
    currentImage,
    enhancedImageData,
    enhancedImages,
    isProcessing,
    showProcessing,
    showSelection,
    showFinal,
    currentStep,
    selectedOption,
    generatedTitle,
    generatedDescription,
    searchUrl,
    isDragOver,
    settings,
    fileInputRef,
    isGeneratingDescription,
    
    // Actions
    handleFileSelect,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleEnhance,
    handleOptionSelect,
    resetApplication,
    handleDownload,
    getSearchUrl,
    setSettings
  };
};
