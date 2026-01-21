import requests
import json

url = "http://localhost:5001/recommend-resources"
data = {"topic": "Apply for PAN Card Submit"}

try:
    response = requests.post(url, json=data)
    print(f"Status: {response.status_code}")
    print("Response:")
    print(json.dumps(response.json(), indent=2))
except Exception as e:
    print(f"Error: {e}")
