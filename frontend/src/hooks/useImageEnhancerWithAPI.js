import { useState, useRef } from 'react';
import { showAlert, delay, validateFile, downloadImage } from '../utils/helpers';
import apiService from '../services/apiService';

export const useImageEnhancerWithAPI = () => {
  const [currentImage, setCurrentImage] = useState(null);
  const [enhancedImageData, setEnhancedImageData] = useState(null);
  const [enhancedImages, setEnhancedImages] = useState({
    option1: null,
    option2: null,
    option3: null
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [showProcessing, setShowProcessing] = useState(false);
  const [showSelection, setShowSelection] = useState(false);
  const [showFinal, setShowFinal] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [generatedTitle, setGeneratedTitle] = useState('');
  const [generatedDescription, setGeneratedDescription] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedImagePath, setUploadedImagePath] = useState(null);

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
      const response = await apiService.enhanceImage(uploadedImagePath);
      
      // Store the enhanced images
      setEnhancedImages({
        option1: response.enhanced_image_1,
        option2: response.enhanced_image_2,
        option3: response.enhanced_image_3
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
      const selectedImage = enhancedImages[`option${optionNumber}`];
      setEnhancedImageData(selectedImage);
      
      // Generate description if enabled
      if (settings.descriptionGeneration) {
        showAlert('Generating description...', 'info');
        const response = await apiService.chooseImageAndGenerateDescription(optionNumber);
        
        // Parse the description response
        if (response.description && typeof response.description === 'string') {
          try {
            const descriptionData = JSON.parse(response.description);
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
      }
      
      // Set a default title if not generated
      if (settings.titleGeneration && !generatedTitle) {
        setGeneratedTitle('Enhanced Product Image');
      }
      
      setShowFinal(true);
      setShowSelection(false);
      
    } catch (error) {
      console.error('Error selecting option:', error);
      showAlert('Error processing selection. Please try again.', 'error');
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
    setUploadedImagePath(null);
    
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
    isDragOver,
    settings,
    fileInputRef,
    
    // Actions
    handleFileSelect,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleEnhance,
    handleOptionSelect,
    resetApplication,
    handleDownload,
    setSettings
  };
};
