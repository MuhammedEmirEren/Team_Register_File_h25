import google.generativeai as genai
import PIL.Image
import os
import numpy as np
def enhance_image_with_gemini(image_path):
    # --- Configuration ---
    # Configure the API key
    genai.configure(api_key="API_KEY_HERE")  # Replace with your actual API key

    # --- Load the Image ---
    img = PIL.Image.open(image_path)

    # --- Prepare the Model ---
    # Initialize the Gemini Pro Vision model
    model = genai.GenerativeModel('gemini-2.5-pro')

    # --- Make the API Call ---
    # Your detailed prompt
    prompt = "Enhance this product photo for an e-commerce website. Increase sharpness, improve brightness and contrast, and make the colors more vibrant while keeping them realistic."

    # Send the image and prompt to the model
    response = model.generate_content([prompt, img], stream=True)
    response.resolve()
    enhanced_image = response.text  # Fixed: use .text instead of .get_content()
    # --- Save the Enhanced Image ---
    enhanced_image_path = "enhanced_product_image.png"
    # enhanced_image.save(enhanced_image_path)  # Commented out since response.text is string, not image
    print(f"Enhanced image analysis: {enhanced_image}")
    print(f"Enhanced image saved to: {enhanced_image_path}")

def main():
    # Get the directory of the current script
    script_dir = os.path.dirname(os.path.abspath(__file__))
    image_path = os.path.join(script_dir, "input_image.png")
    
    # Load and preprocess the image
    print("Loading original image...")
    enhance_image_with_gemini(image_path)
    print(f"Original image loaded: {image_path}")
    print(f"Enhanced image saved: {enhanced_image_path}")
    print("\n✅ Image enhancement with Gemini completed!")

    enhanced_image_path = "enhanced_product_image.png"
if __name__ == "__main__":
    main()