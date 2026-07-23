# VulnX — Automated Web Vulnerability & Threat Intelligence Toolkit

VulnX is a modern web security analysis toolkit featuring a React + Vite frontend and a Python Flask backend API.

## Project Structure

- `frontend/` – React + Vite user interface with tabbed cyber dashboard.
- `backend/` – Python Flask API providing security audits, SSL inspection, DNS lookup, IP geolocation, tech fingerprinting, and multithreaded port scanning.

## Running the Project

### 1. Start the Backend API (Python Flask)

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python app.py
```

The API backend runs on `http://127.0.0.1:8000` by default.

### 2. Start the Frontend (React + Vite)

```powershell
cd frontend
npm install
npm run dev
```

Then open the local Vite URL (e.g. `http://localhost:5173`) in your browser.

## Configuration

The frontend uses `VITE_API_URL` when present. If not set, it defaults to `http://127.0.0.1:8000`.

Example `.env` inside `frontend/`:

```env
VITE_API_URL=http://127.0.0.1:8000
```

## Key Features

- 📊 **Executive Security Rating & Score**: Overall score (0-100) and letter grade (`A+` to `F`).
- 🛡️ **Security Header Audit**: Evaluates CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, and Permissions-Policy.
- 🌍 **IP Geolocation & Hosting Intelligence**: IP address, country, city, region, ISP, organization, and ASN.
- ⚡ **Web Tech Stack Fingerprinting**: Detects web servers (Nginx, Apache, LiteSpeed), frameworks, and CDN/WAF protections (Cloudflare, AWS).
- ⏱️ **HTTP Performance & Redirect Chain**: Response latency in ms and 301/302 redirect history tracing.
- 📄 **Security Policy File Inspection**: Audits `robots.txt` and `/.well-known/security.txt` vulnerability policies.
- 🔒 **SSL / TLS Certificate Inspector**: Certificate issuer, validity, protocol, cipher suites, days remaining timeline, and SANs.
- 🌐 **DNS & Email Security (SPF / DMARC)**: Resolves A, AAAA, MX, TXT, NS records and validates SPF/DMARC anti-spoofing policies.
- 🔌 **Multithreaded Port Scanner**: Concurrent probing of common service ports (FTP, SSH, SMTP, DNS, HTTP, HTTPS, MySQL, etc.).
- 🎣 **Phishing Heuristics**: Domain entropy, HTTPS validation, IP obfuscation, and keyword threat analysis.
- 🔍 **WHOIS Intelligence**: Registrar details, creation/expiry dates, IP resolution, and raw WHOIS output.
- 🛠️ **Remediation Code Generator**: Copyable Nginx, Apache, and HTML Meta security hardening snippets.
- 📥 **Audit Report Export**: 1-click JSON Audit Export and Print Audit Summary capabilities.

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/scan/full` | Unified Fast Parallel Audit (Headers, SSL, DNS, Geo, Tech Stack, Ports, WHOIS, Remediation) |
| `POST` | `/scan/headers` | Security Header Audit |
| `POST` | `/scan/ssl` | SSL / TLS Certificate Analysis |
| `POST` | `/scan/dns` | DNS Records & Email Security (SPF/DMARC) |
| `POST` | `/scan/geo` | IP Geolocation & Server Infrastructure |
| `POST` | `/scan/phishing` | Phishing Threat Heuristics |
| `POST` | `/scan/ports` | Concurrent Port Scanner |
| `POST` | `/scan/domain` | WHOIS Domain Intelligence |
| `POST` | `/scan/summary` | Executive AI Security Summary |

## 👨‍💻 Author

**Prasad Nalla**  
*Cybersecurity Enthusiast & Full-Stack Developer*

## 📄 License

This project is licensed under the [MIT License](LICENSE).
