# 🚀 Vercel Deployment Instructions

## Quick Deploy

### Step 1: Install Vercel CLI (if not installed)

```bash
npm install -g vercel
```

### Step 2: Navigate to web directory

```bash
cd web
```

### Step 3: Login to Vercel

```bash
vercel login
```

This will open your browser to authenticate with Vercel.

### Step 4: Deploy to Production

```bash
vercel --prod
```

Or deploy to preview first:

```bash
vercel
```

## Alternative: Deploy via Vercel Dashboard

1. **Go to [vercel.com](https://vercel.com)**
2. **Click "Add New Project"**
3. **Import your Git repository** (GitHub, GitLab, or Bitbucket)
4. **Configure project:**
   - **Framework Preset:** Next.js (auto-detected)
   - **Root Directory:** `web` (important!)
   - **Build Command:** `npm install --legacy-peer-deps && npm run build`
   - **Output Directory:** `.next`
   - **Install Command:** `npm install --legacy-peer-deps`
5. **Add Environment Variables** (if needed):
   - `NEXT_PUBLIC_SUPABASE_URL` (optional)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (optional)
6. **Click "Deploy"**

## Configuration Files

### `vercel.json` (already created)

```json
{
  "buildCommand": "npm install --legacy-peer-deps && npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "installCommand": "npm install --legacy-peer-deps",
  "devCommand": "npm run dev"
}
```

## Troubleshooting

### Build Fails

If you see the Next.js 16.1.4 error, downgrade:

```bash
cd web
npm install next@15.1.6 --legacy-peer-deps
npm run build
```

Then deploy again.

### Authentication Issues

```bash
vercel logout
vercel login
```

### Check Deployment Status

```bash
vercel ls
```

## Post-Deployment

After successful deployment:

1. ✅ Your app will be live at `https://your-project.vercel.app`
2. ✅ Vercel provides automatic HTTPS
3. ✅ Global CDN included
4. ✅ Automatic deployments on git push (if connected)

## Next Steps

- Set up custom domain (optional)
- Configure environment variables
- Enable analytics (optional)
- Set up monitoring

---

**Ready to deploy!** Run `vercel --prod` from the `web` directory.
