# 🚀 Quick Deployment Guide

## ⚠️ Important: Fix Build Error First

The Next.js 16.1.4 build has a known bug. Fix it before deploying:

```bash
cd web
npm install next@15.1.6 --legacy-peer-deps
npm run build
```

## Deploy to Vercel (Recommended)

### Option 1: Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
cd web
vercel --prod
```

### Option 2: Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Import your Git repository
3. Configure:
   - **Root Directory:** `web`
   - **Build Command:** `Steps in Stripe Dashboard:

Log in → https://dashboard.stripe.com
In left sidebar → Payments → Payment Links (or search "Payment Links")
Click + Create payment link
Choose:
Product type: "Donation" or "Custom amount" (best for investments/contributions)
Amount: "Let customer enter amount" (flexible) or fixed (e.g., $1,000 minimum pledge)
Currency: USD
Description: e.g., "Support EmPulse Music – Mood-Based Wellness Streaming Platform"
Image: Upload Empulse logo or mood slider graphic
Success URL: Your thank-you page (e.g., empulse.music/thanks)
Optional: Add metadata (e.g., "investment_pledge", "donation")

Click Create link
Copy the Payment Link URL (e.g., pay.stripe.com/...)
(Optional) Click "Embed" to get HTML button code
   - **Output Directory:** `.next`
4. Add environment variables (if needed)
5. Deploy!

## Environment Variables

Set these in Vercel dashboard (if using Supabase):

```
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
```

## Status

✅ Dependencies optimized  
✅ Code cleaned  
⚠️ Build error needs fixing (downgrade Next.js)  
✅ Ready for deployment after fix
