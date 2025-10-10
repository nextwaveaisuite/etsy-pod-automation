# 🚀 Etsy POD Automation Platform - Deployment Guide

## Quick Start

This is a complete, production-ready Next.js SaaS platform for Etsy Print-on-Demand automation.

### 📦 What's Included

- ✅ Full-stack Next.js 14 application
- ✅ Image management with zip extraction
- ✅ Built-in image editor
- ✅ Multi-provider integration (Printify, Printful, Gelato, CustomCat)
- ✅ Low-hanging fruit opportunity analyzer
- ✅ Analytics dashboard
- ✅ Admin console
- ✅ AI chatbot (OpenAI)
- ✅ Complete automation pipeline
- ✅ Freemium subscription tiers
- ✅ 15 productivity planner templates

---

## 🎯 Deployment Options

### Option 1: Vercel (Recommended - Easiest)

**Step 1**: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/etsy-pod-builder.git
git push -u origin main
```

**Step 2**: Deploy to Vercel
1. Go to https://vercel.com
2. Click "Import Project"
3. Select your GitHub repository
4. Add environment variables (see below)
5. Click "Deploy"

**Done!** Your app will be live in ~2 minutes.

---

### Option 2: Manual Deployment

**Step 1**: Install dependencies
```bash
npm install
```

**Step 2**: Set up environment variables
```bash
cp .env.example .env.local
# Edit .env.local with your credentials
```

**Step 3**: Build
```bash
npm run build
```

**Step 4**: Start
```bash
npm start
```

Your app runs on http://localhost:3000

---

## 🔑 Environment Variables

Create a `.env.local` file with these variables:

```bash
# --- Etsy API ---
ETSY_SHOP_ID=your_shop_id
ETSY_TOKEN=your_oauth_token

# --- Printify API ---
PRINTIFY_SHOP_ID=your_shop_id
PRINTIFY_TOKEN=your_api_token

# --- Printful API (Optional) ---
PRINTFUL_TOKEN=your_api_token

# --- Gelato API (Optional) ---
GELATO_TOKEN=your_api_token

# --- CustomCat API (Optional) ---
CUSTOMCAT_TOKEN=your_api_token

# --- Supabase (Optional - for storage) ---
SUPABASE_URL=your_project_url
SUPABASE_KEY=your_anon_key

# --- OpenAI (For AI Chatbot) ---
OPENAI_API_KEY=your_api_key

