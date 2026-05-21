import requests

SECURITY_HEADERS = [
    "Content-Security-Policy",
    "Strict-Transport-Security",
    "X-Frame-Options",
    "X-Content-Type-Options",
    "Referrer-Policy"
]

def scan_headers(url):
    try:
        response = requests.get(url, timeout=5)

        results = {}

        for header in SECURITY_HEADERS:
            if header in response.headers:
                results[header] = "Present"
            else:
                results[header] = "Missing"

        return {
            "success": True,
            "url": url,
            "headers": results
        }

    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }