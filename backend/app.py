from flask import Flask, request, jsonify
from flask_cors import CORS

import requests
import re
import socket
import ssl
import whois
from datetime import datetime
from urllib.parse import urlparse
from concurrent.futures import ThreadPoolExecutor

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
    headers_req = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }

    response = requests.get(
        url,
        headers=headers_req,
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
        "Content-Security-Policy": headers.get("Content-Security-Policy", "Missing"),
        "Referrer-Policy": headers.get("Referrer-Policy", "Missing"),
        "Strict-Transport-Security": headers.get("Strict-Transport-Security", "Missing"),
        "X-Content-Type-Options": headers.get("X-Content-Type-Options", "Missing"),
        "X-Frame-Options": headers.get("X-Frame-Options", "Missing"),
        "Permissions-Policy": headers.get("Permissions-Policy", "Missing"),
        "X-XSS-Protection": headers.get("X-XSS-Protection", "Missing"),
    }

    return security_headers, fetched


# -----------------------------------
# IP GEOLOCATION & NETWORK INTEL
# -----------------------------------

def analyze_ip_geo(url):
    parsed = urlparse(url)
    hostname = parsed.netloc or parsed.path
    hostname = hostname.split("/")[0].split(":")[0]

    try:
        ip = socket.gethostbyname(hostname)
        res = requests.get(f"http://ip-api.com/json/{ip}", timeout=4)
        if res.status_code == 200:
            geo = res.json()
            if geo.get("status") == "success":
                return {
                    "ip": ip,
                    "country": geo.get("country", "Unknown"),
                    "country_code": geo.get("countryCode", ""),
                    "city": geo.get("city", "Unknown"),
                    "region": geo.get("regionName", ""),
                    "isp": geo.get("isp", "Unknown"),
                    "org": geo.get("org", "Unknown"),
                    "asn": geo.get("as", "Unknown"),
                    "lat": geo.get("lat"),
                    "lon": geo.get("lon"),
                    "timezone": geo.get("timezone", "")
                }
        return {"ip": ip, "country": "Unknown", "isp": "Unknown", "org": "Unknown"}
    except Exception as e:
        return {"ip": "Unavailable", "error": str(e)}


# -----------------------------------
# TECH STACK FINGERPRINTING
# -----------------------------------

def detect_tech_stack(raw_headers):
    techs = []
    headers_lower = {k.lower(): v for k, v in (raw_headers or {}).items()}

    server = headers_lower.get("server")
    if server:
        techs.append({"category": "Web Server", "name": server})

    powered_by = headers_lower.get("x-powered-by")
    if powered_by:
        techs.append({"category": "Backend / Framework", "name": powered_by})

    via = headers_lower.get("via")
    if via:
        techs.append({"category": "Proxy / CDN", "name": via})

    if "cf-ray" in headers_lower or "cf-cache-status" in headers_lower:
        techs.append({"category": "CDN & WAF Protection", "name": "Cloudflare"})
    if "x-amz-cf-id" in headers_lower or "x-amz-request-id" in headers_lower:
        techs.append({"category": "Cloud Infrastructure", "name": "Amazon Web Services (AWS)"})
    if "x-github-request-id" in headers_lower:
        techs.append({"category": "Hosting Platform", "name": "GitHub Pages"})
    if "x-pantheon-styx-hostname" in headers_lower:
        techs.append({"category": "Hosting Platform", "name": "Pantheon CMS"})
    if "x-vtex-backend-status" in headers_lower:
        techs.append({"category": "E-Commerce Engine", "name": "VTEX"})

    return techs


# -----------------------------------
# HTTP PERFORMANCE & REDIRECT TRACER
# -----------------------------------

def analyze_http_perf(url):
    try:
        headers_req = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }
        start_time = datetime.now()
        res = requests.get(url, headers=headers_req, timeout=6, allow_redirects=True)
        elapsed_ms = int((datetime.now() - start_time).total_seconds() * 1000)

        redirect_chain = []
        for r in res.history:
            redirect_chain.append({
                "status_code": r.status_code,
                "url": r.url
            })

        return {
            "response_time_ms": elapsed_ms,
            "status_code": res.status_code,
            "final_url": res.url,
            "redirect_count": len(redirect_chain),
            "redirect_chain": redirect_chain,
            "content_type": res.headers.get("Content-Type", "Unknown"),
            "content_length": len(res.content) if res.content else 0
        }
    except Exception as e:
        return {"response_time_ms": 0, "error": str(e)}


# -----------------------------------
# SECURITY POLICY FILES (ROBOTS / SECURITY.TXT)
# -----------------------------------

def check_security_files(url):
    parsed = urlparse(url)
    base_url = f"{parsed.scheme}://{parsed.netloc}"
    headers_req = {"User-Agent": "Mozilla/5.0"}

    robots_found = False
    robots_content = ""
    security_txt_found = False
    security_txt_content = ""

    try:
        res = requests.get(f"{base_url}/robots.txt", headers=headers_req, timeout=3)
        if res.status_code == 200 and ("user-agent" in res.text.lower() or "disallow" in res.text.lower()):
            robots_found = True
            robots_content = res.text[:600]
    except Exception:
        pass

    try:
        res = requests.get(f"{base_url}/.well-known/security.txt", headers=headers_req, timeout=3)
        if res.status_code == 200 and ("contact" in res.text.lower() or "expires" in res.text.lower()):
            security_txt_found = True
            security_txt_content = res.text[:600]
    except Exception:
        pass

    return {
        "robots_txt": {"found": robots_found, "preview": robots_content},
        "security_txt": {"found": security_txt_found, "preview": security_txt_content}
    }


# -----------------------------------
# SSL / TLS INSPECTOR
# -----------------------------------

def analyze_ssl(url):
    parsed = urlparse(url)
    hostname = parsed.netloc or parsed.path
    hostname = hostname.split("/")[0].split(":")[0]

    if not hostname:
        return {"success": False, "error": "Invalid hostname"}

    try:
        context = ssl.create_default_context()
        with socket.create_connection((hostname, 443), timeout=5) as sock:
            with context.wrap_socket(sock, server_hostname=hostname) as ssock:
                cert = ssock.getpeercert()
                cipher = ssock.cipher()
                protocol = ssock.version()

        not_before_str = cert.get("notBefore")
        not_after_str = cert.get("notAfter")

        fmt = "%b %d %H:%M:%S %Y %Z"
        not_after = datetime.strptime(not_after_str, fmt) if not_after_str else None
        not_before = datetime.strptime(not_before_str, fmt) if not_before_str else None

        days_remaining = (not_after - datetime.utcnow()).days if not_after else None

        issuer = {}
        for item in cert.get("issuer", ()):
            for key, val in item:
                issuer[key] = val

        subject = {}
        for item in cert.get("subject", ()):
            for key, val in item:
                subject[key] = val

        sans = [val for key, val in cert.get("subjectAltName", ()) if key == "DNS"]

        is_valid = True
        warning = None
        if days_remaining is not None and days_remaining < 0:
            is_valid = False
            warning = "SSL Certificate has expired!"
        elif days_remaining is not None and days_remaining < 30:
            warning = f"SSL Certificate expires soon ({days_remaining} days remaining)"

        return {
            "success": True,
            "hostname": hostname,
            "is_valid": is_valid,
            "issuer": issuer.get("organizationName") or issuer.get("commonName") or "Unknown Issuer",
            "issuer_full": issuer,
            "subject": subject.get("commonName") or hostname,
            "valid_from": not_before_str,
            "valid_to": not_after_str,
            "days_remaining": days_remaining,
            "protocol": protocol,
            "cipher": cipher[0] if cipher else "Unknown",
            "sans": sans[:10],
            "warning": warning,
        }
    except Exception as e:
        return {
            "success": False,
            "hostname": hostname,
            "is_valid": False,
            "error": str(e),
            "warning": f"SSL connection failed: {str(e)}",
        }


# -----------------------------------
# DNS & EMAIL SECURITY INSPECTOR
# -----------------------------------

