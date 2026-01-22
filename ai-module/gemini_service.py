
import google.generativeai as genai
import os
import json

def get_gemini_client():
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY not found in environment variables")
    genai.configure(api_key=api_key)
    return genai

def get_explanation(topic, context=""):
    genai = get_gemini_client()
    prompt = f"""
    Explain the financial concept or application process for: "{topic}".
    Context: {context}
    
    Target audience: Beginner, non-expert user.
    Tone: Helpful, encouraging, clear.
    Structure: Break it down into simple terms. Avoid jargon.
    Output: Plain text (Markdown supported).
    """
    model = genai.GenerativeModel('gemini-3-flash-preview')
    response = model.generate_content(prompt)
    import re
    # Remove Markdown formatting (bold, headers, etc.)
    text = response.text
    # Remove bold (**text** or __text__)
    text = re.sub(r"(\*\*|__)(.*?)\1", r"\2", text)
    # Remove headers (###, ##, #)
    text = re.sub(r"^#+ ?", "", text, flags=re.MULTILINE)
    # Remove remaining markdown artifacts (---, *, etc. at line start)
    text = re.sub(r"^[-*] ?", "", text, flags=re.MULTILINE)
    return text.strip()

def get_recommendations(topic):
    genai = get_gemini_client()
    prompt = f"""
    Provide 3 trusted financial articles and 3 trusted YouTube video titles for learning about: "{topic}".
    
    Output Format: JSON with keys "articles" (list of objects with "title", "url") and "videos" (list of objects with "title", "url").
    
    CRITICAL INSTRUCTION: 
    - For "url" in articles, generate a Google Search URL: "https://www.google.com/search?q=Topic+Name"
    - For "url" in videos, generate a YouTube Search URL: "https://www.youtube.com/results?search_query=Topic+Name"
    - Do NOT make up fake direct URLs like "www.investopedia.com/article123". Use search URLs.
    
    Example: 
    {{
      "articles": [ {{"title": "Understanding {topic} - Investopedia", "url": "https://www.google.com/search?q=Understanding+{topic}+Investopedia"}} ],
      "videos": [ {{"title": "Beginner's Guide to {topic}", "url": "https://www.youtube.com/results?search_query=Beginners+Guide+{topic}"}} ]
    }}
    """
    model = genai.GenerativeModel('gemini-3-flash-preview')
    response = model.generate_content(prompt)
    text = response.text.replace('```json', '').replace('```', '').strip()
    start_idx = text.find('{')
    end_idx = text.rfind('}')
    if start_idx != -1 and end_idx != -1:
        text = text[start_idx:end_idx+1]
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        return {"error": "Failed to parse JSON explanation", "raw": text}
