
========================================
DEPLOYMENT INSTRUCTIONS
========================================

STEP 1: Push to GitHub
----------------------
1. Create a GitHub repo: https://github.com/new
2. Push your code:
   cd ~/solar-lead-machine
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/solar-lead-machine.git
   git push -u origin main

STEP 2: Deploy Backend to Render
--------------------------------
1. Go to https://dashboard.render.com/
2. Click "New +" → "Web Service"
3. Connect your GitHub repo
4. Configure:
   - Name: solar-lead-api
   - Environment: Node
   - Build Command: npm install && npx prisma generate && npm run build
   - Start Command: npm start
   - Add Environment Variables:
     * DATABASE_URL: (Create PostgreSQL on Render first)
     * JWT_SECRET: (Generate a random string)
     * FRONTEND_URL: (After deploying frontend)
5. Click "Create Web Service"

STEP 3: Create Database on Render
----------------------------------
1. In Render dashboard, click "New +" → "PostgreSQL"
2. Name: solar-leads-db
3. Copy the "Internal Database URL"
4. Add as DATABASE_URL env var in your Web Service

STEP 4: Deploy Frontend to Vercel
----------------------------------
1. Go to https://vercel.com/
2. Click "Add New Project"
3. Import your GitHub repo
4. Configure:
   - Framework Preset: Angular
   - Build Command: npm run build
   - Output Directory: dist/frontend/browser
5. Add Environment Variable:
   * API_URL: https://solar-lead-api.onrender.com/api
6. Click "Deploy"

STEP 5: Update CORS
-------------------
1. In Render dashboard, go to your Web Service
2. Add Environment Variable:
   * FRONTEND_URL: https://your-frontend.vercel.app
3. Click "Manual Deploy" → "Clear Build Cache & Deploy"

========================================
