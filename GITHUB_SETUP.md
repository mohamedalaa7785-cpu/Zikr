# GitHub Setup Instructions

## Overview

This project is ready to be pushed to GitHub. Follow these steps to complete the setup.

## Prerequisites

- GitHub account with write access to `mohamedalaa7785-cpu/zikr`
- Git installed locally
- Personal Access Token (PAT) with `repo` scope

## Steps

### 1. Clone the Repository Locally

```bash
git clone https://github.com/mohamedalaa7785-cpu/zikr.git
cd zikr
```

### 2. Copy Project Files

Copy all files from `/home/ubuntu/zikr/` to your local clone:

```bash
# From your local clone directory
cp -r /home/ubuntu/zikr/* .
cp -r /home/ubuntu/zikr/.* .
```

### 3. Configure Git

```bash
git config user.name "Your Name"
git config user.email "your.email@example.com"
```

### 4. Add and Commit

```bash
git add .
git commit -m "feat: ZIKR | ذِكرٌ Islamic Platform Phase 2

- Quran system foundation
- Hadith system foundation
- Prayer times and Qibla direction
- Scholars foundation
- Search system foundation
- Spiritual experience enhancement
- Full Supabase schema synchronization
- SEO optimization
- RTL perfection
- Production-ready for Vercel deployment"
```

### 5. Push to GitHub

```bash
git branch -M main
git push -u origin main --force
```

## Verifying the Push

1. Go to https://github.com/mohamedalaa7785-cpu/zikr
2. Verify all files are present
3. Check commit history

## Next Steps

1. **Connect to Vercel**:
   - Go to https://vercel.com
   - Click "New Project"
   - Import the GitHub repository
   - Configure environment variables
   - Deploy

2. **Set Up SEO**:
   - Submit sitemap to Google Search Console
   - Verify site ownership
   - Monitor search performance

3. **Apply for AdSense**:
   - Sign up at https://adsense.google.com
   - Add your domain
   - Wait for approval (24-48 hours)

## Project Structure

```
zikr/
├── client/                 # React frontend
│   ├── src/
│   │   ├── pages/         # Page components
│   │   ├── components/    # Reusable components
│   │   └── lib/          # Utilities
│   └── public/           # Static files
├── server/               # Express backend
│   ├── routers.ts        # tRPC procedures
│   ├── db.ts             # Database helpers
│   └── routes/           # Express routes
├── drizzle/              # Database schema
├── shared/               # Shared code
├── package.json
├── tsconfig.json
├── vercel.json           # Vercel config
├── README.md
├── DEPLOYMENT.md
└── todo.md
```

## Environment Variables

Required for deployment:

```
DATABASE_URL=mysql://...
JWT_SECRET=your-secret
VITE_APP_ID=app-id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im
OWNER_OPEN_ID=owner-id
OWNER_NAME=Owner Name
BUILT_IN_FORGE_API_URL=...
BUILT_IN_FORGE_API_KEY=...
VITE_FRONTEND_FORGE_API_URL=...
VITE_FRONTEND_FORGE_API_KEY=...
```

## Troubleshooting

### Push Rejected
- Ensure you have write access to the repository
- Check your PAT has `repo` scope
- Try: `git push -u origin main --force`

### Files Not Showing
- Verify `.gitignore` isn't excluding important files
- Check file permissions
- Ensure all files were copied

### Build Fails on Vercel
- Check environment variables are set
- Verify database connection string
- Review Vercel build logs

## Support

For issues:
1. Check GitHub Issues
2. Review DEPLOYMENT.md
3. Check Vercel logs

---

**Created**: April 2026
**Version**: 1.0.0
