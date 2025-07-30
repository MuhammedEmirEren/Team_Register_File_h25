import { useState, useRef } from 'react';
import { showAlert, delay, validateFile, downloadImage } from '../utils/helpers';

export const useImageEnhancer = () => {
  const [currentImage, setCurrentImage] = useState(null);
  const [enhancedImageData, setEnhancedImageData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showProcessing, setShowProcessing] = useState(false);
  const [showSelection, setShowSelection] = useState(false);
  const [showFinal, setShowFinal] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [generatedTitle, setGeneratedTitle] = useState('');
  const [generatedDescription, setGeneratedDescription] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  
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
    if (!validateFile(file)) return;
    
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
    setIsDragOver(false);
    setSelectedOption(null);
    setGeneratedTitle('');
    setGeneratedDescription('');
    
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