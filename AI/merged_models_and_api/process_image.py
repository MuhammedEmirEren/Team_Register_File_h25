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
from dotenv import load_dotenv

load_dotenv()

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
        texts = [[
            # Giyim
            "clothing",
            "topwear",
            "bottomwear",
            "outerwear",
            "apparel",
            "sportswear",
            "uniform",
            "underwear",
            "dress",
            "outfit",

            # Ayakkabı
            "footwear",
            "shoes",
            "boots",
            "sneakers",

            # Aksesuarlar
            "accessory",
            "bag",
            "backpack",
            "handbag",
            "wallet",
            "belt",
            "hat",
            "cap",
            "scarf",
            "glasses",
            "watch",
            "jewelry",

            # Elektronik
            "electronics",
            "device",
            "gadget",
            "smartphone",
            "laptop",
            "tablet",
            "headphones",
            "smartwatch",

            # Kozmetik / Kişisel Bakım
            "cosmetics",
            "beauty product",
            "skincare",
            "makeup",
            "perfume",
            "hair product",

            # Bebek ve çocuk
            "baby product",
            "baby clothes",
            "toy",
            "stroller",
            "pacifier",

            # Ev ve yaşam
            "home item",
            "furniture",
            "appliance",
            "decor",
            "kitchenware",
            "bedding",
            "cleaning tool",

            # Spor ve outdoor
            "sports gear",
            "fitness equipment",
            "gym accessory",
            "camping gear",
            "bicycle equipment"
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
        
        # If no objects were detected or cropped, use the entire original image
        if self.cropped_image is None:
            print("No objects detected with sufficient confidence. Using entire image.")
            self.cropped_image = self.raw_image
        
    def remove_background(self):
        if self.cropped_image is None:
            print("No cropped image available. Using entire image.")
            self.cropped_image = self.raw_image

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
        
        API_KEY = os.getenv("SECRET_API_KEY")

        genai.configure(api_key=API_KEY) # ← ONLY this line

        model = genai.GenerativeModel("gemini-2.0-flash-exp")  # Updated model name

        prompt = (
            f"Analyze this product image and generate an SEO-optimized e-commerce product listing in {lang}. "
            f"Tone: {tone}. Respond ONLY with valid JSON (no markdown formatting) containing these exact keys: "
            f"'title', 'description', 'features', 'tags'. "
            f"The 'features' and 'tags' must be arrays of strings. "
            f"Do not include any other text or formatting."
        )

        try:
            response = model.generate_content(
                [
                    {"inline_data": {"mime_type": "image/jpeg", "data": image_b64}},
                    prompt
                ]
            )
            text = response.text.strip()
            
            # Remove markdown code blocks
            if text.startswith("```json"):
                text = text[7:]  # Remove ```json
            if text.startswith("```"):
                text = text[3:]   # Remove ```
            if text.endswith("```"):
                text = text[:-3]  # Remove trailing ```
            
            text = text.strip()
            
            # Parsing the JSON response
            try:
                parsed_json = json.loads(text)
                print("Successfully parsed JSON response")
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
        print("Starting description generation...")
        
        if self.chosen_image is None:
            print("Error: No image chosen for description generation")
            self.description = "Error: No image selected for description generation"
            return self.description
        
        try:
            print("Converting image to base64...")
            from io import BytesIO
            buffer = BytesIO()  
            
            # It handles RGBA images by converting to RGB
            image_to_save = self.chosen_image
            if image_to_save.mode == 'RGBA':
                background = Image.new('RGB', image_to_save.size, (255, 255, 255))
                background.paste(image_to_save, mask=image_to_save.split()[-1])  # Use alpha channel as mask
                image_to_save = background
            elif image_to_save.mode != 'RGB':
                image_to_save = image_to_save.convert('RGB')
            
            image_to_save.save(buffer, format='JPEG', quality=95)
            img_b64 = base64.b64encode(buffer.getvalue()).decode()
            print(f"Image converted to base64, size: {len(img_b64)} characters")
            
            tone = "professional"
            lang = "en"
            self.description = self.generate_description_from_image(img_b64, tone, lang)
            return self.description
        except Exception as e:
            print(f"Error in generate_description: {str(e)}")
            import traceback
            traceback.print_exc()
            self.description = f"Error generating description: {str(e)}"
            return self.description

    def process(self, image_path):
        if os.path.isabs(image_path):
            # If absolute path, use it directly
            self.image_path = image_path
        else:
            # If relative path, join with script directory
            script_dir = os.path.dirname(os.path.abspath(__file__))
            self.image_path = os.path.join(script_dir, image_path)
        
        self.raw_image = Image.open(self.image_path).convert("RGB")

    def get_enhanced_images(self):
        return self.enhanced_image_1, self.enhanced_image_2, self.enhanced_image_3
    
    def get_description(self):
        return self.description