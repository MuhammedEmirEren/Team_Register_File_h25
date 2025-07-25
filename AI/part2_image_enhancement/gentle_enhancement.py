import cv2
import numpy as np
from PIL import Image, ImageEnhance, ImageFilter
import os

def gentle_image_enhancement(image_path):
    """
    Very gentle image enhancement - small improvements only
    """
    if not os.path.exists(image_path):
        print(f"Error: Image file '{image_path}' not found!")
        return False
    try:
        print(f"Applying gentle enhancement...")
        # Load image
        image = Image.open(image_path)
        # Convert to RGB if needed
        if image.mode != 'RGB':
            image = image.convert('RGB')
        original_size = image.size

        # 1. VERY LIGHT sharpening
        sharpened = image.filter(ImageFilter.UnsharpMask(
            radius=1,
            percent=120,
            threshold=1
        ))
        
        # 2. SUBTLE contrast enhancement
        enhancer = ImageEnhance.Contrast(sharpened)
        contrast_enhanced = enhancer.enhance(1.1)  # 10% more contrast
        
        # 3. MINIMAL brightness adjustment
        enhancer = ImageEnhance.Brightness(contrast_enhanced)
        brightness_enhanced = enhancer.enhance(1.02)  # 2% brighter
        
        # 4. GENTLE color enhancement
        enhancer = ImageEnhance.Color(brightness_enhanced)
        color_enhanced = enhancer.enhance(1.05)  # 5% more vibrant
        
        # 5. OPTIONAL: Very light noise reduction (only if needed)
        # Convert to numpy for minimal noise reduction
        img_array = np.array(color_enhanced)
        
        # Very light bilateral filter
        img_bgr = cv2.cvtColor(img_array, cv2.COLOR_RGB2BGR)
        denoised = cv2.bilateralFilter(img_bgr, 3, 10, 10)
        img_rgb = cv2.cvtColor(denoised, cv2.COLOR_BGR2RGB)
        
        # Convert back
        final_image = Image.fromarray(img_rgb)
     
        return final_image
        
    except Exception as e:
        print(f"❌ Error in gentle enhancement: {e}")
        return False

def subtle_upscale(image, scale=1.5):
    """
    Gentle upscaling without quality loss
    """
    try:
        original_size = image.size
        new_size = (int(original_size[0] * scale), int(original_size[1] * scale))

        upscaled = image.resize(new_size, Image.Resampling.LANCZOS)
        
        print(f"Gently upscaled: {original_size} → {new_size}")
        return upscaled
        
    except Exception as e:
        print(f"Error in upscaling: {e}")
        return image

def main():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    image_path = os.path.join(script_dir, "input_image.png")

    # Check if input exists
    if not os.path.exists(image_path):
        print(f"Error: Input image '{image_path}' not found!")
        return
    
    # Option 1: Gentle enhancement only (same size)
    print("\n Applying gentle enhancement (same size)...")
    enhanced_image = gentle_image_enhancement(image_path)
    
    if enhanced_image is False:
        print("Enhancement failed!")
        return
    
    # Save gentle enhancement
    gentle_output = os.path.join(script_dir, "gentle_enhanced.png")
    enhanced_image.save(gentle_output, quality=100)
    print(f"Gentle enhanced: {gentle_output}")
    
    # Option 2: Gentle enhancement + subtle upscale
    print("Applying gentle enhancement + subtle upscale...")
    upscaled_image = subtle_upscale(enhanced_image, scale=1.5)
    
    upscaled_output = os.path.join(script_dir, "gentle_upscaled.png")
    upscaled_image.save(upscaled_output, quality=100)
    print(f"Gentle upscaled: {upscaled_output}")
    
    # Create a simple comparison
    print("Creating comparison...")
    original = Image.open(image_path)
    
    # Resize original to match enhanced for comparison
    enhanced_size = enhanced_image.size
    original_resized = original.resize(enhanced_size, Image.Resampling.LANCZOS)
    
    # Create side-by-side comparison
    comparison_width = enhanced_size[0] * 2
    comparison_height = enhanced_size[1]
    comparison = Image.new('RGB', (comparison_width, comparison_height))
    
    comparison.paste(original_resized, (0, 0))
    comparison.paste(enhanced_image, (enhanced_size[0], 0))
    
    comparison_output = os.path.join(script_dir, "gentle_comparison.png")
    comparison.save(comparison_output, quality=100)
    try:
        enhanced_image.show(title="Gentle Enhancement - Better Quality")
    except:
        print("sImages saved. Check the files!")

if __name__ == "__main__":
    main()
