from flask import Flask, request, jsonify
from flask_cors import CORS

import requests
import re
import socket
import whois

from urllib.parse import urlparse

app = Flask(__name__)

CORS(app)

def normalize_url(url):
    if not url or not str(url).strip():
        raise ValueError("URL is required")
    url = str(url).strip()
    if not url.startswith(("http://", "https://")):
        url = "https://" + url
    return url


def get_request_url(data):
    return normalize_url(data.get("url") if data else "")

# -----------------------------------
# SECURITY HEADER SCANNER
# -----------------------------------

def fetch_headers(url):

    response = requests.get(
        url,
        timeout=5
    )

    headers = response.headers

    return {
        "raw_headers": dict(headers),
        "status_code": response.status_code,
        "final_url": response.url,
    }


def check_headers(url):

    fetched = fetch_headers(url)
    headers = fetched["raw_headers"]

    security_headers = {

        "Content-Security-Policy":
            headers.get(
                "Content-Security-Policy",
                "Missing"
            ),

        "Referrer-Policy":
            headers.get(
                "Referrer-Policy",
                "Missing"
            ),

        "Strict-Transport-Security":
            headers.get(
                "Strict-Transport-Security",
                "Missing"
            ),

        "X-Content-Type-Options":
            headers.get(
                "X-Content-Type-Options",
                "Missing"
            ),

        "X-Frame-Options":
            headers.get(
                "X-Frame-Options",
                "Missing"
            ),

    }

    return security_headers, fetched


# -----------------------------------
# WHOIS FUNCTION
# -----------------------------------

def get_domain_info(url):

    domain = ""

    try:

        parsed = urlparse(url)

        domain = parsed.netloc or parsed.path
        domain = domain.split(":")[0]

        if not domain:
            raise ValueError("Invalid URL")

        ip = socket.gethostbyname(domain)

        domain_info = whois.whois(domain)

        registrar = str(
            domain_info.registrar
        )

        creation_date = str(
            domain_info.creation_date
        )

        expiration_date = str(
            domain_info.expiration_date
        )

        raw_whois = getattr(domain_info, "text", None)
        if raw_whois is None:
            raw_whois = str(domain_info)

        return {

            "domain": domain,

            "registrar":
                registrar
                if registrar != "None"
                else "Unknown",

            "creation_date":
                creation_date
                if creation_date != "None"
                else "Unknown",

            "expiration_date":
                expiration_date
                if expiration_date != "None"
                else "Unknown",

            "ip": ip,
            "raw_whois": raw_whois,

        }

    except Exception as e:

        return {

            "domain": domain,

            "registrar": "Unavailable",

            "creation_date": "Unavailable",

            "expiration_date": "Unavailable",

            "ip": "Unavailable",

            "raw_whois": "",

            "error": str(e)

        }


# -----------------------------------
# PHISHING DETECTION
# -----------------------------------

def analyze_phishing(url):

    score = 0

    reasons = []

    parsed = urlparse(url)

    domain = parsed.netloc.lower()

    # HTTPS CHECK

    if not url.startswith("https://"):

        score += 20

        reasons.append(
            "Website is not using HTTPS"
        )

    # LONG URL CHECK

    if len(url) > 75:

        score += 10

        reasons.append(
            "URL length is unusually long"
        )

    # IP ADDRESS CHECK

    ip_pattern = r"^(\d{1,3}\.){3}\d{1,3}$"

    if re.match(ip_pattern, domain):

        score += 25

        reasons.append(
            "IP address used instead of domain"
        )

    # SUSPICIOUS KEYWORDS

    suspicious_keywords = [

        "login",
        "verify",
        "secure",
        "account",
        "update",
        "banking",
        "paypal",
        "signin",
        "password",

    ]

    for keyword in suspicious_keywords:

        if keyword in url.lower():

            score += 8

            reasons.append(
                f"Suspicious keyword detected: {keyword}"
            )

    # TOO MANY HYPHENS

    if domain.count("-") >= 2:

        score += 10

        reasons.append(
            "Too many hyphens in domain"
        )

    # TOO MANY SUBDOMAINS

    if domain.count(".") > 3:

        score += 10

        reasons.append(
            "Too many subdomains detected"
        )

    # @ SYMBOL CHECK

    if "@" in url:

        score += 20

        reasons.append(
            "@ symbol detected in URL"
        )

    # FINAL VERDICT

    if score <= 20:

        verdict = "SAFE"

    elif score <= 50:

        verdict = "SUSPICIOUS"

    else:

        verdict = "DANGEROUS"

    return {

        "score": score,
        "verdict": verdict,
        "reasons": reasons,

    }


# -----------------------------------
# PORT SCANNER
# -----------------------------------

