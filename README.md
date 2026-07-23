# VulnX

VulnX is a web security analysis toolkit featuring a React frontend and a Python Flask backend API.

## Project Structure

- `frontend/` – React + Vite user interface.
- `backend/` – Python Flask API providing security header checks, phishing analysis, port scanning, and WHOIS lookup.

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

## GitHub Repository Setup

To publish this project to GitHub:

```bash
git init
git add .
git commit -m "Initial commit: VulnX"
git branch -M main
git remote add origin git@github.com:USERNAME/REPO.git
git push -u origin main
```

If you prefer HTTPS remote:

```bash
git remote add origin https://github.com/USERNAME/REPO.git
git push -u origin main
```

The repository includes a GitHub Actions CI workflow at `.github/workflows/ci.yml` that builds the frontend and verifies the backend Python code.

## Key Features

- 🛡️ **Security Header Audit**: Checks for CSP, HSTS, X-Frame-Options, X-Content-Type-Options, and Referrer-Policy.
- 🎣 **Phishing Detection**: Evaluates URLs for HTTPS usage, IP domain obfuscation, suspicious subdomains, and keywords.
- 🔌 **Port Scanner**: Concurrent multithreaded scanning for common ports (FTP, SSH, SMTP, DNS, HTTP, POP3, IMAP, HTTPS, MySQL, etc.).
- 🔍 **WHOIS Intelligence**: Extracts registrar information, creation/expiry dates, IP resolution, and raw WHOIS output.
- 🤖 **AI Risk Summary**: Synthesizes scan results into an actionable risk assessment report.

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/scan/headers` | Security Header Audit |
| `POST` | `/scan/phishing` | Phishing Detection |
| `POST` | `/scan/ports` | Port Scanner |
| `POST` | `/scan/domain` | WHOIS Domain Intelligence |
| `POST` | `/scan/summary` | AI Security Risk Summary |

## 👨‍💻 Author

**Prasad Nalla**  
*Cybersecurity Enthusiast & Full-Stack Developer*

## 📄 License

This project is licensed under the [MIT License](LICENSE).

