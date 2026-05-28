# Inkwell — Shared Novel Writing App

A beautiful, dark-themed novel writing app where all novels are **shared across all users** via a PostgreSQL database.

## Deploy to Render.com (Step by Step)

### Step 1 — Push to GitHub
1. Go to [github.com](https://github.com) → **New repository** → name it `inkwell`
2. Upload all files keeping this structure:
   ```
   inkwell/
   ├── server.js
   ├── package.json
   ├── README.md
   └── public/
       └── index.html
   ```
3. Commit the files.

### Step 2 — Create a PostgreSQL database on Render
1. Go to [render.com](https://render.com) → sign up / log in
2. Click **New +** → **PostgreSQL**
3. Give it a name (e.g. `inkwell-db`), choose the **Free** plan
4. Click **Create Database**
5. Once created, copy the **Internal Database URL** (starts with `postgres://...`)

### Step 3 — Deploy the Web Service
1. Click **New +** → **Web Service**
2. Connect your GitHub repo (`inkwell`)
3. Fill in the settings:
   - **Name**: `inkwell`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Under **Environment Variables**, add:
   - Key: `DATABASE_URL`
   - Value: *(paste the Internal Database URL from Step 2)*
5. Click **Create Web Service**

Render will build and deploy in ~2 minutes. You'll get a live URL like `https://inkwell.onrender.com` — share it with anyone and all writers will see and contribute to the same shared library!

## Run Locally
```bash
# Requires a local PostgreSQL instance
export DATABASE_URL=postgresql://localhost/inkwell
npm install
npm start
# Open http://localhost:3000
```

## Features
- 📚 Shared library — all users see the same novels
- 📝 Novel premise / idea notes
- 📖 Chapters with full writing editor  
- 💾 Auto-saves to PostgreSQL database
- ↩️  Undo button in chapter editor
- ⬇️  Download novel or chapter as .txt
- 📱 Mobile friendly
- ✨ Beautiful dark gold aesthetic, Times New Roman writing font
