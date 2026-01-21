# Recommended Articles and Videos - Financial Guidance App

A user-friendly, AI-assisted financial guidance web application.

## 🚀 Getting Started

### Prerequisites
- Node.js installed
- Python installed
- MongoDB installed and running locally on port 27017
- Google Gemini API Key

### 1. Setup Environment Variables

**Backend (`backend/.env`):**
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/financial_guidance
GEMINI_API_KEY=your_gemini_api_key_here
```

**AI Module (`ai-module/.env`):**
```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=5001
```

### 2. Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

**AI Module:**
```bash
cd ai-module
pip install -r requirements.txt
```

### 3. Seed Database
Make sure MongoDB is running, then populate initial data:
```bash
cd backend
node seed.js
```

### 4. Run Application

**Start AI Service:**
```bash
cd ai-module
python app.py
```

**Start Backend:**
```bash
cd backend
npm start
```

**Start Frontend:**
```bash
cd frontend
npm run dev
```

Visit `http://localhost:5173` to view the app.

## 🛠 Tech Stack
- **Frontend**: React, Vite, Glassmorphism CSS
- **Backend**: Node.js, Express, MongoDB
- **AI**: Python, Flask, Google Gemini
