# 🛡️ VulnX – Advanced Web Vulnerability Scanner

<<<<<<< HEAD
> A full-stack cybersecurity web application that analyzes website security headers, detects phishing indicators, scans common ports, performs WHOIS lookups, and generates AI-powered security summaries.
=======
VulnX is a web security analysis toolkit with a React frontend and a Python Flask scanner API.
>>>>>>> 301fb1e ( Readme Updated)

![React](https://img.shields.io/badge/React-19-blue?logo=react)
![Python](https://img.shields.io/badge/Python-3.11+-yellow?logo=python)
![Flask](https://img.shields.io/badge/Flask-Backend-black?logo=flask)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-4-38BDF8?logo=tailwindcss)
![License](https://img.shields.io/badge/License-MIT-green)

<<<<<<< HEAD
---
=======
- `frontend/` – React + Vite user interface.
- `scanner/` – Flask API providing security header checks, phishing analysis, port scanning, and WHOIS lookup.
>>>>>>> 301fb1e ( Readme Updated)

## 📖 Overview

VulnX is a modern cybersecurity web application designed to perform quick security assessments of websites. It combines multiple security checks into a single interactive dashboard, allowing users to identify security misconfigurations, detect phishing indicators, scan common ports, retrieve domain intelligence, and view AI-generated risk summaries.

---

## ✨ Features

### 🔒 Security Header Scanner
Checks for important HTTP security headers including:

- Content-Security-Policy (CSP)
- Strict-Transport-Security (HSTS)
- Referrer-Policy
- X-Content-Type-Options
- X-Frame-Options

---

### 🎣 Phishing Detection

Analyzes URLs using multiple heuristics:

- HTTPS validation
- URL length analysis
- Suspicious keywords
- IP address detection
- Excessive subdomains
- Hyphen abuse
- Special character detection

Outputs:

- Threat Score
- Security Verdict
- Detection Reasons

---

### 🌐 Port Scanner

Scans common ports such as:

- 21 (FTP)
- 22 (SSH)
- 25 (SMTP)
- 53 (DNS)
- 80 (HTTP)
- 110 (POP3)
- 143 (IMAP)
- 443 (HTTPS)
- 3306 (MySQL)
- 8080 (HTTP Alternate)

Displays:

- Port Number
- Service
- Status (Open)

---

### 🌍 WHOIS Intelligence

Retrieves domain information including:

- Domain Name
- IP Address
- Registrar
- Creation Date
- Expiration Date

---

### 🤖 AI Security Summary

Automatically generates an easy-to-understand summary describing:

- Missing security headers
- Phishing risk
- Open ports
- Overall website security posture

---

### 💻 Terminal View

Interactive hacker-style terminal displaying:

- Scan initialization
- Live scan progress
- Header analysis
- Scan completion status

---

### 📊 Security Dashboard

Provides:

- Security Score
- Total Checks
- Passed Checks
- Individual Result Cards
- Threat Indicators

---

## 🏗️ Project Structure

```text
VulnX/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.jsx
│   │
│   └── package.json
│
├── scanner/
│   ├── app.py
│   ├── requirements.txt
│   └── venv/
│
└── README.md
```

---

## ⚙️ Tech Stack

### Frontend

- React
- Vite
- Tailwind CSS
- Axios
- React Icons

### Backend

- Python
- Flask
- Flask-CORS

### Python Libraries

- requests
- socket
- python-whois
- urllib.parse
- re

---

## 🚀 Installation

### Clone Repository

```bash
git clone https://github.com/yourusername/VulnX.git

cd VulnX
```

---

### Backend Setup

Create Virtual Environment

```bash
cd scanner

python -m venv venv
```

Activate Virtual Environment (Windows)

```bash
venv\Scripts\activate
```

Install Dependencies

```bash
pip install -r requirements.txt
```

Run Backend

```bash
python app.py
```

<<<<<<< HEAD
Backend will run on:

```
http://127.0.0.1:8000
```

---

### Frontend Setup
=======
The scanner API runs on `http://127.0.0.1:8000` by default.

### 2. Start the frontend
>>>>>>> 301fb1e ( Readme Updated)

```bash
cd frontend

npm install

npm run dev
```

<<<<<<< HEAD
Frontend will run on:

```
http://localhost:5173
=======
Then open the local Vite URL (e.g. `http://localhost:5173`) in your browser.

## Configuration

The frontend uses `VITE_API_URL` when present. If not set, it defaults to `http://127.0.0.1:8000`.

Example `.env` in `frontend/`:

```env
VITE_API_URL=http://127.0.0.1:8000
>>>>>>> 301fb1e ( Readme Updated)
```

---

<<<<<<< HEAD
## 📡 API Endpoints
=======
To publish this project to GitHub:
>>>>>>> 301fb1e ( Readme Updated)

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | `/scan/headers` | Security Header Scan |
| POST | `/scan/phishing` | Phishing Detection |
| POST | `/scan/ports` | Port Scanner |
| POST | `/scan/domain` | WHOIS Lookup |
| POST | `/scan/summary` | AI Risk Summary |

---

## 📷 Screenshots

Add screenshots after deployment.

```
screenshots/

dashboard.png

headers.png

terminal.png

phishing.png

summary.png

ports.png
```

---

## 🎯 Future Improvements

<<<<<<< HEAD
- SSL Certificate Analysis
- CVE Lookup Integration
- Technology Fingerprinting
- Cookie Security Scanner
- DNS Record Analysis
- Subdomain Enumeration
- Robots.txt Scanner
- Sitemap Analyzer
- Authentication System
- Scan History
- PDF Report Export
- Docker Support
- Deployment on AWS or Render

---

## 💡 Why VulnX?

VulnX combines multiple website security assessment techniques into a single, modern web application. Rather than focusing on just one vulnerability, it provides a comprehensive overview of a website's security posture through real-time analysis, making it an excellent learning project for cybersecurity and full-stack development.

---

## 👨‍💻 Author

**Prasad Nalla**

Cybersecurity Enthusiast | Full-Stack Developer | AI & Security Learner

GitHub: https://github.com/yourusername

LinkedIn: https://linkedin.com/in/yourprofile

---

## ⭐ Support

If you found this project useful:

⭐ Star the repository

🍴 Fork the project

🐛 Report bugs

💡 Suggest new features

🤝 Contribute to VulnX

---

## 📄 License

This project is licensed under the MIT License.
=======
The repository includes a GitHub Actions CI workflow at `.github/workflows/ci.yml` that builds the frontend and verifies the scanner Python code.

## Key Features

- **Security Header Audit**: Checks for missing headers (CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy).
- **Phishing Indicator Detection**: Evaluates URLs for HTTPS usage, IP domain obfuscation, suspicious subdomains, and keywords.
- **Port Scanning**: Probes common ports (FTP, SSH, SMTP, HTTP, HTTPS, MySQL, etc.).
- **WHOIS & Domain Intelligence**: Extracts domain registrar, creation date, expiry date, IP resolution, and raw WHOIS data.
- **AI Security Summary**: Synthesizes scan results into an actionable risk assessment report.
>>>>>>> 301fb1e ( Readme Updated)
