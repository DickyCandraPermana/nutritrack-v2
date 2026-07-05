import os
import requests
import json
import google.generativeai as genai

# Configure Gemini
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

def extract_nutrition(image_url: str) -> dict:
    """
    Downloads an image from a URL and passes it to Gemini Flash to extract nutrition info.
    Returns a dict with: name, calories, protein, carbs, fat.
    """
    if not GEMINI_API_KEY:
        raise ValueError("GEMINI_API_KEY is not set")

    # 1. Download image
    try:
        response = requests.get(image_url)
        response.raise_for_status()
        image_data = response.content
        mime_type = response.headers.get('Content-Type', 'image/jpeg')
    except Exception as e:
        raise Exception(f"Failed to download image from {image_url}: {e}")

    # 2. Prepare Gemini Input
    model = genai.GenerativeModel('gemini-1.5-flash')
    
    prompt = """
    Analyze this food image and estimate its macronutrients and calories for a standard serving.
    Return ONLY a raw JSON object with no markdown formatting or backticks.
    The JSON object must have exactly these keys and types:
    {
      "name": "Food Name (string)",
      "calories": 0.0 (float),
      "protein": 0.0 (float),
      "carbs": 0.0 (float),
      "fat": 0.0 (float)
    }
    """

    image_parts = [
        {
            "mime_type": mime_type,
            "data": image_data
        }
    ]

    # 3. Call Gemini
    try:
        result = model.generate_content([image_parts[0], prompt])
        text = result.text.strip()
        
        # Remove any markdown code blocks if gemini still adds them
        if text.startswith("```json"):
            text = text[7:]
        if text.startswith("```"):
            text = text[3:]
        if text.endswith("```"):
            text = text[:-3]
            
        data = json.loads(text.strip())
        
        # Ensure correct types
        return {
            "name": str(data.get("name", "Unknown Food")),
            "calories": float(data.get("calories", 0)),
            "protein": float(data.get("protein", 0)),
            "carbs": float(data.get("carbs", 0)),
            "fat": float(data.get("fat", 0))
        }
    except Exception as e:
        raise Exception(f"Failed to process image with Gemini: {e}")
