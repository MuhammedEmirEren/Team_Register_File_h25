# To run this code you need to install the following dependencies:
# pip install google-genai

import base64
import mimetypes
import os
from google import genai
from google.genai import types
from dotenv import load_dotenv

load_dotenv()

import base64
import mimetypes
import os
from google import genai
from google.genai import types

class BackgroundGenerator:
    def save_binary_file(self, file_name, data):
        f = open(file_name, "wb")
        f.write(data)
        f.close()
        print(f"File saved to to: {file_name}")


    def generate(self, prompt):
        client = genai.Client(
            api_key=os.getenv("SECRET_API_KEY"),
        )

        model = "gemini-2.0-flash-preview-image-generation"
        contents = [
            types.Content(
                role="user",
                parts=[
                    types.Part.from_text(text=prompt),
                ],
            ),
        ]
        generate_content_config = types.GenerateContentConfig(
            response_modalities=[
                "IMAGE",
                "TEXT",
            ],
            safety_settings=[
                types.SafetySetting(
                    category="HARM_CATEGORY_HARASSMENT",
                    threshold="BLOCK_NONE",  
                ),
                types.SafetySetting(
                    category="HARM_CATEGORY_HATE_SPEECH",
                    threshold="BLOCK_NONE", 
                ),
                types.SafetySetting(
                    category="HARM_CATEGORY_SEXUALLY_EXPLICIT",
                    threshold="BLOCK_NONE", 
                ),
                types.SafetySetting(
                    category="HARM_CATEGORY_DANGEROUS_CONTENT",
                    threshold="BLOCK_NONE",  
                ),
            ],
        )

        file_index = 0
        for chunk in client.models.generate_content_stream(
            model=model,
            contents=contents,
            config=generate_content_config,
        ):
            if (
                chunk.candidates is None
                or chunk.candidates[0].content is None
                or chunk.candidates[0].content.parts is None
            ):
                continue
            if chunk.candidates[0].content.parts[0].inline_data and chunk.candidates[0].content.parts[0].inline_data.data:
                file_name = "Generated_Background"
                inline_data = chunk.candidates[0].content.parts[0].inline_data
                data_buffer = inline_data.data
                file_extension = mimetypes.guess_extension(inline_data.mime_type)
                self.save_binary_file(r"C:\Users\Lenovo\OneDrive\Masaüstü\Hackathon\Team_Register_File_h25\frontend\public\Generated_Background.png", data_buffer)
                return r"C:\Users\Lenovo\OneDrive\Masaüstü\Hackathon\Team_Register_File_h25\frontend\public\Generated_Background.png"
            else:
                print(chunk.text)