# --- App Config ---
NEXT_PUBLIC_BASE_URL=https://your-domain.com
```

### How to Get API Keys

**Etsy**:
1. Go to https://www.etsy.com/developers
2. Create an app
3. Get OAuth token
4. Find your shop ID

**Printify**:
1. Go to https://printify.com/app/account/api
2. Generate API token
3. Find your shop ID

**OpenAI**:
1. Go to https://platform.openai.com/api-keys
2. Create API key

**Supabase** (Optional):
1. Go to https://supabase.com
2. Create project
3. Get URL and anon key from Settings > API

---

## 📁 Project Structure

```
etsy-pod-builder/
├── app/                          # Next.js app directory
│   ├── api/                      # API routes
│   │   ├── admin/               # Admin console APIs
│   │   ├── analytics/           # Analytics APIs
│   │   ├── autopilot/           # Automation pipeline
│   │   ├── calc/                # Pricing calculator
│   │   ├── campaigns/           # Winning campaigns
│   │   ├── chat/                # AI chatbot
│   │   ├── design/              # Image enhancement
│   │   ├── etsy/                # Etsy integration
│   │   ├── images/              # Image management
│   │   ├── launch/              # Product launch
│   │   ├── mockups/             # Mockup generation
│   │   ├── niche/               # Niche discovery
│   │   ├── opportunities/       # Opportunity analyzer
│   │   ├── planners/            # Planner templates
│   │   ├── pod/                 # POD providers
│   │   ├── providers/           # Multi-provider
│   │   ├── publish/             # Etsy publishing
│   │   ├── seo/                 # SEO optimization
│   │   ├── settings/            # Platform settings
│   │   ├── subscription/        # Subscription tiers
│   │   └── uploads/             # File uploads
│   ├── admin/                   # Admin console page
│   ├── analytics/               # Analytics page
│   ├── chat/                    # AI chatbot page
│   ├── dashboard/               # Auto dashboard
│   ├── editor/                  # Image editor
│   ├── library/                 # Image library
│   ├── opportunities/           # Opportunities page
│   ├── planners/                # Planners page
│   ├── pricing/                 # Pricing/subscription page
│   ├── profit-calc/             # Profit calculator
│   ├── settings/                # Settings page
│   ├── smart/                   # Smart dashboard
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Home page
├── lib/                         # Utility libraries
│   ├── calc.ts                  # Calculator utilities
│   ├── printify.ts              # Printify integration
│   ├── seo.ts                   # SEO utilities
│   └── settings.ts              # Settings management
├── public/                      # Static assets
│   └── avatar-500.png           # Logo
├── uploads/                     # User uploaded files
│   └── images/                  # Image library storage
├── .env.example                 # Environment variables template
├── .gitignore                   # Git ignore rules
├── next.config.mjs              # Next.js configuration
├── package.json                 # Dependencies
├── tsconfig.json                # TypeScript configuration
├── vercel.json                  # Vercel deployment config
├── supabase.sql                 # Supabase database schema
├── README.md                    # Main documentation
└── DEPLOYMENT_GUIDE.md          # This file
```

---

## 🗄️ Supabase Setup (Optional)

If you want to use Supabase for storage and database:

**Step 1**: Create Supabase project
1. Go to https://supabase.com
2. Create new project
3. Wait for setup to complete

**Step 2**: Run SQL schema
1. Go to SQL Editor in Supabase dashboard
2. Copy contents of `supabase.sql`
3. Run the SQL script

**Step 3**: Add environment variables
```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key
```

**Step 4**: Enable Storage
1. Go to Storage in Supabase dashboard
2. Create bucket named "images"
3. Set to public access

---

## 🚀 Vercel Deployment (Detailed)

### Prerequisites
- GitHub account
- Vercel account (free)

### Step-by-Step

**1. Push to GitHub**
```bash
# Initialize git (if not already)
git init

# Add all files
git add .

# Commit
git commit -m "Initial deployment"

# Create main branch
git branch -M main

# Add remote (replace with your repo URL)
git remote add origin https://github.com/YOUR_USERNAME/etsy-pod-builder.git

# Push
git push -u origin main
```

**2. Connect to Vercel**
1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Select your GitHub repository
4. Click "Import"

**3. Configure Project**
- **Framework Preset**: Next.js (auto-detected)
- **Root Directory**: ./
- **Build Command**: `npm run build` (default)
- **Output Directory**: .next (default)
- **Install Command**: `npm install` (default)

**4. Add Environment Variables**

Click "Environment Variables" and add:
```
ETSY_SHOP_ID=your_value
ETSY_TOKEN=your_value
PRINTIFY_SHOP_ID=your_value
PRINTIFY_TOKEN=your_value
OPENAI_API_KEY=your_value
NEXT_PUBLIC_BASE_URL=https://your-app.vercel.app
```

**5. Deploy**
- Click "Deploy"
- Wait 2-3 minutes
- Your app is live! 🎉

**6. Get Your URL**
- Vercel provides: `https://your-app.vercel.app`
- Add custom domain in Settings > Domains

---

## 🔧 Configuration

### Admin Access

By default, you are the owner with unlimited access. To configure:

1. Go to `/admin` after deployment
2. Set platform mode:
   - **Private**: Only you
   - **Invite-Only**: Approved users
   - **Public**: Anyone can sign up

### Subscription Tiers

Edit `/app/api/subscription/tiers/route.ts` to customize:
- Pricing ($19, $49)
- Feature limits
- Tier names

### Print Providers

Enable/disable providers in `/app/api/providers/route.ts`:
- Printify (default)
- Printful
- Gelato
- CustomCat

---

## 📊 Post-Deployment Checklist

### Immediate (Day 1)
- [ ] Deploy to Vercel
- [ ] Add environment variables
- [ ] Test all pages load
- [ ] Upload test image
- [ ] Create test product
- [ ] Verify API connections

