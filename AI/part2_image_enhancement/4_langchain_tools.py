import os
import uuid
from langchain.tools import tool
from PIL import Image, ImageEnhance, ImageFilter
from langchain.agents import AgentExecutor, create_react_agent
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain import hub

def get_new_path(original_path: str, suffix: str) -> str:
    """Generates a new unique path for an output image."""
    output_dir = os.path.join(os.path.dirname(original_path), "output")
    os.makedirs(output_dir, exist_ok=True)
    filename = f"{os.path.splitext(os.path.basename(original_path))[0]}_{suffix}_{uuid.uuid4().hex[:6]}.png"
    return os.path.join(output_dir, filename)

@tool
def analyze_image(image_path: str) -> str:
    """Analyzes an image and provides details about its current state, quality issues, and enhancement recommendations.
    
    Args:
        image_path: Path to the image file to analyze
    """
    try:
        print(f"🔍 Analyzing image: {image_path}")
        
        # Load and analyze the image
        with Image.open(image_path) as img:
            # Get basic image info
            width, height = img.size
            mode = img.mode

            analysis = f"""
Image Analysis Results:
- Dimensions: {width}x{height} pixels
- Color mode: {mode}
- File path: {image_path}

Basic Assessment:
- Image size: {'Large' if width > 1000 or height > 1000 else 'Medium' if width > 500 or height > 500 else 'Small'}
- Aspect ratio: {width/height:.2f}

Recommended enhancements based on typical image issues:
1. If image appears dim: Use increase_brightness with factor 1.1-1.3
2. If image lacks contrast: Use increase_contrast with factor 1.1-1.2  
3. If image appears soft/blurry: Use increase_sharpness with factor 1.2-1.5
4. If image has noise/grain: Use noise_reduction with radius 0.5-1.5

You should examine the actual image file to determine which enhancements are needed.
"""
            print(f"✅ Image analysis completed")
            return analysis
            
    except Exception as e:
        error_msg = f"Error analyzing image: {e}"
        print(error_msg)
        return error_msg

@tool
def increase_brightness(image_path: str, factor: float) -> str:
    """Increases the brightness of the image at the given path. Use factor > 1.0 to brighten, < 1.0 to darken.
    
    Args:
        image_path: Path to the image file
        factor: Enhancement factor (e.g., 1.2 = 20% increase)
    """
    try:
        print(f"🔧 Increasing brightness: {image_path}, factor: {factor}")
        
        with Image.open(image_path) as img:
            enhancer = ImageEnhance.Brightness(img)
            enhanced_img = enhancer.enhance(factor)
            output_path = get_new_path(image_path, "brightness")
            enhanced_img.save(output_path)
            print(f"✅ Brightness enhanced, saved to: {output_path}")
            return output_path
    except Exception as e:
        error_msg = f"Error enhancing brightness: {e}"
        print(error_msg)
        return error_msg

@tool
def increase_contrast(image_path: str, factor: float) -> str:
    """Increases the contrast of the image at the given path. Use factor > 1.0 to increase contrast.
    
    Args:
        image_path: Path to the image file
        factor: Enhancement factor (e.g., 1.2 = 20% increase)
    """
    try:
        print(f"🔧 Increasing contrast: {image_path}, factor: {factor}")
        
        with Image.open(image_path) as img:
            enhancer = ImageEnhance.Contrast(img)
            enhanced_img = enhancer.enhance(factor)
            output_path = get_new_path(image_path, "contrast")
            enhanced_img.save(output_path)
            print(f"✅ Contrast enhanced, saved to: {output_path}")
            return output_path
    except Exception as e:
        error_msg = f"Error enhancing contrast: {e}"
        print(error_msg)
        return error_msg

