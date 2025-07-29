from matplotlib import image
from transformers import OwlViTProcessor, OwlViTForObjectDetection
from PIL import Image
import torch
import matplotlib.pyplot as plt
import matplotlib.patches as patches
from rembg import remove
import os
import cv2
import numpy as np
from PIL import Image, ImageEnhance, ImageFilter
from gradio_client import Client, handle_file
import requests
import shutil
import json
import google.generativeai as genai
import base64
from langchain_google_genai import ChatGoogleGenerativeAI
import image_enhancement_option3_helper

class process_image:
    def __init__(self):
        self.image_path = None
        self.raw_image = None
        self.detected_objects = []
        self.cropped_image = None
        self.no_background_image = None
        self.enhanced_image_1 = None
        self.enhanced_image_2 = None
        self.enhanced_image_3 = None
        self.chosen_image = None
        self.description = ""

    def detect_object(self):
        processor = OwlViTProcessor.from_pretrained("google/owlvit-base-patch32")
        model = OwlViTForObjectDetection.from_pretrained("google/owlvit-base-patch32")
        texts = [[ "clothing","topwear","bottomwear","outerwear","apparel","sportswear","uniform",
                    "underwear", "dress", "outfit", "footwear", "shoes", "boots","sneakers",
                    "accessory","bag","backpack","handbag","wallet","belt","hat","cap","scarf",
                    "glasses","watch","jewel", "electronics", "device","gadget","smartphone","laptop"
                    "tablet","headphones","smartwatch", "cosmetics","beauty product","skincare","makeup",
                    "perfume","hair product", "baby product","baby clothes","toy","stroller","pacifier",
                    "home item","furniture","appliance","decor","kitchenware","bedding","cleaning too",
                    "sports gear","fitness equipment","gym accessory","camping gear","bicycle equipment"
        ]
        ]
        inputs = processor(text=texts, images=self.raw_image, return_tensors="pt")

        with torch.no_grad():
            outputs = model(**inputs)

        target_sizes = torch.tensor([self.raw_image.size[::-1]])
        results = processor.post_process_grounded_object_detection(
            outputs=outputs,
            target_sizes=target_sizes,
            threshold=0.2
        )[0]
        self.detected_objects = results["labels"].tolist()
        for score, label_id, box in zip(results["scores"], results["labels"], results["boxes"]):
            if score < 0.05:
                continue 

            xmin, ymin, xmax, ymax = map(int, box.tolist())
            self.cropped_image = self.raw_image.crop((xmin, ymin, xmax, ymax))
        
    def remove_background(self):
        self.no_background_image = remove(self.cropped_image)

    def enhance_image_option1(self):
        sharpened = self.no_background_image.filter(ImageFilter.UnsharpMask(
            radius=1,
            percent=120,
            threshold=1
        ))

        enhancer = ImageEnhance.Contrast(sharpened)
        contrast_enhanced = enhancer.enhance(1.1)  # 10% more contrast
        
        enhancer = ImageEnhance.Brightness(contrast_enhanced)
        brightness_enhanced = enhancer.enhance(1.02)  # 2% brighter
        
        enhancer = ImageEnhance.Color(brightness_enhanced)
        color_enhanced = enhancer.enhance(1.05)  # 5% more vibrant
 
        img_array = np.array(color_enhanced)
        
        img_bgr = cv2.cvtColor(img_array, cv2.COLOR_RGB2BGR)
        denoised = cv2.bilateralFilter(img_bgr, 3, 10, 10)
        img_rgb = cv2.cvtColor(denoised, cv2.COLOR_BGR2RGB)
        
        self.enhanced_image_1 = Image.fromarray(img_rgb)
        scale = 1.5
        original_size = self.enhanced_image_1.size
        new_size = (int(original_size[0] * scale), int(original_size[1] * scale))

        self.enhanced_image_1 = self.enhanced_image_1.resize(new_size, Image.Resampling.LANCZOS)
        return self.enhanced_image_1

    def enhance_image_option2(self):

        client = Client("finegrain/finegrain-image-enhancer")

        script_dir = os.path.dirname(os.path.abspath(__file__))
        output_path = os.path.join(script_dir, "temp_image.png")

        self.no_background_image.save(output_path)

        script_dir = os.path.dirname(os.path.abspath(__file__))
        temp_image_path = os.path.join(script_dir, "temp_image.png")
        result = client.predict(
                input_image=handle_file(temp_image_path),
                prompt="",
                negative_prompt="",
                seed=0,
                upscale_factor=2.6,
                controlnet_scale=0.5,
                controlnet_decay=0.6,
                condition_scale=5,
                tile_width=200,
                tile_height=200,
                denoise_strength=0,
                num_inference_steps=23,
                solver="DPMSolver",
                api_name="/process"
        )
        # Get the image from result[1] - local file path, not a URL
        image_path = result[1]

        self.enhanced_image_2 = Image.open(image_path)
        return self.enhanced_image_2
    
    def enhance_image_option3(self):
        enhancer = image_enhancement_option3_helper.image_enhancement_option3_helper(model=None)
        self.enhanced_image_3 = enhancer.ai_enhanced_image_processing(self.no_background_image)

    def generate_description_from_image(self, image_b64: str,
                                        tone: str = "professional",
                                        lang: str = "en") -> str:
        API_KEY = "Enter API Key"

        genai.configure(api_key=API_KEY) # ← ONLY this line

        model = genai.GenerativeModel("models/gemini-2.5-pro")

        prompt = (
            f"Generate an SEO-optimised e-commerce product listing in {lang}. "
            f"Tone: {tone}. Respond ONLY with strict JSON containing keys "
            f"{{'title','description','features','tags'}}. "
            f"'features' and 'tags' must be arrays."
        )

        try:
            response = model.generate_content(
                [
                    {"inline_data": {"mime_type": "image/jpeg", "data": image_b64}},
                    prompt
                ]
            )
            text = response.text.strip()
            try:
                return text
            except json.JSONDecodeError:
                return "Invalid JSON response: " + text
        except Exception as err:
            return "Error generating description: " + str(err)
    

    def choose_image(self, number: int):
        if number == 1:
            self.chosen_image = self.enhanced_image_1
        elif number == 2:
            self.chosen_image = self.enhanced_image_2
        elif number == 3:
            self.chosen_image = self.enhanced_image_3
        else:
            raise ValueError("Invalid image number. Choose 1, 2, or 3.")
        

    def generate_description(self):
        from io import BytesIO
        buffer = BytesIO()
        self.chosen_image.save(buffer, format='JPEG')
        img_b64 = base64.b64encode(buffer.getvalue()).decode()
        tone = "professional"
        lang = "en"
        self.description = self.generate_description_from_image(img_b64, tone, lang)

    def process(self, image_path):
        script_dir = os.path.dirname(os.path.abspath(__file__))
        self.image_path = os.path.join(script_dir, image_path)
        self.raw_image = Image.open(self.image_path).convert("RGB")

    def get_enhanced_images(self):
        return self.enhanced_image_1, self.enhanced_image_2, self.enhanced_image_3
    
    def get_description(self):
        return self.description