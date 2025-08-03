# Team_Register_File_h25

A comprehensive image enhancement and watermarking application with AI-powered features.

## Features

### Image Enhancement
- AI-powered image enhancement using advanced algorithms
- Background removal capabilities
- Multiple enhancement options and settings
- Real-time processing with progress tracking

### Watermarking System
- **Text Watermarks**: Add customizable text watermarks with various fonts, colors, sizes, and rotations
- **SVG Watermarks**: Upload and apply SVG files as watermarks with full control over size, rotation, and opacity
- Interactive positioning by clicking on the canvas
- Real-time preview of watermark placement
- Download watermarked images in high quality

### Product Information Generation
- AI-generated product titles and descriptions
- Integration with product search functionality
- Enhanced product presentation

## Watermark Features

### Text Watermarks
- Multiple font options (Arial, Courier New, Times New Roman, Georgia, Verdana, Tahoma, Impact)
- Customizable font size (12-72px)
- Color picker for text color
- Rotation control (-180° to 180°)
- Opacity adjustment (0-100%)
- Interactive positioning

### SVG Watermarks
- Upload any SVG file as a watermark
- Size control (20-200px)
- Rotation control (-180° to 180°)
- Opacity adjustment (0-100%)
- Interactive positioning
- Maintains SVG quality and transparency

## Sample Files

The application includes sample SVG watermarks for testing:
- `sample-watermark.svg`: A circular watermark with gradient background
- `sample-logo.svg`: A logo-style watermark with modern design

## Usage

1. **Upload Image**: Drag and drop or browse to upload an image
2. **Enhance Image**: Apply AI enhancement with your preferred settings
3. **Add Watermark**: 
   - Choose between text or SVG watermark
   - For text: Enter text, select font, color, size, and position
   - For SVG: Upload an SVG file and adjust size, rotation, and position
4. **Position Watermark**: Click on the canvas to position your watermark
5. **Download**: Save your watermarked image

## Technical Stack

- **Frontend**: React with Vite
- **Backend**: Spring Boot (Java)
- **AI Processing**: Python with OpenCV and machine learning models
- **Styling**: Custom CSS with modern design

## Getting Started

1. Clone the repository
2. Install dependencies for frontend and backend
3. Start the development servers
4. Access the application in your browser

## File Structure

```
├── frontend/          # React frontend application
├── backend/           # Spring Boot backend
├── AI/               # Python AI processing modules
└── public/           # Static assets including sample SVGs
```