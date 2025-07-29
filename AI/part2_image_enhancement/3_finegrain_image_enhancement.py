import os
from PIL import Image
from gradio_client import Client, handle_file
import requests
import shutil
def main():
    # Initialize the Gradio client for fine-grain image enhancement
    client = Client("finegrain/finegrain-image-enhancer")
    script_dir = os.path.dirname(os.path.abspath(__file__))
    image_path = os.path.join(script_dir, "input_image.png")
    result = client.predict(
            input_image=handle_file(image_path),  # Path to your input image
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
    # Get the image from result[1] - this is actually a local file path, not a URL
    image_path = result[1]
    print(f"Enhanced image path: {image_path}")
    
    # Copy the image to our desired location
    import shutil
    script_dir = os.path.dirname(os.path.abspath(__file__))
    output_path = os.path.join(script_dir, "enhanced_image.png")
    
    try:
        # Copy the file from temp location to our directory
        shutil.copy2(image_path, output_path)
        print(f"Enhanced image saved as: {output_path}")
    except Exception as e:
        print(f"Error copying file: {e}")
        # Alternative: try to open and save with PIL
        try:
            img = Image.open(image_path)
            img.save(output_path)
            print(f"Enhanced image saved as: {output_path}")
        except Exception as e2:
            print(f"Error saving with PIL: {e2}")
if __name__ == "__main__":
    main()