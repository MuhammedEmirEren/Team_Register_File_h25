from dotenv import load_dotenv
import os
from instabot import Bot
import shutil
from PIL import Image

load_dotenv()

def clear_instabot_cache():
    """Clear instabot cache and config files"""
    folders_to_clear = ["config", "__pycache__"]
    
    for folder in folders_to_clear:
        if os.path.exists(folder):
            try:
                shutil.rmtree(folder)
                print(f"Cleared {folder}")
            except Exception as e:
                print(f"Could not clear {folder}: {e}")

def image_size_change(image_path, new_size=(1080, 1080)):
    """Resize image to specified size"""
    try:
        img = Image.open(image_path)
        img = img.resize(new_size, Image.Resampling.LANCZOS)
        return img
    except Exception as e:
        print(f"Error resizing image: {e}")
        return None
    
def safe_instagram_upload():
    USER_NAME = os.getenv("USER_NAME")
    PASSWORD = os.getenv("PASSWORD")
    
    if not USER_NAME or not PASSWORD:
        print("Error: USER_NAME and PASSWORD must be set in .env file")
        return False
    
    # Clear old cache
    clear_instabot_cache()
    
    # Create bot with custom settings
    bot = Bot(
        max_likes_per_day=50,
        max_follows_per_day=50,
        max_unfollows_per_day=50,
        max_comments_per_day=50
    )
    
    try:
        print(f"Attempting to login as: {USER_NAME}")
        
        # Try login with error handling
        login_result = bot.login(username=USER_NAME, password=PASSWORD)
        
        if not login_result:
            print("Login failed. Possible reasons:")
            print("1. Incorrect credentials")
            print("2. Account requires verification")
            print("3. Instagram blocking bot access")
            print("4. Two-factor authentication enabled")
            return False
        
        print("Login successful!")
        
        # Create and upload image
        script_dir = os.path.dirname(os.path.abspath(__file__))
        image_path = os.path.join(script_dir, "input_image.png")
        
        image_size_change(image_path).save(image_path, quality=100)
        
        print("Uploading photo...")
        upload_result = bot.upload_photo(
            image_path, 
            caption="Second test upload with real image!"
        )
        
        if upload_result:
            print("Photo uploaded successfully!")
        else:
            print("Photo upload failed")
            
        return upload_result
        
    except Exception as e:
        print(f"Error: {str(e)}")
        return False
    
    finally:
        try:
            bot.logout()
            print("Logged out")
        except:
            pass

if __name__ == "__main__":
    success = safe_instagram_upload()
    if success:
        print("Instagram upload completed successfully!")
    else:
        print("Instagram upload failed. Try the alternative methods.")
