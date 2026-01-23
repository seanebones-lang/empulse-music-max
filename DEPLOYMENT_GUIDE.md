# 🚀 Deployment Guide

**Project:** EmPulse Music Max  
**Framework:** Next.js 16.1.4  
**Status:** Ready for deployment

---

## ⚠️ Pre-Deployment Checklist

### Build Status
- ⚠️ **Build Error:** Next.js 16.1.4 has a known issue (`TypeError: Cannot set properties of undefined (setting 'esr')`)
- ✅ **Dependencies:** All optimized (21 production deps)
- ✅ **Security:** 0 vulnerabilities
- ✅ **Code Quality:** No linter errors

### Recommended Fix Before Deployment

**Option 1: Downgrade Next.js (Recommended)**
```bash
cd web
npm install next@15.1.6 --legacy-peer-deps
npm run build
```

**Option 2: Use Minimal Config**
- A minimal `next.config.ts` has been created
- Try building with: `npm run build`

---

## 🌐 Deployment Options

### 1. Vercel (Recommended for Next.js)

**Why Vercel:**
- ✅ Optimized for Next.js
- ✅ Zero-config deployment
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Serverless functions

**Steps:**

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   cd web
   vercel --prod
   ```

4. **Or use Vercel Dashboard:**
   - Go to [vercel.com](https://vercel.com)
   - Import your Git repository
   - Vercel will auto-detect Next.js
   - Configure build settings:
     - **Root Directory:** `web`
     - **Build Command:** `npm install --legacy-peer-deps && npm run build`
     - **Output Directory:** `.next`

**Environment Variables (if needed):**
```
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
```

---

### 2. Netlify

**Steps:**

1. **Install Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Create `netlify.toml`:**
   ```toml
   [build]
     command = "cd web && npm install --legacy-peer-deps && npm run build"
     publish = "web/.next"
   
   [[plugins]]
     package = "@netlify/plugin-nextjs"
   ```

3. **Deploy:**
   ```bash
   netlify deploy --prod
   ```

---

### 3. Railway

**Steps:**

1. **Install Railway CLI:**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login:**
   ```bash
   railway login
   ```

3. **Initialize:**
   ```bash
   railway init
   ```

4. **Configure:**
   - Set root directory to `web`
   - Build command: `npm install --legacy-peer-deps && npm run build`
   - Start command: `npm start`

5. **Deploy:**
   ```bash
   railway up
   ```

---

### 4. Docker Deployment

**Create `Dockerfile`:**
```dockerfile
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app
COPY web/package.json web/package-lock.json ./
RUN npm ci --legacy-peer-deps

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY web .
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

**Build and Run:**
```bash
docker build -t empulse-music-max .
docker run -p 3000:3000 empulse-music-max
```

---

## 🔧 Build Configuration

### Current Setup

**`next.config.ts`** (Minimal version for deployment):
```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'via.placeholder.com' },
      { protocol: 'https', hostname: 'www.soundhelix.com' },
    ],
  },
  compress: true,
  swcMinify: true,
};

export default nextConfig;
```

**Full config available in:** `next.config.full.backup.ts`

---

## 📋 Deployment Checklist

### Before Deploying

- [ ] Fix Next.js build error (downgrade or use minimal config)
- [ ] Run `npm run build` successfully
- [ ] Test production build locally: `npm start`
- [ ] Verify all environment variables are set
- [ ] Check API routes work correctly
- [ ] Test audio playback functionality
- [ ] Verify PWA manifest and service worker

### During Deployment

- [ ] Set correct root directory (`web/`)
- [ ] Configure build command with `--legacy-peer-deps`
- [ ] Set environment variables
- [ ] Configure custom domain (if needed)
- [ ] Enable HTTPS

### After Deployment

- [ ] Test all pages load correctly
- [ ] Verify API routes work
- [ ] Test audio playback
- [ ] Check mobile responsiveness
- [ ] Verify PWA installation
- [ ] Monitor error logs
- [ ] Set up analytics (optional)

---

## 🐛 Troubleshooting

### Build Fails

**Error:** `TypeError: Cannot set properties of undefined (setting 'esr')`

**Solution:**
```bash
cd web
npm install next@15.1.6 --legacy-peer-deps
npm run build
```

### Dependencies Not Found

**Error:** `Cannot find module`

**Solution:**
```bash
cd web
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

### Port Already in Use

**Error:** `Port 3000 is already in use`

**Solution:**
```bash
# Kill existing process
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm start
```

---

## 📊 Post-Deployment

### Monitoring

- **Vercel Analytics:** Built-in
- **Error Tracking:** Consider Sentry
- **Performance:** Lighthouse CI
- **Uptime:** UptimeRobot or similar

### Environment Variables

Set these in your deployment platform:

```
NEXT_PUBLIC_SUPABASE_URL=your_url (optional)
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key (optional)
NODE_ENV=production
```

---

## 🎯 Recommended: Vercel

**Quick Deploy:**
```bash
cd web
npm install -g vercel
vercel --prod
```

**Or use GitHub integration:**
1. Push code to GitHub
2. Import project in Vercel dashboard
3. Configure root directory: `web`
4. Deploy!

---

## ✅ Success Criteria

After deployment, verify:
- ✅ Site loads without errors
- ✅ All pages accessible
- ✅ Audio playback works
- ✅ API routes respond correctly
- ✅ PWA installable
- ✅ Mobile responsive
- ✅ HTTPS enabled

---

**Status:** Ready for deployment (after fixing build error)  
**Recommended Platform:** Vercel  
**Next Step:** Fix Next.js build error, then deploy
