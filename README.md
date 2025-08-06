# 🚀 AI-Powered Product Enhancement Platform
### BTK Akademi Hackathon 2025

We used another repository to deployment changes: https://github.com/MuhammedEmirEren/register_file_hackathon_ai_part_deployment

Live Demo: https://register-file-hackathon-ai-part-dep.vercel.app/
(Note: From our enhancement models, our option 2 is using finegrain-image-enhancer model and in the demo sometimes it does not work effectively with free tier usage. However, it works as expected locally.)

<div align="center">

[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Python](https://img.shields.io/badge/Python-3.11-3776AB?style=for-the-badge&logo=python)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-Latest-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![OpenCV](https://img.shields.io/badge/OpenCV-4.8-5C3EE8?style=for-the-badge&logo=opencv)](https://opencv.org/)

### 🏆 Revolutionizing E-commerce Product Photography with AI

*A comprehensive AI-powered solution that transforms ordinary product images into professional, market-ready visuals with intelligent background removal, enhancement, watermarking, and automated content generation.*

</div>

---

## 🎯 Problem Statement

E-commerce businesses struggle with:
- ❌ **Inconsistent product photography**
- ❌ **Time-consuming manual editing**
- ❌ **High costs for professional photo editing**
- ❌ **Poor product presentation affecting sales**
- ❌ **Manual content creation for product descriptions**

## 💡 Our Solution

A **comprehensive AI platform** that automates the entire product photography workflow:

### 🔥 Core Features

#### 1. 🎨 **AI-Powered Image Enhancement**
- **Smart Object Detection** - Automatically identifies products in images
- **Background Removal** - One-click professional background removal
- **Intelligent Enhancement** - AI algorithms improve lighting, contrast, and sharpness
- **Multiple Enhancement Options** - Fine-grained control over enhancement parameters

#### 2. 🖼️ **Advanced Watermarking System**
- **Text Watermarks**: 
  - 7+ Professional fonts (Arial, Courier New, Times New Roman, Georgia, Verdana, Tahoma, Impact)
  - Full customization (size: 12-72px, rotation: -180° to 180°, opacity: 0-100%)
  - Interactive positioning with real-time preview
- **SVG Watermarks**: 
  - Upload custom brand logos
  - Maintain vector quality and transparency
  - Full control over size, rotation, and positioning

#### 3. 🤖 **AI Content Generation**
- **Auto-Generated Titles** - SEO-optimized product titles
- **Product Descriptions** - Compelling, marketing-ready descriptions
- **Smart Product Search** - Automatic similar product discovery

#### 4. 🎨 **Dynamic Background Generation**
- **AI Background Creation** - Generate contextual backgrounds
- **Multiple Style Options** - Professional, lifestyle, and artistic backgrounds
- **Brand Consistency** - Maintain visual identity across products

---

## 🛠️ Technical Architecture

### Frontend (React + Vite)
```
├── 🎨 Modern UI/UX with CSS Grid & Flexbox
├── ⚡ Lightning-fast Vite bundler
├── 🔄 Real-time processing feedback
├── 📱 Responsive design for all devices
└── 🎭 Interactive canvas for watermark positioning
```

### AI Engine (Python + FastAPI)
```
├── 🧠 OpenCV for image processing
├── 🎯 AI for object detection
├── 🎨 PIL for image manipulation
├── 🤖 Gemini AI for content generation
└── ⚡ FastAPI for high-performance API
```
## 🚀 Quick Start Guide

### Prerequisites
- Node.js 18+ 
- Python 3.11+

### Requirements 

fastapi
uvicorn
gradio
python-multipart
pillow
torch
transformers
numpy
opencv-python-headless
requests
pydantic
python-dotenv
google-generativeai
langchain-google-genai
rembg
onnxruntime

### Installation

1. **Clone the Repository**
```bash
git clone https://github.com/MuhammedEmirEren/Team_Register_File_h25.git
cd Team_Register_File_h25
```

2. **Frontend Setup**
```bash
cd frontend
npm install
npm run dev
```

3. **AI Engine Setup**
```bash
cd AI/merged_models_and_api
pip install -r requirements.txt
python rf_ai_api.py
```

### 🌐 Access Points
- **Frontend**: http://localhost:3000
- **AI API**: http://localhost:8001

---

## 🎮 How to Use

### Step 1: Upload Your Product Image
- Drag & drop or browse to select
- Supports JPG, PNG, JPEG formats
- Real-time file validation
- Choose background or generate one

### Step 2: AI Enhancement
- Choose enhancement level (Gentle/Aggressive)
- Automatic background removal
- Object detection and isolation

### Step 3: Apply Watermarks
- Add text or SVG watermarks
- Interactive positioning
- Real-time preview

### Step 4: Generate Content
- AI-powered product titles
- Marketing descriptions
- Product search URLs

### Step 5: Download
- High-quality image download
---

## 🏗️ Project Structure

```
📦 Team_Register_File_h25
├── 🎨 frontend/                 # React Application
│   ├── src/
│   │   ├── components/          # Reusable UI Components
│   │   ├── hooks/              # Custom React Hooks
│   │   ├── services/           # API Services
│   │   └── utils/              # Utility Functions
│   ├── public/                 # Static Assets
│   │   ├── bg_*.jpeg          # Background Templates
│   │   ├── sample*.svg        # Sample Watermarks
│   │   └── sample*.jpg        # Demo Images
│   └── package.json
├── 🤖 AI/                       # Python AI Engine
│   ├── merged_models_and_api/  # Main AI API
│   │   ├── rf_ai_api.py       # FastAPI Server
│   │   ├── process_image.py   # Image Processing
│   │   ├── background_generator.py # Background AI
│   │   └── search_product.py  # Product Search
│   ├── part1_image_background_removal/
│   ├── part2_image_enhancement/
│   ├── part3_image_to_description/
│   ├── part4_product_extraction_url_returning/
│   └── part6_background_generation/
└── 📸 Sample Images & Results
```

---

## 🌟 Key Innovations

### 1. **Multi-Modal AI Integration**
- Combines computer vision, NLP, and generative AI
- Seamless workflow from image upload to final product

### 2. **Real-Time Processing Pipeline**
- WebSocket connections for live updates
- Parallel processing for multiple enhancements
- Smart caching for improved performance

### 3. **Interactive Watermark System**
- Canvas-based positioning
- Live preview with drag-and-drop
- Support for both text and vector graphics

### 4. **Intelligent Background Generation**
- Context-aware background creation
- Style transfer capabilities
- Brand consistency maintenance

---

### 🌐 Links
[![GitHub](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/MuhammedEmirEren/Team_Register_File_h25)

</div>

**Made with ❤️ by Team RegisterFile for BTK Akademi Hackathon 2025**

</div>
