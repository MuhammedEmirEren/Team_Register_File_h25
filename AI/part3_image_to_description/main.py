from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.responses import JSONResponse
import base64
from gemini_client import generate_description_from_image

app = FastAPI(title="AI Product-Description Generator")

ALLOWED = {"image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"}

@app.post("/generate-description")
async def generate_description(
    image: UploadFile = File(...),
    tone: str = Form("professional"),
    lang: str = Form("en")
):
    if image.content_type not in ALLOWED:
        raise HTTPException(415, f"Unsupported type {image.content_type}")

    img_b64 = base64.b64encode(await image.read()).decode()
    result = generate_description_from_image(img_b64, tone, lang)
    return JSONResponse(content=result)
