# VulnX

VulnX is a web security analysis toolkit with a React frontend, a Python-based scanner API, and an optional Node.js backend proxy.

## Project structure

- `frontend/` – React + Vite user interface.
- `scanner/` – Flask API providing security header checks, phishing analysis, port scanning, and WHOIS lookup.
- `backend/` – Optional Node.js proxy server for routing frontend requests to the scanner.

## Running the project

### 1. Start the Python scanner

```powershell
cd scanner
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python app.py
```

The scanner runs on `http://127.0.0.1:8000` by default.

### 2. Start the backend proxy (optional)

```powershell
cd backend
npm install
npm run dev
```

The backend proxy listens on `http://127.0.0.1:5000` and forwards `/scan/*` requests to the scanner.

### 3. Start the frontend

```powershell
cd frontend
npm install
npm run dev
```

Then open the local Vite URL in your browser.

## Configuration

The frontend uses `VITE_API_URL` when present. If not set, it defaults to `http://127.0.0.1:8000`.

Example `.env`:

```env
VITE_API_URL=http://127.0.0.1:5000
```

## GitHub repository setup

To publish this project to GitHub, follow these steps locally (replace `USERNAME` and `REPO`):

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

Set GitHub Secrets if you deploy or use a proxy (optional):

- `VITE_API_URL` — frontend API base URL (e.g. `https://yourdomain.com`)
- `SCANNER_URL` — backend proxy target (if using `backend/server.js`)

The repository includes a GitHub Actions CI workflow at `.github/workflows/ci.yml` that builds the frontend and verifies the scanner and backend syntactic checks.

## Improvements made

- Added URL normalization and validation in the scanner API.
- Fixed duplicate port scanning and stale-state behavior in the frontend.
- Added environment-configurable frontend API base URL.
- Added an optional `backend/` proxy server to make the architecture clearer.
- Added root-level project documentation.
