from process_image import process_image
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import shutil
import os
import base64
from io import BytesIO
from PIL import Image
import uuid

app = FastAPI()

# Add CORS middleware to allow frontend to call the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "http://localhost:5173", "http://127.0.0.1:3000", "http://127.0.0.1:5173"],  # React dev servers
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Store active processors
processors = {}

class ImageEnhancementRequest(BaseModel):
    image_path: str

class ImageSelectionRequest(BaseModel):
    image_path: str
    option_number: int

def pil_image_to_base64(pil_image):
    """Convert PIL Image to base64 string for JSON serialization"""
    if pil_image is None:
        return None
    if pil_image.mode != 'RGB':
        pil_image = pil_image.convert('RGB')
    
    buffer = BytesIO()
    pil_image.save(buffer, format='JPEG', quality=95)
    img_str = base64.b64encode(buffer.getvalue()).decode()
    return f"data:image/jpeg;base64,{img_str}"

@app.post("/upload")
async def upload_image(image: UploadFile = File(...)):
    """Upload an image file and return the file path"""
    try:
        # Validate file type
        if not image.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        # Create uploads directory if it doesn't exist
        script_dir = os.path.dirname(os.path.abspath(__file__))
        upload_dir = os.path.join(script_dir, "uploads")

        os.makedirs(upload_dir, exist_ok=True)
        
        # Generate unique filename
        file_extension = os.path.splitext(image.filename)[1]
        unique_filename = f"{uuid.uuid4()}{file_extension}"
        file_path = os.path.join(upload_dir, unique_filename)
        
        # Save the uploaded file
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)
        
        return {"file_path": file_path, "filename": unique_filename}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error uploading file: {str(e)}")

@app.post("/enhance_and_return_all_options")
async def enhance_image(request: ImageEnhancementRequest):
    """Process image through all enhancement options"""
    try:
        print(f"Starting enhancement for image: {request.image_path}")
        
        # Create a new processor instance
        processor_id = str(uuid.uuid4())
        img_processor = process_image()
        
        # Check if the image path is absolute or relative
        if os.path.isabs(request.image_path):
            # If absolute path, convert to relative from the script directory
            script_dir = os.path.dirname(os.path.abspath(__file__))
            relative_path = os.path.relpath(request.image_path, script_dir)
            image_path_to_use = relative_path
        else:
            # If relative path, use as is
            image_path_to_use = request.image_path
        
        print(f"Using image path: {image_path_to_use}")
        
        # Check if file exists before processing
        full_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), image_path_to_use)
        if not os.path.exists(full_path):
            raise HTTPException(status_code=404, detail=f"Image file not found: {full_path}")
        
        # Process the image step by step with error handling
        print("Step 1: Processing image...")
        img_processor.process(image_path_to_use)
        
        img_processor.raw_image.save("processed_image.png")  # Save processed image for debugging
        
        print("Step 2: Detecting objects...")
        img_processor.detect_object()
        
        img_processor.cropped_image.save("detected_objects_image.png")  # Save detected objects image for debugging
        print(img_processor.detected_objects)
        
        print("Step 3: Removing background...")
        img_processor.remove_background()
        
        img_processor.no_background_image.save("no_background_image.png")  # Save no background image for debugging
        
        print("Step 4: Enhancement option 1...")
        try:
            img_processor.enhance_image_option1()
            print("Enhancement option 1 completed")
        except Exception as e:
            print(f"Enhancement option 1 failed: {str(e)}")
            # Set a placeholder or skip this enhancement
            img_processor.enhanced_image_1 = img_processor.no_background_image
        
        print("Step 5: Enhancement option 2...")
        try:
            img_processor.enhance_image_option2()
            print("Enhancement option 2 completed")
        except Exception as e:
            print(f"Enhancement option 2 failed: {str(e)}")
            # Set a placeholder or skip this enhancement
            img_processor.enhanced_image_2 = img_processor.no_background_image
        
        print("Step 6: Enhancement option 3...")
        try:
            img_processor.enhance_image_option3()
            print("✓ Enhancement option 3 completed")
        except Exception as e:
            print(f"Enhancement option 3 failed: {str(e)}")
            # Set a placeholder or skip this enhancement
            img_processor.enhanced_image_3 = img_processor.no_background_image
        
        # Store the processor for later use
        processors[processor_id] = img_processor
        print(f"Enhancement completed successfully. Processor ID: {processor_id}")
        
        # Convert PIL images to base64 for JSON response
        return {
            "processor_id": processor_id,
            "enhanced_image_1": pil_image_to_base64(img_processor.enhanced_image_1),
            "enhanced_image_2": pil_image_to_base64(img_processor.enhanced_image_2),
            "enhanced_image_3": pil_image_to_base64(img_processor.enhanced_image_3),
            "original_image": pil_image_to_base64(img_processor.raw_image),
            "no_background_image": pil_image_to_base64(img_processor.no_background_image)
        }
    
    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        print(f"Error during enhancement: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Error enhancing image: {str(e)}")

@app.post("/choose_image_and_generate_description")
async def choose_image_and_generate_description(
    processor_id: str,
    option_number: int
):
    """Choose an enhanced image option and generate description"""
    try:
        # Get the processor instance
        if processor_id not in processors:
            raise HTTPException(status_code=404, detail="Processor not found. Please enhance image first.")
        
        img_processor = processors[processor_id]
        
        # Choose the image
        img_processor.choose_image(option_number)
        
        # Generate description
        description = img_processor.generate_description()
        
        return {
            "chosen_image": pil_image_to_base64(img_processor.chosen_image),
            "description": description,
            "option_number": option_number
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating description: {str(e)}") 

@app.delete("/cleanup/{processor_id}")
async def cleanup_processor(processor_id: str):
    """Clean up processor instance to free memory"""
    if processor_id in processors:
        del processors[processor_id]
        return {"message": "Processor cleaned up successfully"}
    else:
        raise HTTPException(status_code=404, detail="Processor not found")

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "active_processors": len(processors)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8001)
