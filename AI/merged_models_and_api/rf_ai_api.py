import process_image
from fastapi import FastAPI
from pydantic import BaseModel


app = FastAPI()

class ImageEnhancementRequest(BaseModel):
    image_path: str
    img_processor: process_image

    def __init__(self, image_path: str):
        self.image_path = image_path
        self.img_processor = process_image.process_image()        
    
    def set_image_path(self, image_path: str):
        self.image_path = image_path


@app.post("/enhance_and_return_all_options")
def enhance_image(request: ImageEnhancementRequest):
    request.img_processor.process(request.image_path)
    request.img_processor.detect_object()
    request.img_processor.remove_background()
    request.img_processor.enhance_image_option1()
    request.img_processor.enhance_image_option2()
    request.img_processor.enhance_image_option3()
    return {
        "enhanced_image_1": request.img_processor.enhanced_image_1,
        "enhanced_image_2": request.img_processor.enhanced_image_2,
        "enhanced_image_3": request.img_processor.enhanced_image_3,
    }

@app.post("/choose_image_and_generate_description")
def choose_image_and_generate_description(request: ImageEnhancementRequest, number: int):
    request.img_processor.choose_image(number)
    description = request.img_processor.generate_description()
    return {
        "chosen_image": request.img_processor.chosen_image,
        "description": description
    }

    