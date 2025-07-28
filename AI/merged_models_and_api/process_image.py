from transformers import OwlViTProcessor, OwlViTForObjectDetection
from PIL import Image
import torch
import matplotlib.pyplot as plt
import matplotlib.patches as patches
from rembg import remove
import os


class process_image:
    def __init__(self):
        self.image_path = None
        self.raw_image = None
        self.detected_objects = []
        self.cutted_image = None
        self.no_background_image = None
        self.enhanced_image = None
        self.upscaled_image = None
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
        inputs = processor(text=texts, images=image, return_tensors="pt")

        with torch.no_grad():
            outputs = model(**inputs)

        target_sizes = torch.tensor([image.size[::-1]])
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
        cropped = image.crop((xmin, ymin, xmax, ymax))

        label = texts[0][label_id]
        
        #cropped.save(f"cropped_{label}_{round(score.item(), 2)}.png")
        cropped.save("cropped_image.png")

        cropped.show()

    def remove_background(self):

    def enhance_image(self):

    def upscale_image(self):

    def generate_description(self):

    def process(self, image_path):
        script_dir = os.path.dirname(os.path.abspath(__file__))
        self.image_path = os.path.join(script_dir, image_path)
        self.raw_image = Image.open(image_path).convert("RGB")