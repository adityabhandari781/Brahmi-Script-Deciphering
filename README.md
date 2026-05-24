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

## 5) Push this project to GitHub

If this folder is not a Git repo yet:

```bash
cd /mnt/windows/Users/adity/Desktop/code/GitHub/archeo-new
git init
git add .
git commit -m "Initial commit"
```

Create an empty repo on GitHub (for example `archeo-new`), then connect and push:

```bash
git branch -M main
git remote add origin https://github.com/<YOUR_USERNAME>/<YOUR_REPO>.git
git push -u origin main
```

If you already created `origin`, update it with:

```bash
git remote set-url origin https://github.com/<YOUR_USERNAME>/<YOUR_REPO>.git
```

## 6) Optional: use Git LFS for model weights

Current model files are under GitHub's 100 MB per-file limit, but if they grow later, use Git LFS:

```bash
git lfs install
git lfs track "*.pt" "*.pth"
git add .gitattributes
git add ArchaeoRestore-Python-Server/models
git commit -m "Track model files with Git LFS"
```
