# ZIKR | ذِكرٌ - Deployment Guide

## Project Overview

ZIKR | ذِكرٌ is a premium Islamic spiritual platform with:

- **10 migrated episodes** with full bilingual content (English & Arabic)
- **RTL support** for Arabic language
- **Comprehensive SEO** including sitemap, robots.txt, JSON-LD structured data
- **AdSense-ready layout** with strategic ad placement zones
- **Newsletter subscription** system
- **Contact form** with email notifications
- **YouTube integration** for video content
- **Legal pages** (Privacy Policy, Terms of Service, Disclaimer)
- **Dark theme** with amber/gold accents for historical aesthetic

## Prerequisites

- Node.js 18+ (pnpm 10+)
- MySQL/TiDB database
- Vercel account for deployment
- GitHub account for repository

## Local Development

### 1. Install Dependencies

```bash
cd /home/ubuntu/zikr-new
pnpm install
```

### 2. Environment Variables

Create a `.env.local` file with:

```
DATABASE_URL=mysql://user:password@host:port/database
JWT_SECRET=your-secret-key
VITE_APP_ID=your-app-id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im
```

### 3. Database Setup

```bash
# Generate migrations
pnpm drizzle-kit generate

# Apply migrations
pnpm drizzle-kit migrate

# Seed episodes (requires DATABASE_URL set)
node seed-episodes.mjs
```

### 4. Start Development Server

```bash
pnpm dev
```

Visit `http://localhost:3000`

## Building for Production

```bash
pnpm build
pnpm start
```

## Deployment to Vercel

### 1. Push to GitHub

```bash
cd /home/ubuntu/zikr-new
git init
git add .
git commit -m "Initial commit: ZIKR | ذِكرٌ platform"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/zikr.git
git push -u origin main
```

### 2. Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import the GitHub repository
4. Configure environment variables:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `VITE_APP_ID`
   - `OAUTH_SERVER_URL`
   - `VITE_OAUTH_PORTAL_URL`
5. Click "Deploy"

### 3. Post-Deployment

After deployment, run the seed script on Vercel:

```bash
# Via Vercel CLI
vercel env pull
node seed-episodes.mjs
```

Or use the Vercel dashboard to run a one-time function.

## SEO Configuration

### Sitemap & Robots.txt

- **Sitemap**: `/sitemap.xml` (auto-generated from episodes)
- **Robots.txt**: `/robots.txt` (configured for all crawlers)

### Google Search Console

1. Add property: `https://your-domain.vercel.app`
2. Verify ownership
3. Submit sitemap: `/sitemap.xml`
4. Monitor indexing status

### Google AdSense

1. Sign up at [adsense.google.com](https://adsense.google.com)
2. Add site to AdSense
3. Wait for approval (typically 24-48 hours)
4. Add AdSense code to `client/index.html`:

```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR_ID"
     crossorigin="anonymous"></script>
```

5. Replace ad zone placeholders with AdSense ad units:
   - Header zone: 728x90 (Leaderboard)
   - Sidebar zone: 300x250 (Medium Rectangle)
   - In-content: 300x250 or 336x280 (Rectangle)
   - Footer: 728x90 (Leaderboard)

## Features Implemented

### Core Features
- ✅ Bilingual support (English/Arabic)
- ✅ RTL layout for Arabic
- ✅ 10 migrated episodes with full content
- ✅ Episode detail pages with markdown rendering
- ✅ Episode search and filtering
- ✅ Related episodes suggestions

### Navigation & UX
- ✅ Fixed navigation bar with language switcher
- ✅ Mobile-responsive design
- ✅ Dark theme with amber accents
- ✅ Smooth transitions and interactions

### SEO & Performance
- ✅ Dynamic meta tags for each page
- ✅ JSON-LD structured data (Article, Organization)
- ✅ XML sitemap generation
- ✅ Robots.txt configuration
- ✅ Open Graph tags
- ✅ Twitter Card tags
- ✅ Canonical URLs

### Content & Community
- ✅ Newsletter subscription form
- ✅ Contact form with validation
- ✅ YouTube channel integration
- ✅ Social media links (YouTube, Facebook)
- ✅ Legal pages (Privacy, Terms, Disclaimer)

### AdSense Ready
- ✅ Header ad zone (728x90)
- ✅ Sidebar ad zone (300x250)
- ✅ In-content ad zone (300x250)
- ✅ Footer ad zone (728x90)
- ✅ Responsive ad placement

## Database Schema

### Episodes Table
```sql
CREATE TABLE episodes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  titleEn TEXT NOT NULL,
  titleAr TEXT NOT NULL,
  descriptionEn TEXT,
  descriptionAr TEXT,
  contentEn LONGTEXT,
  contentAr LONGTEXT,
  keywordsEn VARCHAR(500),
  keywordsAr VARCHAR(500),
  category VARCHAR(100),
  publishedAt TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Subscriptions Table
```sql
CREATE TABLE subscriptions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  language VARCHAR(5),
  subscribedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Contacts Table
```sql
CREATE TABLE contacts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255),
  subject VARCHAR(255),
  message LONGTEXT,
  language VARCHAR(5),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Monitoring & Maintenance

### Analytics
- Use Vercel Analytics for performance metrics
- Monitor Core Web Vitals
- Track user engagement

### Backups
- Regular database backups (recommended weekly)
- Version control via GitHub
- Vercel deployment history

### Updates
- Keep dependencies updated: `pnpm update`
- Monitor security advisories: `pnpm audit`
- Test changes locally before deploying

## Troubleshooting

### Database Connection Issues
- Verify `DATABASE_URL` format
- Check database credentials
- Ensure database is running and accessible

### Build Failures
- Clear cache: `rm -rf .next dist node_modules`
- Reinstall: `pnpm install`
- Check TypeScript: `pnpm check`

### Deployment Issues
- Check Vercel logs: `vercel logs`
- Verify environment variables are set
- Ensure all required secrets are configured

## Support & Contact

For issues or questions:
1. Check GitHub Issues
2. Review deployment logs
3. Contact: contact@zikr.app

## License

© 2026 ZIKR | ذِكرٌ. All rights reserved.
