import requests

links = [
    "https://cleartax.in/s/pan-card",
    "https://www.onlineservices.nsdl.com/paam/endUserRegisterContact.html",
    "https://myaadhaar.uidai.gov.in/",
    "https://voters.eci.gov.in/",
    "https://www.passportindia.gov.in/",
    "https://www.incometax.gov.in/iec/foportal/"
]

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
}

print("Checking fixed links...")
for url in links:
    try:
        r = requests.get(url, headers=headers, timeout=5)
        print(f"[{r.status_code}] {url}")
    except Exception as e:
        print(f"[FAIL] {url} - {e}")
