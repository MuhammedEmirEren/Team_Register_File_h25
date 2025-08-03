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

    useEffect(() => {
        drawCanvas();
    }, [text, fontSize, fontColor, fontType, rotation, position, enhancedImageData, opacity]);

    const drawCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const img = new Image();
        img.onload = () => {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
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
        };
        img.src = enhancedImageData;
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
        drawCanvas();
    }
    
    const handleMouseDown = (e) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setPosition({ x, y });
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
                        <p className="canvas-hint">💡 Click and drag the text to move it around</p>
                    </div>

                    <div className="controls-panel">
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
                            <label>Font Size:</label>
                            <input
                                type="range"
                                min="12"
                                max="72"
                                value={fontSize}
                                onChange={(e) => setFontSize(parseInt(e.target.value))}
                            />
                            <span>{fontSize}px</span>
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
                            <label>Rotation:</label>
                            <input
                                type="range"
                                min="-180"
                                max="180"
                                value={rotation}
                                onChange={(e) => setRotation(parseInt(e.target.value))}
                            />
                            <span>{rotation}°</span>
                        </div>

                        <div className="control-group">
                            <label>Opacity:</label>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.01"
                                value={opacity}
                                onChange={(e) => setOpacity(parseFloat(e.target.value))}
                            />
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