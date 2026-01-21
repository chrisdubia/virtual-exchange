# The Virtual Exchange

A platform connecting educational institutions worldwide for meaningful virtual exchange programs.

Developed by MapWorks Learning.

## Deploy to Vercel

### Option 1: Deploy via Vercel Dashboard (Easiest)

1. Go to https://vercel.com
2. Sign in with your GitHub account
3. Click "Add New" → "Project"
4. Import your GitHub repository
5. Vercel will auto-detect it's a Vite project
6. Click "Deploy"

### Option 2: Deploy via GitHub

1. Push this code to a GitHub repository
2. Go to Vercel dashboard
3. Click "Add New" → "Project"
4. Select your GitHub repository
5. Vercel will automatically configure build settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
6. Click "Deploy"

### Option 3: Deploy via Vercel CLI

```bash
npm install -g vercel
vercel
```

## Local Development

```bash
npm install
npm run dev
```

Visit http://localhost:5173

## Build

```bash
npm run build
```
