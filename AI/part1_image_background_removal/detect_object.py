from transformers import OwlViTProcessor, OwlViTForObjectDetection
from PIL import Image
import torch
import matplotlib.pyplot as plt
import matplotlib.patches as patches
from rembg import remove

processor = OwlViTProcessor.from_pretrained("google/owlvit-base-patch32")
model = OwlViTForObjectDetection.from_pretrained("google/owlvit-base-patch32")

image = Image.open("C:/Users/Lenovo/OneDrive/Masaüstü/BİLKENT ÜNİVERSİTESİ/Internship/Python Codes/PyTorch/Hackathon/Shoe.jpg").convert("RGB")

texts = [[
    # 👕 Giyim
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

    # 👞 Ayakkabı
    "footwear",
    "shoes",
    "boots",
    "sneakers",

    # 👜 Aksesuarlar
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

    # 💻 Elektronik
    "electronics",
    "device",
    "gadget",
    "smartphone",
    "laptop",
    "tablet",
    "headphones",
    "smartwatch",

    # 💄 Kozmetik / Kişisel Bakım
    "cosmetics",
    "beauty product",
    "skincare",
    "makeup",
    "perfume",
    "hair product",

    # 👶 Bebek ve çocuk
    "baby product",
    "baby clothes",
    "toy",
    "stroller",
    "pacifier",

    # 🏠 Ev ve yaşam
    "home item",
    "furniture",
    "appliance",
    "decor",
    "kitchenware",
    "bedding",
    "cleaning tool",

    # 🏋️ Spor ve outdoor
    "sports gear",
    "fitness equipment",
    "gym accessory",
    "camping gear",
    "bicycle equipment"
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
print(results)

# plt.imshow(image)
# ax = plt.gca()

# query_labels = [
#     # 👕 Giyim
#     "clothing",
#     "topwear",
#     "bottomwear",
#     "outerwear",
#     "apparel",
#     "sportswear",
#     "uniform",
#     "underwear",
#     "dress",
#     "outfit",

#     # 👞 Ayakkabı
#     "footwear",
#     "shoes",
#     "boots",
#     "sneakers",

#     # 👜 Aksesuarlar
#     "accessory",
#     "bag",
#     "backpack",
#     "handbag",
#     "wallet",
#     "belt",
#     "hat",
#     "cap",
#     "scarf",
#     "glasses",
#     "watch",
#     "jewelry",

#     # 💻 Elektronik
#     "electronics",
#     "device",
#     "gadget",
#     "smartphone",
#     "laptop",
#     "tablet",
#     "headphones",
#     "smartwatch",

#     # 💄 Kozmetik / Kişisel Bakım
#     "cosmetics",
#     "beauty product",
#     "skincare",
#     "makeup",
#     "perfume",
#     "hair product",

#     # 👶 Bebek ve çocuk
#     "baby product",
#     "baby clothes",
#     "toy",
#     "stroller",
#     "pacifier",

#     # 🏠 Ev ve yaşam
#     "home item",
#     "furniture",
#     "appliance",
#     "decor",
#     "kitchenware",
#     "bedding",
#     "cleaning tool",

#     # 🏋️ Spor ve outdoor
#     "sports gear",
#     "fitness equipment",
#     "gym accessory",
#     "camping gear",
#     "bicycle equipment"
# ]

# for score, label_id, box in zip(results["scores"], results["labels"], results["boxes"]):
#     xmin, ymin, xmax, ymax = box.tolist()
#     ax.add_patch(patches.Rectangle((xmin, ymin), xmax - xmin, ymax - ymin,
#                                    linewidth=2, edgecolor='green', facecolor='none'))

#     # Map the label index back to the query text
#     label_name = query_labels[label_id]
#     ax.text(xmin, ymin, f"{label_name}: {round(score.item(), 2)}",
#             color='white', fontsize=8, bbox=dict(facecolor='green', alpha=0.5))

# plt.axis("off")
# plt.show()


for score, label_id, box in zip(results["scores"], results["labels"], results["boxes"]):
    if score < 0.05:
        continue 

    xmin, ymin, xmax, ymax = map(int, box.tolist())
    cropped = image.crop((xmin, ymin, xmax, ymax))

    label = texts[0][label_id]
    
    #cropped.save(f"cropped_{label}_{round(score.item(), 2)}.png")
    cropped.save("cropped_image.png")

    cropped.show()
    
input_image = Image.open("cropped_image.png")
output_image = remove(input_image)
output_image.save("no_bg_image.png")
