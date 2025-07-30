import os
import uuid
from PIL import Image, ImageEnhance, ImageFilter
from langchain_google_genai import ChatGoogleGenerativeAI

class image_enhancement_option3_helper:
    def __init__(self, model):
        self.model = model
    
    def analyze_image(self, img) -> dict:
        """Analyzes an image and returns its properties."""
        try:
            width, height = img.size
            mode = img.mode
            
            # Simple brightness analysis
            grayscale = img.convert('L')
            pixels = list(grayscale.getdata())
            avg_brightness = sum(pixels) / len(pixels)
            
            analysis = {
                'width': width,
                'height': height,
                'mode': mode,
                'avg_brightness': avg_brightness,
                'is_dark': avg_brightness < 100,
                'is_small': width < 500 or height < 500,
                'aspect_ratio': width / height,
                'recommendations': []
            }
            
            # Generate recommendations
            if analysis['is_dark']:
                analysis['recommendations'].append(f"Increase brightness (current: {avg_brightness:.1f})")
            
            analysis['recommendations'].append("Enhance contrast for better dynamic range")
            
            if analysis['is_small']:
                analysis['recommendations'].append("Apply sharpening (small image)")
            
            analysis['recommendations'].append("Light noise reduction for smoothing")
            return analysis
                
        except Exception as e:
            print(f"Error analyzing image: {e}")
            return {}

    def ai_enhanced_image_processing(self, image: Image) -> str:
        """
        Uses AI to analyze the image and decide on enhancements, then applies them.
        This is a hybrid approach that uses AI for decision making but direct Python for processing.
        """
        # Step 1: Analyze the image
        analysis = self.analyze_image(image)
        if not analysis:
            return None
        # Step 2: Use AI to decide on enhancement strategy
        llm = ChatGoogleGenerativeAI(
            model="gemini-2.5-flash",
            google_api_key="AIzaSyBnD6vmTb1l500szFiWV_2HlRz0K72DtPw",
            temperature=0.1,
        )
        
        ai_prompt = f"""
        You are an expert image enhancement specialist. Based on this image analysis, decide on the optimal enhancement strategy:

        Image Analysis:
        - Dimensions: {analysis['width']}x{analysis['height']} pixels
        - Color mode: {analysis['mode']}
        - Average brightness: {analysis['avg_brightness']:.1f} (0-255 scale)
        - Is dark: {analysis['is_dark']}
        - Is small: {analysis['is_small']}
        - Aspect ratio: {analysis['aspect_ratio']:.2f}

        Recommendations from analysis:
        {chr(10).join(f"- {rec}" for rec in analysis['recommendations'])}

        Please provide a specific enhancement plan in this exact format:
        BRIGHTNESS_FACTOR: [number between 0.8-1.5, or SKIP]
        CONTRAST_FACTOR: [number between 0.8-1.5, or SKIP]
        SHARPNESS_FACTOR: [number between 0.8-2.0, or SKIP]
        NOISE_REDUCTION_RADIUS: [number between 0.3-2.0, or SKIP]

        Consider:
        - If brightness < 90, suggest 1.2-1.4 brightness factor
        - If brightness > 90, suggest 1.0-1.2 or SKIP
        - Always enhance contrast slightly (1.1-1.3)
        - For small images, use higher sharpness (1.3-1.8)
        - Use light noise reduction (0.5-0.8) for final smoothing
        """
        
        try:
            ai_response = llm.invoke(ai_prompt)
            print(f"AI Enhancement Plan:\n{ai_response.content}")
            
            enhancement_plan = self.parse_ai_response(ai_response.content)
                    
            if enhancement_plan.get('brightness') != 'SKIP':
                print(f"Applying brightness enhancement (factor: {enhancement_plan['brightness']})")
                current_image = self.increase_brightness(image, enhancement_plan['brightness'])

            if enhancement_plan.get('contrast') != 'SKIP':
                print(f"Applying contrast enhancement (factor: {enhancement_plan['contrast']})")
                current_image = self.increase_contrast(current_image, enhancement_plan['contrast'])

            if enhancement_plan.get('sharpness') != 'SKIP':
                print(f"Applying sharpness enhancement (factor: {enhancement_plan['sharpness']})")
                current_image = self.increase_sharpness(current_image, enhancement_plan['sharpness'])

            if enhancement_plan.get('noise_reduction') != 'SKIP':
                print(f"Applying noise reduction (radius: {enhancement_plan['noise_reduction']})")
                current_image = self.noise_reduction(current_image, enhancement_plan['noise_reduction'])
            return current_image 
            
        except Exception as e:
            return self.rule_based_enhancement(image, analysis)

    def parse_ai_response(self,response: str) -> dict:
        """Parse the AI response to extract enhancement parameters."""
        plan = {}
        lines = response.split('\n')
        
        for line in lines:
            if 'BRIGHTNESS_FACTOR:' in line:
                value = line.split(':')[1].strip()
                plan['brightness'] = float(value) if value != 'SKIP' else 'SKIP'
            elif 'CONTRAST_FACTOR:' in line:
                value = line.split(':')[1].strip()
                plan['contrast'] = float(value) if value != 'SKIP' else 'SKIP'
            elif 'SHARPNESS_FACTOR:' in line:
                value = line.split(':')[1].strip()
                plan['sharpness'] = float(value) if value != 'SKIP' else 'SKIP'
            elif 'NOISE_REDUCTION_RADIUS:' in line:
                value = line.split(':')[1].strip()
                plan['noise_reduction'] = float(value) if value != 'SKIP' else 'SKIP'
        
        # Set defaults if not provided
        plan.setdefault('brightness', 1.1)
        plan.setdefault('contrast', 1.2)
        plan.setdefault('sharpness', 1.3)
        plan.setdefault('noise_reduction', 0.6)
        
        return plan

    def rule_based_enhancement(self, image, analysis: dict):
        """Fallback rule-based enhancement if AI fails."""
        print("🔧 Applying rule-based enhancement...")

        current_image = image

        if analysis['is_dark']:
            current_image = self.increase_brightness(current_image, 1.3)

        current_image = self.increase_contrast(current_image, 1.2)

        if analysis['is_small']:
            current_image = self.increase_sharpness(current_image, 1.4)
        else:
            current_image = self.increase_sharpness(current_image, 1.2)

        current_image = self.noise_reduction(current_image, 0.3)

        return current_image

    def increase_brightness(self, img, factor: float) -> str:
        """Increases the brightness of the image."""
        try:
            enhancer = ImageEnhance.Brightness(img)
            enhanced_img = enhancer.enhance(factor)
            return enhanced_img
        except Exception as e:
            print(f"Error: {e}")
            return img

    def increase_contrast(self, img, factor: float) -> str:
        """Increases the contrast of the image."""
        try:
            enhancer = ImageEnhance.Contrast(img)
            enhanced_img = enhancer.enhance(factor)
            return enhanced_img
        except Exception as e:
            print(f"Error: {e}")
            return img
        except Exception as e:
            print(f"Error: {e}")
            return img

    def increase_sharpness(self, img, factor: float) -> str:
        """Increases the sharpness of the image."""
        try:
            enhancer = ImageEnhance.Sharpness(img)
            enhanced_img = enhancer.enhance(factor)
            return enhanced_img
        except Exception as e:
            print(f"Error: {e}")
            return img

    def noise_reduction(self, img, radius: float) -> str:
        """Reduces noise in the image using Gaussian blur."""
        try:
            filtered_img = img.filter(ImageFilter.GaussianBlur(radius=radius))
            return filtered_img
        except Exception as e:
            print(f"Error: {e}")
            return img
        except Exception as e:
            print(f"Error: {e}")
            return img

