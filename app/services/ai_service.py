import os
import google.generativeai as genai
from dotenv import load_dotenv

# Load .env file
load_dotenv()

# Read API Key
API_KEY = os.getenv("GEMINI_API_KEY")

# Configure Gemini
genai.configure(api_key=API_KEY)

# Load Gemini Model
model = genai.GenerativeModel("gemini-2.5-flash")


def analyze_blood_report(report_text):

    prompt = f"""
You are an AI Nutrition Assistant.

Analyze the following blood test report.

Give the output in this exact format.

Patient Summary:
...

Lab Explanation:
...

Nutrition Suggestions:
...

Lifestyle Guidance:
...

Doctor Discussion Points:
...

Important Rules:
- Use simple English.
- Do not diagnose diseases.
- Do not prescribe medicines.
- Give only general nutrition and lifestyle advice.
- Mention that users should consult a doctor.

Blood Report:

{report_text}
"""

    try:
        response = model.generate_content(prompt)
        return response.text

    except Exception as e:
        return f"Gemini Error: {str(e)}"