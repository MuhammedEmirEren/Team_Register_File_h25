import os
from PIL import Image, ImageFilter
import cv2
import numpy as np

"""def pil_enhance_image(image_path):
    # Check if the image file exists
    if not os.path.exists(image_path):
        print(f"Error: Image file '{image_path}' not found!")
        return False
    
    try:
        # Load the image
        image = Image.open(image_path)
        print(f"Successfully loaded image: {image_path}")
        print(f"Image size: {image.size}, Mode: {image.mode}")

        # Apply enhancements
        enhanced_image = image.filter(ImageFilter.DETAIL)

        # Get the directory of the current script
        script_dir = os.path.dirname(os.path.abspath(__file__))
        output_path = os.path.join(script_dir, "enhanced_image.png")
        
        # Save the enhanced image
        enhanced_image.save(output_path)
        print(f"Enhanced image saved to: {output_path}")
        return True
        
    except Exception as e:
        print(f"Error processing image: {e}")
        return False"""


def image_loading_preprocessing(image_path):
    if not os.path.exists(image_path):
        print(f"Error: Image file '{image_path}' not found!")
        return False
    
    try:
        # Load the image
        image = Image.open(image_path)
        return image
    except Exception as e:
        print(f"Error loading image: {e}")
        return False

def noise_reduction(image):
    if image is None:
        print("No image to process for noise reduction.")
        return False
    
    try:
        # Convert to numpy array for OpenCV processing
        image_np = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)
        
        # Use Non-local Means Denoising - preserves edges better than blur
        denoised_image = cv2.fastNlMeansDenoisingColored(image_np, None, 10, 10, 7, 21)
        
        return Image.fromarray(cv2.cvtColor(denoised_image, cv2.COLOR_BGR2RGB))
    except Exception as e:
        print(f"Error in noise reduction: {e}")
        return False

def sharpening_detail_enrichment(image):
    if image is None:
        print("No image to process for sharpening.")
        return False
    
    try:
        # Convert to numpy array
        image_np = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)
        
        # Create sharpening kernel
        sharpening_kernel = np.array([[-1, -1, -1],
                                    [-1,  9, -1],
                                    [-1, -1, -1]])
        
        # Apply sharpening
        sharpened = cv2.filter2D(image_np, -1, sharpening_kernel)
        
        # Additional detail enhancement using unsharp masking
        gaussian = cv2.GaussianBlur(image_np, (0, 0), 2.0)
        unsharp_mask = cv2.addWeighted(image_np, 1.5, gaussian, -0.5, 0)
        
        # Combine sharpening and unsharp mask
        enhanced = cv2.addWeighted(sharpened, 0.7, unsharp_mask, 0.3, 0)
        
        return Image.fromarray(cv2.cvtColor(enhanced, cv2.COLOR_BGR2RGB))
    except Exception as e:
        print(f"Error in sharpening: {e}")
        return False

def color_and_contrast_enhancement(image):
    if image is None:
        print("No image to process for color enhancement.")
        return False
    
    try:
        # Convert to numpy array
        image_np = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)
        
        # Convert to LAB color space for better contrast control
        lab = cv2.cvtColor(image_np, cv2.COLOR_BGR2LAB)
        l, a, b = cv2.split(lab)
        
        # Apply CLAHE (Contrast Limited Adaptive Histogram Equalization) to L channel
        clahe = cv2.createCLAHE(clipLimit=3.0, tileGridSize=(8, 8))
        l = clahe.apply(l)
        
        # Merge channels back
        enhanced_lab = cv2.merge([l, a, b])
        enhanced_bgr = cv2.cvtColor(enhanced_lab, cv2.COLOR_LAB2BGR)
        
        # Additional color enhancement
        enhanced_bgr = cv2.convertScaleAbs(enhanced_bgr, alpha=1.2, beta=10)
        
        return Image.fromarray(cv2.cvtColor(enhanced_bgr, cv2.COLOR_BGR2RGB))
    except Exception as e:
        print(f"Error in color enhancement: {e}")
        return False

def super_resolution(image):
    if image is None:
        print("No image to process for super resolution.")
        return False
    
    try:
        # Convert to numpy array
        image_np = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)
        
        # Simple upscaling with cubic interpolation
        height, width = image_np.shape[:2]
        new_height, new_width = int(height * 1.5), int(width * 1.5)
        
        # Use cubic interpolation for smoother upscaling
        upscaled = cv2.resize(image_np, (new_width, new_height), interpolation=cv2.INTER_CUBIC)
        
        # Apply additional sharpening after upscaling
        sharpening_kernel = np.array([[0, -1, 0],
                                    [-1,  5, -1],
                                    [0, -1, 0]])
        upscaled = cv2.filter2D(upscaled, -1, sharpening_kernel)
        
        return Image.fromarray(cv2.cvtColor(upscaled, cv2.COLOR_BGR2RGB))
    except Exception as e:
        print(f"Error in super resolution: {e}")
        return False

def main():
    # Get the directory of the current script
    script_dir = os.path.dirname(os.path.abspath(__file__))
    image_path = os.path.join(script_dir, "input_image.png")
    
    # Load and preprocess the image
    print("Loading original image...")
    original_image = image_loading_preprocessing(image_path)
    if original_image is False:
        return
    print(f"Original image loaded: {image_path}")
    print(f"Original size: {original_image.size}")
    
    # Save original for comparison
    original_output = os.path.join(script_dir, "01_original.png")
    original_image.save(original_output)
    print(f"Original saved as: {original_output}")
    
    # Step 1: Apply noise reduction (better algorithm now)
    print("\n1. Applying noise reduction...")
    """denoised_image = noise_reduction(original_image)
    if denoised_image is False:
        return
    denoised_output = os.path.join(script_dir, "02_denoised.png")
    denoised_image.save(denoised_output)"""
    #print(f"Denoised image saved: {denoised_output}")
    denoised_image = original_image
    # Step 2: Apply sharpening and detail enhancement
    print("\n2. Applying sharpening and detail enhancement...")
    sharpened_image = sharpening_detail_enrichment(denoised_image)
    if sharpened_image is False:
        return
    sharpened_output = os.path.join(script_dir, "03_sharpened.png")
    sharpened_image.save(sharpened_output)
    print(f"Sharpened image saved: {sharpened_output}")
    
    # Step 3: Apply color and contrast enhancement
    print("\n3. Applying color and contrast enhancement...")
    enhanced_image = color_and_contrast_enhancement(sharpened_image)
    if enhanced_image is False:
        return
    enhanced_output = os.path.join(script_dir, "04_color_enhanced.png")
    enhanced_image.save(enhanced_output)
    print(f"Color enhanced image saved: {enhanced_output}")
    
    # Step 4: Apply super resolution (upscaling)
    print("\n4. Applying super resolution...")
    upscaled_image = super_resolution(enhanced_image)
    if upscaled_image is False:
        return
    upscaled_output = os.path.join(script_dir, "05_final_enhanced.png")
    upscaled_image.save(upscaled_output)
    print(f"Final enhanced image saved: {upscaled_output}")
    print(f"Final size: {upscaled_image.size}")
    
    print("\n✅ Image enhancement pipeline completed!")
    print("📁 Check the following files to see the progression:")
    print("   01_original.png")
    print("   02_denoised.png") 
    print("   03_sharpened.png")
    print("   04_color_enhanced.png")
    print("   05_final_enhanced.png")
    
    # Show final result
    upscaled_image.show(title="Final Enhanced Image")

if __name__ == "__main__":
    main()