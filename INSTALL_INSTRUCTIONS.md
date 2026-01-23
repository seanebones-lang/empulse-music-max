# 📦 Installation Instructions

## Quick Install

Due to React 19 peer dependency conflicts, install dependencies with:

```bash
cd web
npm install --legacy-peer-deps
```

## New Dependencies Added

The following packages were added in the latest execution:

1. **@next/bundle-analyzer** (devDependency)
   - For analyzing bundle sizes
   - Usage: `npm run analyze`

2. **zod** (devDependency)
   - For input validation
   - Already configured in `src/lib/validation.ts`

## Manual Installation

If the full install times out, install packages individually:

```bash
cd web
npm install --legacy-peer-deps @next/bundle-analyzer zod --save-dev
```

## Verify Installation

Check if packages are installed:

```bash
npm list @next/bundle-analyzer zod
```

## Start Development Server

After installation:

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## Troubleshooting

### Peer Dependency Warnings

React 19 has peer dependency conflicts with some testing libraries. This is expected and safe to ignore when using `--legacy-peer-deps`.

### Bundle Analyzer Not Found

If you see a warning about bundle analyzer, it's optional. The app will work without it. To enable:

```bash
npm install --legacy-peer-deps @next/bundle-analyzer --save-dev
```

### Port Already in Use

If port 3000 is in use:

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
PORT=3001 npm run dev
```
