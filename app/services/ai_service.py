import os
from groq import Groq
from dotenv import load_dotenv

# Load .env
load_dotenv()

# Read Groq API Key
API_KEY = os.getenv("GROQ_API_KEY")

# Create Groq Client
client = Groq(api_key=API_KEY)


def analyze_blood_report(report_text):

    prompt = f"""
You are an AI Nutrition Assistant.

Analyze the following blood test report.

Return the output ONLY in the following format.

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

Medical Disclaimer:
This report is for educational purposes only.
It is not a medical diagnosis.
Please consult a qualified doctor.

Rules:
- Use simple English.
- Do not diagnose diseases.
- Do not prescribe medicines.
- Give only general nutrition suggestions.
- Give only general lifestyle guidance.

Blood Report:

{report_text}
"""

    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "system",
                    "content": "You are a helpful healthcare AI assistant."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.3,
            max_tokens=1200
        )

        return response.choices[0].message.content

    except Exception as e:
        return f"Groq Error: {str(e)}"