def scan_ports(url):

    common_ports = {

        21: "FTP",
        22: "SSH",
        25: "SMTP",
        53: "DNS",
        80: "HTTP",
        110: "POP3",
        143: "IMAP",
        443: "HTTPS",
        3306: "MySQL",
        8080: "HTTP-ALT",

    }

    results = []

    parsed = urlparse(url)
    host = parsed.netloc or parsed.path
    host = host.split("/")[0].split(":")[0]

    if not host:
        return results

    for port, service in common_ports.items():

        sock = socket.socket(
            socket.AF_INET,
            socket.SOCK_STREAM
        )

        sock.settimeout(0.3)

        result = sock.connect_ex(
            (host, port)
        )

        if result == 0:

            results.append({

                "port": port,
                "service": service,
                "status": "OPEN"

            })

        sock.close()

    return results


# -----------------------------------
# AI RISK SUMMARY
# -----------------------------------

def generate_risk_summary(headers, phishing, ports):

    issues = []

    for key, value in headers.items():

        if value == "Missing":

            issues.append(key)

    summary = ""

    # Header Analysis

    if len(issues) == 0:

        summary += (
            "The website has strong security "
            "header protection configured. "
        )

    else:

        summary += (

            f"The website is missing "
            f"{len(issues)} important "
            f"security protections including "

            + ", ".join(issues)

            + ". "

        )

    # Phishing Analysis

    if phishing["verdict"] == "SAFE":

        summary += (
            "URL analysis indicates low phishing risk. "
        )

    elif phishing["verdict"] == "SUSPICIOUS":

        summary += (
            "The URL contains suspicious phishing indicators. "
        )

    else:

        summary += (
            "The URL appears highly suspicious "
            "and potentially dangerous. "
        )

    # Port Analysis

    if len(ports) > 0:

        open_ports = [

            str(port["port"])

            for port in ports

        ]

        summary += (

            "Open ports detected: "

            + ", ".join(open_ports)

            + ". "

        )

    else:

        summary += (
            "No common open ports were detected. "
        )

    return summary


# -----------------------------------
# HEADER SCAN ROUTE
# -----------------------------------

@app.route("/scan/headers", methods=["POST"])

def scan_headers():

    data = request.json

    try:
        url = get_request_url(data)
    except ValueError as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 400

    try:

        headers, fetched = check_headers(url)

        return jsonify({

            "success": True,
            "headers": headers,
            "raw_headers": fetched.get("raw_headers"),
            "status_code": fetched.get("status_code"),
            "final_url": fetched.get("final_url"),

        })

    except Exception as e:

        return jsonify({

            "success": False,
            "error": str(e)

        }), 500


# -----------------------------------
# PHISHING ROUTE
# -----------------------------------

@app.route("/scan/phishing", methods=["POST"])

def phishing_scan():

    data = request.json

    try:
        url = get_request_url(data)
    except ValueError as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 400

    try:

        result = analyze_phishing(url)

        return jsonify({

            "success": True,
            "result": result

        })

    except Exception as e:

        return jsonify({

            "success": False,
            "error": str(e)

        }), 500


# -----------------------------------
# PORT SCAN ROUTE
# -----------------------------------

@app.route("/scan/ports", methods=["POST"])

def port_scan():

    data = request.json

    try:
        url = get_request_url(data)
    except ValueError as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 400

    try:

        results = scan_ports(url)

        return jsonify({

            "success": True,
            "ports": results

        })

    except Exception as e:

        return jsonify({

            "success": False,
            "error": str(e)

        }), 500


# -----------------------------------
# AI SUMMARY ROUTE
# -----------------------------------

@app.route("/scan/summary", methods=["POST"])

def risk_summary():

    data = request.json

    try:
        url = get_request_url(data)
    except ValueError as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 400

    try:

        headers, fetched = check_headers(url)

        phishing = analyze_phishing(url)

        ports = scan_ports(url)

        summary = generate_risk_summary(
            headers,
            phishing,
            ports
        )

        return jsonify({

            "success": True,
            "summary": summary,
            "raw_headers": fetched.get("raw_headers"),
            "status_code": fetched.get("status_code"),
            "final_url": fetched.get("final_url"),

        })

    except Exception as e:

        return jsonify({

            "success": False,
            "error": str(e)

        }), 500


# -----------------------------------
# WHOIS ROUTE
# -----------------------------------

@app.route("/scan/domain", methods=["POST"])

def domain_scan():

    data = request.json

    try:
        url = get_request_url(data)
    except ValueError as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 400

    try:

        info = get_domain_info(url)

        return jsonify({
            "success": True,
            "info": info
        })

    except Exception as e:

        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


# -----------------------------------
# RUN SERVER
# -----------------------------------

if __name__ == "__main__":

    app.run(
        debug=True,
        port=8000
    )