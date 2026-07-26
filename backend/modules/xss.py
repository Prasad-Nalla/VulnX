import requests
import html
from urllib.parse import urlparse, parse_qs, urlencode, urlunparse

XSS_PAYLOADS = [
    {"payload": "<script>alert('VulnX_XSS')</script>", "label": "Basic Script Tag Injection"},
    {"payload": '"><img src=x onerror=alert("VulnX")>', "label": "Event Handler Attribute Injection"},
    {"payload": "'\"><svg/onload=alert('VulnX')>", "label": "SVG Vector Injection"},
    {"payload": "javascript:alert('VulnX')", "label": "Pseudo-Protocol URI Injection"}
]

def scan_xss(url, crawled_forms=None, crawled_urls=None):
    """
    Performs active Reflected XSS probing against GET parameters and crawled forms.
    """
    findings = []
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) VulnX Security Audit Engine"
    }

    # 1. Test URL GET Query Parameters
    parsed = urlparse(url)
    if parsed.query:
        query_params = parse_qs(parsed.query)
        for param in query_params:
            for item in XSS_PAYLOADS:
                payload = item["payload"]
                modified_params = query_params.copy()
                modified_params[param] = [payload]
                new_query = urlencode(modified_params, doseq=True)
                test_url = urlunparse((
                    parsed.scheme, parsed.netloc, parsed.path,
                    parsed.params, new_query, parsed.fragment
                ))

                try:
                    res = requests.get(test_url, headers=headers, timeout=3)
                    # Check if unescaped payload exists in HTML body
                    if payload in res.text and html.escape(payload) not in res.text:
                        findings.append({
                            "type": "Reflected Cross-Site Scripting (XSS)",
                            "target_url": url,
                            "parameter": param,
                            "payload": payload,
                            "severity": "HIGH",
                            "evidence": f"Payload '{payload}' was reflected verbatim in HTTP response body without HTML sanitization.",
                            "remediation": "Apply contextual output encoding (e.g. HTML entity encoding) before rendering user input."
                        })
                        break
                except Exception:
                    pass

    # 2. Test Crawled Forms
    if crawled_forms:
        for form in crawled_forms[:5]:
            form_url = form.get("form_url") or url
            method = form.get("method", "GET")
            inputs = form.get("inputs", [])

            for inp in inputs:
                input_name = inp.get("name")
                if not input_name:
                    continue

                for item in XSS_PAYLOADS:
                    payload = item["payload"]
                    data = {}
                    for field in inputs:
                        fname = field.get("name")
                        if fname:
                            data[fname] = payload if fname == input_name else "test"

                    try:
                        if method == "POST":
                            res = requests.post(form_url, data=data, headers=headers, timeout=3)
                        else:
                            res = requests.get(form_url, params=data, headers=headers, timeout=3)

                        if payload in res.text and html.escape(payload) not in res.text:
                            findings.append({
                                "type": f"Form Input Reflected XSS ({method})",
                                "target_url": form_url,
                                "parameter": input_name,
                                "payload": payload,
                                "severity": "HIGH",
                                "evidence": f"Form parameter '{input_name}' reflected unescaped payload in response HTML.",
                                "remediation": "Implement strict input validation and enforce Content-Security-Policy (CSP) headers."
                            })
                            break
                    except Exception:
                        pass

    return {
        "vulnerable": len(findings) > 0,
        "count": len(findings),
        "findings": findings
    }
