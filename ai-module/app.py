from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
import gemini_service
import scraper_service

load_dotenv()

app = Flask(__name__)
CORS(app)

@app.route('/', methods=['GET'])
def health_check():
    return jsonify({"status": "AI Module is running"})

@app.route('/generate-explanation', methods=['POST'])
def generate_explanation():
    data = request.json
    topic = data.get('topic')
    context = data.get('context', '')
    
    if not topic:
        return jsonify({"error": "Topic is required"}), 400

    try:
        explanation = gemini_service.get_explanation(topic, context)
        return jsonify({"explanation": explanation})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/recommend-resources', methods=['POST'])
def recommend_resources():
    data = request.json
    topic = data.get('topic')
    print(f"DEBUG: Received recommendation request for topic: '{topic}'") # Debug print
    
    if not topic:
        return jsonify({"error": "Topic is required"}), 400

    try:
        # Use Real Scraping instead of Gemini
        resources = scraper_service.get_real_recommendations(topic)
        print(f"DEBUG: Returning {len(resources.get('articles', []))} articles and {len(resources.get('videos', []))} videos")
        return jsonify({"resources": resources})
    except Exception as e:
        print(f"ERROR in recommend_resources: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5001))
    app.run(port=port, debug=True)
