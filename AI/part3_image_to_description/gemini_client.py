import json
import google.generativeai as genai

API_KEY = "Enter API Key"

genai.configure(api_key=API_KEY) # ← ONLY this line

model = genai.GenerativeModel("models/gemini-2.5-pro")


def generate_description_from_image(image_b64: str,
                                    tone: str = "professional",
                                    lang: str = "en") -> dict:
    prompt = (
        f"Generate an SEO-optimised e-commerce product listing in {lang}. "
        f"Tone: {tone}. Respond ONLY with strict JSON containing keys "
        f"{{'title','description','features','tags'}}. "
        f"'features' and 'tags' must be arrays."
    )

    try:
        response = model.generate_content(
            [
                {"inline_data": {"mime_type": "image/jpeg", "data": image_b64}},
                prompt
            ]
        )
        text = response.text.strip()
        try:
            return json.loads(text)
        except json.JSONDecodeError:
            return {"raw_output": text}
    except Exception as err:
        return {"error": str(err)}