### Week 1
- [ ] Add Etsy credentials
- [ ] Add Printify credentials
- [ ] Test full automation pipeline
- [ ] Create first 10 products
- [ ] Set up analytics tracking

### Month 1
- [ ] Invite beta users (if applicable)
- [ ] Monitor error logs
- [ ] Optimize performance
- [ ] Add custom domain
- [ ] Set up monitoring (Vercel Analytics)

---

## 🐛 Troubleshooting

### Build Fails

**Error**: `Module not found: Can't resolve 'openai'`
**Fix**: 
```bash
npm install openai --legacy-peer-deps
```

**Error**: `Route does not match required types`
**Fix**: Check that API routes only export `GET`, `POST`, `PUT`, `DELETE` functions

### Runtime Errors

**Error**: `Unexpected token '<', "<!doctype "... is not valid JSON`
**Fix**: Check API routes are using absolute URLs for internal fetches

**Error**: `CORS error`
**Fix**: Add CORS headers to API routes:
```typescript
export async function GET(req: NextRequest) {
  const response = NextResponse.json({ data: "..." });
  response.headers.set('Access-Control-Allow-Origin', '*');
  return response;
}
```

### Environment Variables Not Working

**Vercel**: 
1. Go to Project Settings > Environment Variables
2. Add variables
3. Redeploy (important!)

**Local**:
1. Create `.env.local` (not `.env`)
2. Restart dev server

---

## 🔒 Security Best Practices

### API Keys
- ✅ Never commit `.env.local` to git
- ✅ Use environment variables for all secrets
- ✅ Rotate keys regularly
- ✅ Use different keys for dev/prod

### User Data
- ✅ Validate all inputs
- ✅ Sanitize file uploads
- ✅ Rate limit API endpoints
- ✅ Use HTTPS only (Vercel default)

### Admin Access
- ✅ Implement authentication (future)
- ✅ Restrict admin routes
- ✅ Log admin actions
- ✅ Regular security audits

---

## 📈 Monitoring & Analytics

### Vercel Analytics (Built-in)
1. Go to Vercel dashboard
2. Click "Analytics"
3. View traffic, performance, errors

### Error Tracking
Check Vercel logs:
```bash
vercel logs
```

### Custom Analytics
The platform includes built-in analytics at `/analytics`

---

## 🔄 Updates & Maintenance

### Deploying Updates

**Vercel** (automatic):
```bash
git add .
git commit -m "Update feature"
git push
```
Vercel auto-deploys on push to main branch.

**Manual**:
```bash
npm run build
npm start
```

### Database Migrations

If using Supabase:
1. Write migration SQL
2. Run in Supabase SQL Editor
3. Update code accordingly

---

## 💡 Tips for Success

### Performance
- ✅ Use Vercel Edge Functions for APIs
- ✅ Enable image optimization
- ✅ Cache static assets
- ✅ Lazy load components

### SEO
- ✅ Add meta tags to pages
- ✅ Create sitemap.xml
- ✅ Submit to Google Search Console
- ✅ Use semantic HTML

### User Experience
- ✅ Fast page loads (<2s)
- ✅ Mobile responsive (already built)
- ✅ Clear error messages
- ✅ Helpful tooltips

---

## 📞 Support

### Resources
- **Documentation**: See `COMPLETE_PLATFORM_GUIDE.md`
- **API Reference**: See `/app/api/` folder
- **Profit Projections**: See `12_MONTH_PROFIT_PROJECTION.md`
- **Exit Strategy**: See `EXIT_VALUATION_ANALYSIS.md`

### Getting Help
- Check error logs in Vercel dashboard
- Review API responses in browser DevTools
- Test API endpoints with Postman
- Check environment variables are set

---

## 🎉 You're Ready!

Your platform is production-ready and includes:
- ✅ Complete automation pipeline
- ✅ Multi-provider integration
- ✅ AI-powered features
- ✅ Analytics dashboard
- ✅ Admin console
- ✅ Freemium model
- ✅ Scalable architecture

**Next Steps**:
1. Deploy to Vercel (5 minutes)
2. Add your API credentials
3. Create your first products
4. Start generating profit!

**Good luck with your Etsy POD empire! 🚀**

