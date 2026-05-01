# Deployment Guide: Netlify + Render

## Architecture
- **Frontend**: Netlify (React SPA)
- **Backend**: Render (Flask API)
- **Database**: MongoDB Atlas (cloud)

---

## Step 1: Backend (Render)

### 1.1 Push to GitHub
```bash
cd backend
git init
git add .
git commit -m "Backend code"
# Create repo on GitHub and push
```

### 1.2 Deploy on Render
1. Go to [render.com](https://render.com) → New Web Service
2. Connect your GitHub repo (select the `backend` folder)
3. Configure:
   - **Name**: `optical-fiber-backend`
   - **Runtime**: Python 3.10
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app:app`
4. Add Environment Variables:
   - `MONGO_URI`: Your MongoDB Atlas connection string
   - `FLASK_ENV`: `production`
5. Deploy

### 1.3 Get Backend URL
After deployment, you'll get a URL like: `https://optical-fiber-backend.onrender.com`

---

## Step 2: Database (MongoDB Atlas)

### 2.1 Create Cluster
1. Go to [mongodb.com](https://mongodb.com) → Free Tier
2. Create cluster (free forever)

### 2.2 Get Connection String
1. Database Access → Create User (username/password)
2. Network Access → Allow All (0.0.0.0)
3. Database → Connect → Connect Your Application
4. Copy connection string:
```
mongodb+srv://<username>:<password>@cluster0.xyz.mongodb.net/?retryWrites=true&w=majority
```

### 2.3 Add to Render
Add this as `MONGO_URI` environment variable in Render.

---

## Step 3: Frontend (Netlify)

### 3.1 Update Environment Variable
Edit `frontend/.env`:
```
REACT_APP_API_URL=https://optical-fiber-backend.onrender.com
```

### 3.2 Deploy
```bash
cd frontend
npm run build
# Drag and drop the 'build' folder to Netlify drop zone
```

Or connect GitHub repo to Netlify with:
- **Build Command**: `npm run build`
- **Publish directory**: `build`

---

## Step 4: Verify

| Service | URL |
|---------|-----|
| Backend API | `https://your-backend.onrender.com` |
| Frontend | `https://your-site.netlify.app` |
| Health Check | `https://your-backend.onrender.com/` |

---

## Troubleshooting

### CORS Errors
Ensure backend has:
```python
CORS(app, origins=["https://your-site.netlify.app"])
```

### MongoDB Connection
- Check `MONGO_URI` in Render dashboard
- Verify IP whitelist in MongoDB Atlas

### Build Failures
- Frontend: Check Node version in `package.json`
- Backend: Verify `requirements.txt` has all dependencies