@tool
def increase_sharpness(image_path: str, factor: float) -> str:
    """Increases the sharpness of the image at the given path. Use factor > 1.0 to sharpen.
    
    Args:
        image_path: Path to the image file
        factor: Enhancement factor (e.g., 1.2 = 20% increase)
    """
    try:
        print(f"🔧 Increasing sharpness: {image_path}, factor: {factor}")
        
        with Image.open(image_path) as img:
            enhancer = ImageEnhance.Sharpness(img)
            enhanced_img = enhancer.enhance(factor)
            output_path = get_new_path(image_path, "sharpness")
            enhanced_img.save(output_path)
            print(f"✅ Sharpness enhanced, saved to: {output_path}")
            return output_path
    except Exception as e:
        error_msg = f"Error enhancing sharpness: {e}"
        print(error_msg)
        return error_msg

@tool
def noise_reduction(image_path: str, radius: float) -> str:
    """Reduces noise in the image using Gaussian blur. Use small radius values (0.5-2.0) for subtle effect.
    
    Args:
        image_path: Path to the image file
        radius: Blur radius for noise reduction
    """
    try:
        print(f"🔧 Applying noise reduction: {image_path}, radius: {radius}")
        
        with Image.open(image_path) as img:
            filtered_img = img.filter(ImageFilter.GaussianBlur(radius=radius))
            output_path = get_new_path(image_path, "noise_reduction")
            filtered_img.save(output_path)
            print(f"✅ Noise reduction applied, saved to: {output_path}")
            return output_path
    except Exception as e:
        error_msg = f"Error applying noise reduction: {e}"
        print(error_msg)
        return error_msg
    
def create_image_enhancement_agent():
    """Creates an agent for image enhancement."""
    llm = ChatGoogleGenerativeAI(
        model="gemini-2.5-flash",
        google_api_key="Enter API Key" # Replace with your API key
    )
    
    tools = [
        analyze_image,  # First tool - to analyze the image
        increase_brightness,
        increase_contrast,
        increase_sharpness,
        noise_reduction,
    ]
    
    prompt = hub.pull("hwchase17/react")
    agent = create_react_agent(llm, tools, prompt)
    agent_executor = AgentExecutor(agent=agent, tools=tools, verbose=True, handle_parsing_errors=True)
    
    return agent_executor

def main():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    image_path = os.path.join(script_dir, "input_image.png")
    
    # Check if input image exists
    if not os.path.exists(image_path):
        print(f"❌ Error: Input image '{image_path}' not found!")
        return

    print("🚀 Starting Intelligent LangChain Image Enhancement Agent")
    print("="*60)
    print(f"📸 Input image: {image_path}")
    print("🧠 Agent will analyze the image and choose appropriate enhancements")

    agent_executor = create_image_enhancement_agent()
    
    prompt = f"""
    You are an expert image enhancement specialist. Your task is to enhance the image located at: {image_path}

    Instructions:
    1. FIRST, use the analyze_image tool to examine the image and understand its current state
    2. Based on your analysis, decide which enhancement tools to use and in what order
    3. Apply the enhancements you think are most needed (you don't have to use all tools)
    4. Use appropriate factor values (typically 1.1-1.3 for subtle improvements, 1.4-1.6 for stronger effects)
    5. For noise reduction, use radius values between 0.5-2.0

    Available tools:
    - analyze_image(image_path): Analyze the image
    - increase_brightness(image_path, factor): Adjust brightness
    - increase_contrast(image_path, factor): Adjust contrast  
    - increase_sharpness(image_path, factor): Adjust sharpness
    - noise_reduction(image_path, radius): Reduce noise

    Start by analyzing the image to understand what needs to be improved.
    """
    
    try:
        result = agent_executor.invoke({
            "input": prompt,
        })
        
        print("\n" + "="*60)
        print("🎉 Intelligent Enhancement Completed!")
        print("📁 Final Output:", result['output'])
        print("="*60)
        
    except Exception as e:
        print(f"❌ Error during agent execution: {e}")
        print("💡 Check your API key and internet connection.")
        

if __name__ == "__main__":
    main()