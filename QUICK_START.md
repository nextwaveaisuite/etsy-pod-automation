# 🚀 Quick Start Guide

## 1. Extract the Zip File

```bash
unzip etsy-pod-builder-deployment.zip
cd etsy-pod-builder
```

## 2. Install Dependencies

```bash
npm install
```

## 3. Set Up Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your API keys:
```bash
ETSY_SHOP_ID=your_shop_id
ETSY_TOKEN=your_oauth_token
PRINTIFY_SHOP_ID=your_shop_id
PRINTIFY_TOKEN=your_api_token
OPENAI_API_KEY=your_api_key
```

## 4. Run Locally

```bash
npm run dev
```

Open http://localhost:3000

## 5. Deploy to Vercel

### Option A: Via GitHub

```bash
# Initialize git
git init
git add .
git commit -m "Initial commit"

# Create GitHub repo and push
git remote add origin https://github.com/YOUR_USERNAME/etsy-pod-builder.git
git push -u origin main

# Go to vercel.com
# Import your GitHub repository
# Add environment variables
# Deploy!
```

### Option B: Via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Add environment variables in Vercel dashboard
# Deploy to production
vercel --prod
```

## 6. Access Your Platform

- **Home**: `/`
- **Smart Dashboard**: `/smart`
- **Image Library**: `/library`
- **Image Editor**: `/editor`
- **Opportunities**: `/opportunities`
- **Analytics**: `/analytics`
- **AI Chat**: `/chat`
- **Pricing**: `/pricing`
- **Admin**: `/admin`

## 7. First Steps

1. Upload your first image at `/library`
2. Edit it at `/editor`
3. Check opportunities at `/opportunities`
4. Create your first product at `/smart`
5. Monitor results at `/analytics`

## 🎉 You're Ready!

See `README_DEPLOYMENT.md` for detailed instructions.
