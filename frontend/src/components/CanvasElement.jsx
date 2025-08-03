import React, { useRef, useState, useEffect } from 'react';

const CanvasElement = ({ enhancedImageData, onClose }) => {
    const [text, setText] = useState('');
    const [fontSize, setFontSize] = useState(20);
    const [fontColor, setFontColor] = useState('#ffffff');
    const [fontType, setFontType] = useState('Arial');
    const [rotation, setRotation] = useState(0);
    const [position, setPosition] = useState({ x: 50, y: 50 });
    const canvasRef = useRef(null);
    const [isWatermarkAdded, setIsWatermarkAdded] = useState(false);
    const [opacity, setOpacity] = useState(1);
    
    // SVG watermark states
    const [svgFile, setSvgFile] = useState(null);
    const [svgDataUrl, setSvgDataUrl] = useState('');
    const [svgSize, setSvgSize] = useState(100);
    const [svgRotation, setSvgRotation] = useState(0);
    const [svgOpacity, setSvgOpacity] = useState(1);
    const [svgPosition, setSvgPosition] = useState({ x: 100, y: 100 });
    const [svgAspectRatio, setSvgAspectRatio] = useState(1); // Store original aspect ratio

    // Watermark visibility toggles
    const [showTextWatermark, setShowTextWatermark] = useState(false);
    const [showSvgWatermark, setShowSvgWatermark] = useState(false);

    // Cache for base image
    const baseImageRef = useRef(null);
    const svgImageRef = useRef(null);

    // Load base image once
    useEffect(() => {
        if (enhancedImageData && !baseImageRef.current) {
            const img = new Image();
            img.onload = () => {
                baseImageRef.current = img;
                drawCanvas();
            };
            img.src = enhancedImageData;
        } else if (baseImageRef.current) {
            drawCanvas();
        }
    }, [enhancedImageData]);

    // Load SVG image once
    useEffect(() => {
        if (svgDataUrl && !svgImageRef.current) {
            const img = new Image();
            img.onload = () => {
                svgImageRef.current = img;
                drawCanvas();
            };
            img.src = svgDataUrl;
        } else if (svgImageRef.current) {
            drawCanvas();
        }
    }, [svgDataUrl]);

    // Draw canvas only when watermark properties change
    useEffect(() => {
        if (baseImageRef.current) {
            drawCanvas();
        }
    }, [text, fontSize, fontColor, fontType, rotation, position, opacity, 
        svgSize, svgRotation, svgOpacity, svgPosition, svgAspectRatio,
        showTextWatermark, showSvgWatermark]);

    const drawCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas || !baseImageRef.current) return;
        
        const ctx = canvas.getContext('2d');

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw base image
        ctx.drawImage(baseImageRef.current, 0, 0, canvas.width, canvas.height);
        
        // Draw text watermark
        if (text && showTextWatermark) {
            ctx.save();
            ctx.translate(position.x, position.y);
            ctx.rotate((rotation * Math.PI) / 180);
            ctx.font = `${fontSize}px ${fontType}`;
            ctx.fillStyle = fontColor;
            ctx.lineWidth = 1;
            ctx.globalAlpha = opacity;

            ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
            ctx.shadowOffsetX = 2;
            ctx.shadowOffsetY = 2;
            ctx.shadowBlur = 4;
            
            ctx.fillText(text, 0, 0);
            ctx.restore();
        }
        
        // Draw SVG watermark
        if (svgImageRef.current && showSvgWatermark) {
            ctx.save();
            ctx.translate(svgPosition.x, svgPosition.y);
            ctx.rotate((svgRotation * Math.PI) / 180);
            ctx.globalAlpha = svgOpacity;
            
            // Calculate dimensions maintaining aspect ratio
            const width = svgSize;
            const height = svgSize / svgAspectRatio;
            
            // Calculate center offset for rotation
            const centerX = width / 2;
            const centerY = height / 2;
            ctx.drawImage(svgImageRef.current, -centerX, -centerY, width, height);
            ctx.restore();
        }
    };

    const handleSvgFileUpload = (event) => {
        const file = event.target.files[0];
        if (file && file.type === 'image/svg+xml') {
            setSvgFile(file);
            const reader = new FileReader();
            reader.onload = (e) => {
                const svgDataUrl = e.target.result;
                setSvgDataUrl(svgDataUrl);
                setShowSvgWatermark(true);
                
                // Calculate aspect ratio from SVG
                const img = new Image();
                img.onload = () => {
                    setSvgAspectRatio(img.width / img.height);
                };
                img.src = svgDataUrl;
            };
            reader.readAsDataURL(file);
        } else {
            alert('Please select a valid SVG file');
        }
    };

    const drawWatermark = () => {
        drawCanvas();
        setIsWatermarkAdded(true);
    };

    const handleDownload = () => {
        const canvas = canvasRef.current;
        const link = document.createElement('a');
        link.download = 'watermarked-image.png';
        link.href = canvas.toDataURL();
        link.click();
    };

    const handleReset = () => {
        setText('');
        setPosition({ x: 50, y: 50 });
        setRotation(0);
        setFontSize(20);
        setFontColor('#ffffff');
        setFontType('Arial');
        setOpacity(1);
        
        // Reset SVG states
        setSvgFile(null);
        setSvgDataUrl('');
        setSvgSize(100);
        setSvgRotation(0);
        setSvgOpacity(1);
        setSvgPosition({ x: 100, y: 100 });
        setSvgAspectRatio(1);
        
        // Reset visibility
        setShowTextWatermark(false);
        setShowSvgWatermark(false);
        
        // Clear cached images
        baseImageRef.current = null;
        svgImageRef.current = null;
        
        // Reload base image
        if (enhancedImageData) {
            const img = new Image();
            img.onload = () => {
                baseImageRef.current = img;
                drawCanvas();
            };
            img.src = enhancedImageData;
        }
    }
    
    const handleMouseDown = (e) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Determine which watermark to move based on what's visible
        if (showTextWatermark && !showSvgWatermark) {
            setPosition({ x, y });
        } else if (showSvgWatermark && !showTextWatermark) {
            setSvgPosition({ x, y });
        } else if (showTextWatermark && showSvgWatermark) {
            // If both are visible, move the one that was last clicked
            // For now, we'll move text watermark - could be enhanced with a selection system
            setPosition({ x, y });
        }
    };

    const cancel = () => {
        if (onClose) {
            onClose();
        }
    }

    return (
        <div className="canvas-overlay">
            <div className="canvas-modal">
                <div className="canvas-header">
                    <h3>💧 Add Watermark</h3>
                    <button className="close-btn" onClick={cancel}>✕</button>
                </div>
                
                <div className="canvas-content">
                    <div className="canvas-container">
                        <canvas
                            ref={canvasRef}
                            width={500}
                            height={500}
                            onClick={handleMouseDown}
                            style={{ border: '1px solid #ccc', cursor: 'crosshair' }}
                        ></canvas>
                        <p className="canvas-hint">💡 Click on the canvas to position your watermarks</p>
                    </div>

                    <div className="controls-panel">
                        {/* Watermark Type Selection */}
                        <div className="control-group watermark-type-selector">
                            <label>Watermark Types:</label>
                            <div className="watermark-toggles">
                                <label className="toggle-label">
                                    <input
                                        type="checkbox"
                                        checked={showTextWatermark}
                                        onChange={(e) => setShowTextWatermark(e.target.checked)}
                                    />
                                    <span className="toggle-text">Text Watermark</span>
                                </label>
                                <label className="toggle-label">
                                    <input
                                        type="checkbox"
                                        checked={showSvgWatermark}
                                        onChange={(e) => setShowSvgWatermark(e.target.checked)}
                                    />
                                    <span className="toggle-text">SVG Watermark</span>
                                </label>
                            </div>
                        </div>

                        {/* Text Watermark Controls */}
                        {showTextWatermark && (
                            <div className="watermark-controls">
                                <h4 className="control-section-title">📝 Text Watermark</h4>
                                <div className="control-group">
                                    <label>Text:</label>
                                    <input
                                        className="text-input"
                                        type="text"
                                        value={text}
                                        onChange={(e) => setText(e.target.value)}
                                        placeholder="Enter watermark text"
                                    />
                                </div>

                                <div className="control-group">
                                    <label>Font Type:</label>
                                    <select className="type-input" value={fontType} onChange={(e) => setFontType(e.target.value)}>
                                        <option value="Arial">Arial</option>
                                        <option value="Courier New">Courier New</option>
                                        <option value="Times New Roman">Times New Roman</option>
                                        <option value="Georgia">Georgia</option>
                                        <option value="Verdana">Verdana</option>
                                        <option value="Tahoma">Tahoma</option>
                                        <option value="Impact">Impact</option>
                                    </select>
                                </div>

                                <div className="control-group">
                                    <label>Font Size: {fontSize}px</label>
                                    <input
                                        type="range"
                                        min="12"
                                        max="72"
                                        value={fontSize}
                                        onChange={(e) => setFontSize(parseInt(e.target.value))}
                                    />
                                </div>
                                
                                <div className="control-group">
                                    <label>Color:</label>
                                    <input
                                        className="color-input"
                                        type="color"
                                        value={fontColor}
                                        onChange={(e) => setFontColor(e.target.value)}
                                    />
                                </div>
                                
                                <div className="control-group">
                                    <label>Rotation: {rotation}°</label>
                                    <input
                                        type="range"
                                        min="-180"
                                        max="180"
                                        value={rotation}
                                        onChange={(e) => setRotation(parseInt(e.target.value))}
                                    />
                                </div>

                                <div className="control-group">
                                    <label>Opacity: {Math.round(opacity * 100)}%</label>
                                    <input
                                        type="range"
                                        min="0"
                                        max="1"
                                        step="0.01"
                                        value={opacity}
                                        onChange={(e) => setOpacity(parseFloat(e.target.value))}
                                    />
                                </div>
                            </div>
                        )}

                        {/* SVG Watermark Controls */}
                        {showSvgWatermark && (
                            <div className="watermark-controls">
                                <h4 className="control-section-title">🖼️ SVG Watermark</h4>
                                <div className="control-group">
                                    <label>SVG File:</label>
                                    <input
                                        type="file"
                                        accept=".svg"
                                        onChange={handleSvgFileUpload}
                                        className="file-input"
                                    />
                                    {svgFile && (
                                        <span className="file-name">{svgFile.name}</span>
                                    )}
                                </div>

                                <div className="control-group">
                                    <label>Size: {svgSize}px</label>
                                    <input
                                        type="range"
                                        min="20"
                                        max="200"
                                        value={svgSize}
                                        onChange={(e) => setSvgSize(parseInt(e.target.value))}
                                    />
                                </div>

                                <div className="control-group">
                                    <label>Rotation: {svgRotation}°</label>
                                    <input
                                        type="range"
                                        min="-180"
                                        max="180"
                                        value={svgRotation}
                                        onChange={(e) => setSvgRotation(parseInt(e.target.value))}
                                    />
                                </div>

                                <div className="control-group">
                                    <label>Opacity: {Math.round(svgOpacity * 100)}%</label>
                                    <input
                                        type="range"
                                        min="0"
                                        max="1"
                                        step="0.01"
                                        value={svgOpacity}
                                        onChange={(e) => setSvgOpacity(parseFloat(e.target.value))}
                                    />
                                </div>
                            </div>
                        )}

                        <div className="action-buttons">
                            <button className="btn btn-secondary" onClick={drawWatermark}>Apply Watermark</button>
                            <button className="btn btn-primary" onClick={handleDownload}>Download Image</button>
                            <button className="btn btn-secondary" onClick={handleReset}>Reset</button>
                            <button className="btn btn-secondary" onClick={cancel}>Cancel</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CanvasElement;