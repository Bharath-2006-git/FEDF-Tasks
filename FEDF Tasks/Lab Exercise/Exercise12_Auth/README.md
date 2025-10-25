# Exercise 12: Authentication with NextAuth.js

Minimal authentication app with Google OAuth.

## Setup Instructions

### 1. Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select existing)
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth client ID"
5. Application type: Web application
6. Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`
7. Copy Client ID and Client Secret

### 2. Configure Environment Variables

Update `.env.local`:
```env
NEXTAUTH_SECRET=any-random-string-here
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
```

### 3. Run the App

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Features

✅ Google OAuth authentication  
✅ Protected dashboard route  
✅ User profile display (name, email, image)  
✅ Sign in/out functionality  
✅ Auto-redirect based on auth status  

## How It Works

- **Homepage (/)**: Sign in button (redirects to dashboard if authenticated)
- **Dashboard (/dashboard)**: Protected route showing user info
- **API Route**: NextAuth handles OAuth flow at `/api/auth/[...nextauth]`
