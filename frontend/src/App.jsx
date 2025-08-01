import React from 'react';
import './App.css';

// Import components
import Header from './components/Header';
import Footer from './components/Footer';
import UploadSection from './components/UploadSection';
import ImageSettingsSection from './components/ImageSettingsSection';
import ProcessingSection from './components/ProcessingSection';
import SelectionSection from './components/SelectionSection';
import FinalSection from './components/FinalSection';
import FeaturesSection from './components/FeaturesSection';

// Import custom hook
import { useImageEnhancerWithAPI } from './hooks/useImageEnhancerWithAPI';

function App() {
  const {
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
  } = useImageEnhancerWithAPI();

  return (
    <div className="app-wrapper">
      {/* Corner decorations */}
      <div className="corner-decoration top-left"></div>
      <div className="corner-decoration top-right"></div>
      <div className="corner-decoration bottom-left"></div>
      <div className="corner-decoration bottom-right"></div>

      {/* Side decorative elements */}
      <div className="side-decoration left">
        <div className="floating-shapes">
          <div className="floating-shape"></div>
          <div className="floating-shape"></div>
          <div className="floating-shape"></div>
        </div>
      </div>
      <div className="side-decoration right">
        <div className="floating-shapes">
          <div className="floating-shape"></div>
          <div className="floating-shape"></div>
        </div>
      </div>

      <div className="container">
        <Header />

      <main className="main-content">
        {/* Upload Stage */}
        {!currentImage && (
          <UploadSection 
            isDragOver={isDragOver}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onFileSelect={handleFileSelect}
            fileInputRef={fileInputRef}
          />
        )}

        {/* Image and Settings Stage */}
        {currentImage && !showProcessing && !showSelection && !showFinal && (
          <ImageSettingsSection 
            currentImage={currentImage}
            settings={settings}
            onSettingChange={setSettings}
            onEnhance={handleEnhance}
          />
        )}

        {/* Processing Stage */}
        {showProcessing && (
          <ProcessingSection currentStep={currentStep} />
        )}

        {/* Selection Stage */}
        {showSelection && (
          <SelectionSection 
            currentImages={enhancedImages}
            onOptionSelect={handleOptionSelect}
          />
        )}

        {/* Final Stage */}
        {showFinal && (
          <FinalSection 
            currentImage={currentImage}
            enhancedImageData={enhancedImageData}
            settings={settings}
            generatedTitle={generatedTitle}
            generatedDescription={generatedDescription}
            searchUrl={searchUrl}
            onDownload={handleDownload}
            onReset={resetApplication}
            onSearchProduct={getSearchUrl}
          />
        )}

        {/* How it Works Section */}
        {!currentImage && (
          <FeaturesSection />
        )}
      </main>

      <Footer />
      </div>
    </div>
  );
}

export default App;