def analyze_dns(url):
    parsed = urlparse(url)
    domain = parsed.netloc or parsed.path
    domain = domain.split("/")[0].split(":")[0]

    if not domain:
        return {"success": False, "error": "Invalid domain"}

    records = {"A": [], "AAAA": [], "MX": [], "TXT": [], "NS": []}
    spf_found = False
    dmarc_found = False
    spf_record = None
    dmarc_record = None

    def query_doh(name, type_name):
        try:
            res = requests.get(
                "https://cloudflare-dns.com/dns-query",
                params={"name": name, "type": type_name},
                headers={"accept": "application/dns-json"},
                timeout=4
            )
            if res.status_code == 200:
                data = res.json()
                if "Answer" in data:
                    return [ans.get("data", "").strip('"') for ans in data["Answer"]]
        except Exception:
            pass
        return []

    records["A"] = query_doh(domain, "A")
    records["AAAA"] = query_doh(domain, "AAAA")
    records["MX"] = query_doh(domain, "MX")
    txt_records = query_doh(domain, "TXT")
    records["TXT"] = txt_records
    records["NS"] = query_doh(domain, "NS")

    for txt in txt_records:
        if "v=spf1" in txt.lower():
            spf_found = True
            spf_record = txt
        if "v=dmarc1" in txt.lower():
            dmarc_found = True
            dmarc_record = txt

    if not dmarc_found:
        dmarc_txts = query_doh(f"_dmarc.{domain}", "TXT")
        for txt in dmarc_txts:
            if "v=dmarc1" in txt.lower():
                dmarc_found = True
                dmarc_record = txt

    return {
        "success": True,
        "domain": domain,
        "records": records,
        "email_security": {
            "spf_configured": spf_found,
            "spf_record": spf_record,
            "dmarc_configured": dmarc_found,
            "dmarc_record": dmarc_record,
        }
    }


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

        registrar = str(domain_info.registrar)
        creation_date = str(domain_info.creation_date)
        expiration_date = str(domain_info.expiration_date)

        raw_whois = getattr(domain_info, "text", None)
        if raw_whois is None:
            raw_whois = str(domain_info)

        return {
            "domain": domain,
            "registrar": registrar if registrar != "None" else "Unknown",
            "creation_date": creation_date if creation_date != "None" else "Unknown",
            "expiration_date": expiration_date if expiration_date != "None" else "Unknown",
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

    if not url.startswith("https://"):
        score += 20
        reasons.append("Website is not using HTTPS")

    if len(url) > 75:
        score += 10
        reasons.append("URL length is unusually long")

    ip_pattern = r"^(\d{1,3}\.){3}\d{1,3}$"
    if re.match(ip_pattern, domain):
        score += 25
        reasons.append("IP address used instead of domain name")

    suspicious_keywords = [
        "login", "verify", "secure", "account", "update",
        "banking", "paypal", "signin", "password"
    ]
    for keyword in suspicious_keywords:
        if keyword in url.lower():
            score += 8
            reasons.append(f"Suspicious keyword detected: {keyword}")

    if domain.count("-") >= 2:
        score += 10
        reasons.append("Too many hyphens in domain name")

    if domain.count(".") > 3:
        score += 10
        reasons.append("Too many subdomains detected")

    if "@" in url:
        score += 20
        reasons.append("@ symbol detected in URL")

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

def check_single_port(host, port, service):
    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(0.5)
        result = sock.connect_ex((host, port))
        sock.close()
        if result == 0:
            return {"port": port, "service": service, "status": "OPEN"}
    except Exception:
        pass
    return None


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

    parsed = urlparse(url)
    host = parsed.netloc or parsed.path
    host = host.split("/")[0].split(":")[0]

    if not host:
        return []

    results = []
    with ThreadPoolExecutor(max_workers=10) as executor:
        futures = [
            executor.submit(check_single_port, host, port, service)
            for port, service in common_ports.items()
        ]
        for future in futures:
            res = future.result()
            if res:
                results.append(res)

    results.sort(key=lambda x: x["port"])
    return results


# -----------------------------------
# REMEDIATION & GRADE ENGINE
# -----------------------------------

def generate_remediation(headers, ssl_data, dns_data):
    remediations = []

    if headers.get("Content-Security-Policy") == "Missing":
        remediations.append({
            "title": "Missing Content-Security-Policy (CSP)",
            "severity": "HIGH",
            "impact": "Prevents Cross-Site Scripting (XSS) and malicious data injection.",
            "nginx": "add_header Content-Security-Policy \"default-src 'self'; script-src 'self' 'unsafe-inline'; object-src 'none';\" always;",
            "apache": "Header set Content-Security-Policy \"default-src 'self'; script-src 'self' 'unsafe-inline'; object-src 'none';\"",
            "meta": "<meta http-equiv=\"Content-Security-Policy\" content=\"default-src 'self';\">"
        })

    if headers.get("Strict-Transport-Security") == "Missing":
        remediations.append({
            "title": "Missing Strict-Transport-Security (HSTS)",
            "severity": "HIGH",
            "impact": "Enforces HTTPS connections and prevents man-in-the-middle SSL stripping.",
            "nginx": "add_header Strict-Transport-Security \"max-age=31536000; includeSubDomains; preload\" always;",
            "apache": "Header always set Strict-Transport-Security \"max-age=31536000; includeSubDomains; preload\"",
            "meta": "Must be configured at web server level via HTTP response headers."
        })

    if headers.get("X-Frame-Options") == "Missing":
        remediations.append({
            "title": "Missing X-Frame-Options",
            "severity": "MEDIUM",
            "impact": "Protects against Clickjacking by disabling unauthorized framing of your site.",
            "nginx": "add_header X-Frame-Options \"SAMEORIGIN\" always;",
            "apache": "Header always set X-Frame-Options \"SAMEORIGIN\"",
            "meta": "Must be configured at web server level via HTTP response headers."
        })

    if headers.get("X-Content-Type-Options") == "Missing":
        remediations.append({
            "title": "Missing X-Content-Type-Options",
            "severity": "MEDIUM",
            "impact": "Prevents browsers from MIME-sniffing responses away from declared Content-Type.",
            "nginx": "add_header X-Content-Type-Options \"nosniff\" always;",
            "apache": "Header set X-Content-Type-Options \"nosniff\"",
            "meta": "Must be configured at web server level via HTTP response headers."
        })

    if headers.get("Referrer-Policy") == "Missing":
        remediations.append({
            "title": "Missing Referrer-Policy",
            "severity": "LOW",
            "impact": "Controls how much referrer metadata is sent along with HTTP requests.",
            "nginx": "add_header Referrer-Policy \"strict-origin-when-cross-origin\" always;",
            "apache": "Header set Referrer-Policy \"strict-origin-when-cross-origin\"",
            "meta": "<meta name=\"referrer\" content=\"strict-origin-when-cross-origin\">"
        })

    if dns_data and dns_data.get("success"):
        email_sec = dns_data.get("email_security", {})
        if not email_sec.get("spf_configured"):
            remediations.append({
                "title": "Missing SPF Record in DNS",
                "severity": "MEDIUM",
                "impact": "Allows attackers to spoof emails originating from your domain name.",
                "nginx": "DNS TXT Record on root domain: v=spf1 mx ~all",
                "apache": "DNS TXT Record on root domain: v=spf1 mx ~all",
                "meta": "Add TXT Record in DNS panel: Name: @ | Value: v=spf1 mx ~all"
            })
        if not email_sec.get("dmarc_configured"):
            remediations.append({
                "title": "Missing DMARC Record in DNS",
                "severity": "MEDIUM",
                "impact": "Receiving servers cannot verify SPF/DKIM policy alignment without DMARC.",
                "nginx": "DNS TXT Record on _dmarc domain: v=DMARC1; p=none; sp=none;",
                "apache": "DNS TXT Record on _dmarc domain: v=DMARC1; p=none; sp=none;",
                "meta": "Add TXT Record in DNS panel: Name: _dmarc | Value: v=DMARC1; p=none; sp=none;"
            })

    return remediations


def calculate_overall_security_grade(headers, ssl_data, dns_data, phishing_data, ports_data):
    score = 100

    missing_headers = [k for k, v in headers.items() if v == "Missing"]
    score -= len(missing_headers) * 6

    if not ssl_data.get("success") or not ssl_data.get("is_valid"):
        score -= 25
    elif ssl_data.get("days_remaining") is not None and ssl_data.get("days_remaining") < 30:
        score -= 10

    if dns_data and dns_data.get("success"):
        email_sec = dns_data.get("email_security", {})
        if not email_sec.get("spf_configured"):
            score -= 8
        if not email_sec.get("dmarc_configured"):
            score -= 7

    phishing_score = phishing_data.get("score", 0) if phishing_data else 0
    score -= min(15, int(phishing_score * 0.3))

    high_risk_ports = [21, 22, 25, 3306]
    exposed_high_risk = [p for p in (ports_data or []) if p.get("port") in high_risk_ports]
    score -= len(exposed_high_risk) * 5

    score = max(0, min(100, score))

    if score >= 90:
        grade = "A+"
        status = "EXCELLENT"
    elif score >= 80:
        grade = "A"
        status = "GOOD"
    elif score >= 70:
        grade = "B"
        status = "FAIR"
    elif score >= 55:
        grade = "C"
        status = "MODERATE RISK"
    elif score >= 40:
        grade = "D"
        status = "HIGH RISK"
    else:
        grade = "F"
        status = "CRITICAL RISK"

    return {
        "score": score,
        "grade": grade,
        "status": status,
    }


def generate_risk_summary(headers, phishing, ports):
    issues = [key for key, value in headers.items() if value == "Missing"]

    summary = ""
    if len(issues) == 0:
        summary += "The website has robust security header protections configured. "
    else:
        summary += f"The website is missing {len(issues)} security headers including " + ", ".join(issues) + ". "

    if phishing["verdict"] == "SAFE":
        summary += "Phishing analysis indicates low URL risk. "
    elif phishing["verdict"] == "SUSPICIOUS":
        summary += "The URL contains suspicious phishing indicators. "
    else:
        summary += "The URL appears highly suspicious and potentially dangerous. "

    if len(ports) > 0:
        open_ports = [str(port["port"]) for port in ports]
        summary += "Open ports detected: " + ", ".join(open_ports) + ". "
    else:
        summary += "No common open ports were detected. "

    return summary


# -----------------------------------
# FULL UNIFIED SCAN ROUTE
# -----------------------------------

@app.route("/scan/full", methods=["POST"])
def scan_full():
    data = request.json
    try:
        url = get_request_url(data)
    except ValueError as e:
        return jsonify({"success": False, "error": str(e)}), 400

    try:
        with ThreadPoolExecutor(max_workers=8) as executor:
            fut_headers = executor.submit(check_headers, url)
            fut_ssl = executor.submit(analyze_ssl, url)
            fut_dns = executor.submit(analyze_dns, url)
            fut_phishing = executor.submit(analyze_phishing, url)
            fut_ports = executor.submit(scan_ports, url)
            fut_whois = executor.submit(get_domain_info, url)
            fut_geo = executor.submit(analyze_ip_geo, url)
            fut_perf = executor.submit(analyze_http_perf, url)
            fut_files = executor.submit(check_security_files, url)

            headers, fetched = fut_headers.result()
            ssl_data = fut_ssl.result()
            dns_data = fut_dns.result()
            phishing = fut_phishing.result()
            ports = fut_ports.result()
            domain_info = fut_whois.result()
            geo_info = fut_geo.result()
            perf_info = fut_perf.result()
            security_files = fut_files.result()

        tech_stack = detect_tech_stack(fetched.get("raw_headers"))
        remediations = generate_remediation(headers, ssl_data, dns_data)
        overall = calculate_overall_security_grade(headers, ssl_data, dns_data, phishing, ports)
        summary = generate_risk_summary(headers, phishing, ports)

        return jsonify({
            "success": True,
            "url": url,
            "overall": overall,
            "summary": summary,
            "headers": headers,
            "raw_headers": fetched.get("raw_headers"),
            "status_code": fetched.get("status_code"),
            "final_url": fetched.get("final_url"),
            "ssl": ssl_data,
            "dns": dns_data,
            "phishing": phishing,
            "ports": ports,
            "domain_info": domain_info,
            "geo_info": geo_info,
            "tech_stack": tech_stack,
            "perf_info": perf_info,
            "security_files": security_files,
            "remediations": remediations
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


# -----------------------------------
# INDIVIDUAL MODULAR ROUTES
# -----------------------------------

@app.route("/scan/geo", methods=["POST"])
def geo_scan():
    data = request.json
    try:
        url = get_request_url(data)
        geo = analyze_ip_geo(url)
        return jsonify({"success": True, "geo": geo})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route("/scan/headers", methods=["POST"])
def scan_headers():
    data = request.json
    try:
        url = get_request_url(data)
        headers, fetched = check_headers(url)
        return jsonify({
            "success": True,
            "headers": headers,
            "raw_headers": fetched.get("raw_headers"),
            "status_code": fetched.get("status_code"),
            "final_url": fetched.get("final_url"),
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route("/scan/ssl", methods=["POST"])
def ssl_scan():
    data = request.json
    try:
        url = get_request_url(data)
        result = analyze_ssl(url)
        return jsonify({"success": True, "ssl": result})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route("/scan/dns", methods=["POST"])
def dns_scan():
    data = request.json
    try:
        url = get_request_url(data)
        result = analyze_dns(url)
        return jsonify({"success": True, "dns": result})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route("/scan/phishing", methods=["POST"])
def phishing_scan():
    data = request.json
    try:
        url = get_request_url(data)
        result = analyze_phishing(url)
        return jsonify({"success": True, "result": result})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route("/scan/ports", methods=["POST"])
def port_scan():
    data = request.json
    try:
        url = get_request_url(data)
        results = scan_ports(url)
        return jsonify({"success": True, "ports": results})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route("/scan/summary", methods=["POST"])
def risk_summary():
    data = request.json
    try:
        url = get_request_url(data)
        headers, fetched = check_headers(url)
        phishing = analyze_phishing(url)
        ports = scan_ports(url)
        summary = generate_risk_summary(headers, phishing, ports)

        return jsonify({
            "success": True,
            "summary": summary,
            "raw_headers": fetched.get("raw_headers"),
            "status_code": fetched.get("status_code"),
            "final_url": fetched.get("final_url"),
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route("/scan/domain", methods=["POST"])
def domain_scan():
    data = request.json
    try:
        url = get_request_url(data)
        info = get_domain_info(url)
        return jsonify({"success": True, "info": info})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


# -----------------------------------
# RUN SERVER
# -----------------------------------

if __name__ == "__main__":
    app.run(debug=True, port=8000)