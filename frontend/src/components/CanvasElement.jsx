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

    // Positioning mode for individual watermark control
    const [positioningMode, setPositioningMode] = useState('text'); // 'text' or 'svg'

    // Cache for base image
    const baseImageRef = useRef(null);
    const svgImageRef = useRef(null);
    
    // Ref for SVG file input to clear it on reset
    const svgFileInputRef = useRef(null);

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
        svgSize, svgRotation, svgOpacity, svgPosition, svgAspectRatio]);

    const drawCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas || !baseImageRef.current) return;
        
        const ctx = canvas.getContext('2d');

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw base image
        ctx.drawImage(baseImageRef.current, 0, 0, canvas.width, canvas.height);
        
        // Draw text watermark
        if (text) {
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
        if (svgImageRef.current) {
            ctx.save();
            ctx.translate(svgPosition.x, svgPosition.y);
            ctx.rotate((svgRotation * Math.PI) / 180);
            ctx.globalAlpha = svgOpacity;
            
            // Calculate height based on aspect ratio to prevent stretching
            const height = svgSize / svgAspectRatio;
            ctx.drawImage(svgImageRef.current, 0, 0, svgSize, height);
            ctx.restore();
        }
    };

    const handleSvgFileUpload = (event) => {
        const file = event.target.files[0];
        if (file && file.type === 'image/svg+xml') {
            setSvgFile(file);
            const reader = new FileReader();
            reader.onload = (e) => {
                const svgContent = e.target.result;
                setSvgDataUrl(svgContent);
                
                // Calculate aspect ratio from SVG
                const parser = new DOMParser();
                const svgDoc = parser.parseFromString(svgContent, 'image/svg+xml');
                const svgElement = svgDoc.querySelector('svg');
                if (svgElement) {
                    const width = parseFloat(svgElement.getAttribute('width') || svgElement.viewBox.baseVal.width);
                    const height = parseFloat(svgElement.getAttribute('height') || svgElement.viewBox.baseVal.height);
                    if (width && height) {
                        setSvgAspectRatio(width / height);
                    }
                }
            };
            reader.readAsDataURL(file);
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
        // Reset text watermark states
        setText('');
        setFontSize(20);
        setFontColor('#ffffff');
        setFontType('Arial');
        setRotation(0);
        setPosition({ x: 50, y: 50 });
        setOpacity(1);
        
        // Reset SVG watermark states
        setSvgFile(null);
        setSvgDataUrl('');
        setSvgSize(100);
        setSvgRotation(0);
        setSvgOpacity(1);
        setSvgPosition({ x: 100, y: 100 });
        setSvgAspectRatio(1);
        
        // Reset positioning mode
        setPositioningMode('text');
        
        // Clear cached images
        baseImageRef.current = null;
        svgImageRef.current = null;
        
        // Clear the SVG file input
        if (svgFileInputRef.current) {
            svgFileInputRef.current.value = '';
        }
        
        // Force a fresh canvas draw
        setTimeout(() => {
            if (enhancedImageData) {
                const img = new Image();
                img.onload = () => {
                    baseImageRef.current = img;
                    drawCanvas();
                };
                img.src = enhancedImageData;
            }
        }, 100);
    };
    
    const handleMouseDown = (e) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Scale coordinates to canvas size
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const scaledX = x * scaleX;
        const scaledY = y * scaleY;
        
        // Position based on the selected mode
        if (positioningMode === 'text' && text) {
            setPosition({ x: scaledX, y: scaledY });
        } else if (positioningMode === 'svg' && svgImageRef.current) {
            setSvgPosition({ x: scaledX, y: scaledY });
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
                        <p className="canvas-hint">💡 Click on a watermark section to select which one to position</p>
                    </div>

                    <div className="controls-panel">
                        {/* Watermark Controls - Side by Side Layout */}
                        <div className="watermark-controls-layout">
                            {/* Text Watermark Controls */}
                            <div 
                                className={`watermark-controls text-watermark-controls ${positioningMode === 'text' ? 'selected' : ''}`}
                                onClick={() => text && setPositioningMode('text')}
                                style={{ cursor: text ? 'pointer' : 'default' }}
                            >
                                <h4 className="control-section-title">📝 Text Watermark {positioningMode === 'text' && text ? '✓' : ''}</h4>
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

                            {/* SVG Watermark Controls */}
                            <div 
                                className={`watermark-controls svg-watermark-controls ${positioningMode === 'svg' ? 'selected' : ''}`}
                                onClick={() => svgImageRef.current && setPositioningMode('svg')}
                                style={{ cursor: svgImageRef.current ? 'pointer' : 'default' }}
                            >
                                <h4 className="control-section-title">🖼️ SVG Watermark {positioningMode === 'svg' && svgImageRef.current ? '✓' : ''}</h4>
                                <div className="control-group">
                                    <label>SVG File:</label>
                                    <input
                                        ref={svgFileInputRef}
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
                        </div>

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