import React, { useRef, useState } from 'react';
import apiService from '../services/apiService';

const BackgroundGenerationElement = ({ onClose, onBackgroundGenerated }) => {
    const [generatedImage, setGeneratedImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const inputRef = useRef(null);

    const handleGenerateImage = async () => {
        const prompt = inputRef.current.value.trim();
        
        if (!prompt) {
            setError('Please enter a prompt for the background image');
            return;
        }

        setLoading(true);
        setError(null);
        
        try {
            const image = await apiService.generateBackgroundImage(prompt);
            setGeneratedImage(image);
        } catch (error) {
            console.error('Error generating image:', error);
            setError('Failed to generate background image. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleUseBackground = () => {
        if (generatedImage && onBackgroundGenerated) {
            onBackgroundGenerated({
                background_id: 'ai_generated',
                background_base64: generatedImage
            });
        }
        onClose();
    };

    return (
        <div className="canvas-overlay">
            <div className="canvas-modal">
                <div className="canvas-header">
                    <h3>🤖 Generate AI Background</h3>
                    <button className="close-btn" onClick={onClose}>✕</button>
                </div>
                
                <div className="canvas-content">
                    <div className="canvas-container">
                        <div className="bg-generation-form">
                            <div className="control-group">
                                <label>Describe your background:</label>
                                <textarea
                                    ref={inputRef}
                                    className="prompt-input"
                                    placeholder="e.g., Modern office background, Natural forest scene, Abstract geometric pattern..."
                                    rows="4"
                                />
                            </div>
                            
                            {error && (
                                <div className="error-message">
                                    ⚠️ {error}
                                </div>
                            )}
                            
                            <button 
                                className="btn btn-primary" 
                                onClick={handleGenerateImage} 
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="loading-spinner"></span>
                                        Generating...
                                    </>
                                ) : (
                                    '✨ Generate Background'
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="controls-panel">
                        {generatedImage ? (
                            <div className="generated-preview">
                                <h4>Generated Background:</h4>
                                <div className="preview-container">
                                    <img 
                                        src={generatedImage} 
                                        alt="Generated Background" 
                                        className="preview-image"
                                    />
                                </div>
                                <div className="action-buttons">
                                    <button 
                                        className="btn btn-primary" 
                                        onClick={handleUseBackground}
                                    >
                                        Use This Background
                                    </button>
                                    <button 
                                        className="btn btn-secondary" 
                                        onClick={() => setGeneratedImage(null)}
                                    >
                                        Generate New One
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="generation-tips">
                                <h4>💡 Tips for better results:</h4>
                                <ul>
                                    <li>Be specific about colors and style</li>
                                    <li>Mention lighting (bright, soft, dramatic)</li>
                                    <li>Include atmosphere (professional, cozy, modern)</li>
                                    <li>Avoid complex scenes with people</li>
                                </ul>
                                <div className="example-prompts">
                                    <h5>Example prompts:</h5>
                                    <div className="prompt-examples">
                                        <span onClick={() => inputRef.current.value = 'Clean white studio background with soft lighting'}>
                                            "Clean white studio background with soft lighting"
                                        </span>
                                        <span onClick={() => inputRef.current.value = 'Modern office interior with plants and natural light'}>
                                            "Modern office interior with plants and natural light"
                                        </span>
                                        <span onClick={() => inputRef.current.value = 'Abstract gradient background in blue and purple tones'}>
                                            "Abstract gradient background in blue and purple tones"
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BackgroundGenerationElement;
