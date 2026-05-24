# Archaeo New

Monorepo containing:
- `ArchaeoRestore-Python-Server`: FastAPI + PyTorch OCR backend
- `my-app`: Next.js frontend (Supabase auth + OCR UI)

## 1) Prerequisites

- Linux/macOS (or WSL on Windows)
- Python 3.10+
- Node.js 20+ and npm
- Git

## 2) Clone and enter project

```bash
git clone <YOUR_REPO_URL>
cd archeo-new
```

## 3) Run the backend (FastAPI)

```bash
cd ArchaeoRestore-Python-Server
python3 -m venv .venv
source .venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Backend should be available at `http://localhost:8000`.

## 4) Run the frontend (Next.js)

Open a second terminal:

```bash
cd my-app
npm install
```

Then run:

```bash
npm run dev
```

Frontend should be available at `http://localhost:3000`.
