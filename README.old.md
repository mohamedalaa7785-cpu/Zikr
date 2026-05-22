# Hidden Narratives - Bilingual Podcast Platform

A modern, SEO-optimized bilingual podcast platform with Arabic/English support, built with React, Express, tRPC, and Tailwind CSS.

## 🌟 Features

### Core Platform
- **Bilingual Support**: Full Arabic (RTL) and English support with language switcher
- **10 Migrated Episodes**: Complete historical analysis content with bilingual metadata
- **Responsive Design**: Mobile-first approach with dark theme and amber accents
- **Dynamic Routing**: Episode pages with markdown rendering and related content

### Content Management
- **Episode System**: Dynamic episode pages with full bilingual content
- **Markdown Rendering**: Support for rich text formatting in episode content
- **Related Episodes**: Intelligent suggestions based on keywords and categories
- **Search & Filter**: Find episodes by language, category, and keywords

### SEO & Performance
- **Dynamic Meta Tags**: Automatic meta tag generation for all pages
- **XML Sitemap**: Auto-generated sitemap at `/sitemap.xml`
- **Robots.txt**: Configured for all major search engines
- **JSON-LD Schema**: Structured data for Articles and Organization
- **Open Graph Tags**: Social media sharing optimization
- **Twitter Cards**: Enhanced Twitter sharing
- **Core Web Vitals**: Optimized for performance

### User Engagement
- **Newsletter Subscription**: Email collection with validation
- **Contact Form**: Direct messaging with backend notifications
- **YouTube Integration**: Embedded video player with iframe support
- **Social Media Links**: YouTube, Facebook, LinkedIn, WhatsApp

### AdSense Ready
- **4 Ad Placement Zones**:
  - Header (728x90 Leaderboard)
  - Sidebar (300x250 Medium Rectangle)
  - In-Content (300x250 Rectangle)
  - Footer (728x90 Leaderboard)
- **Responsive Ad Containers**: Adapts to all screen sizes
- **Placeholder Structure**: Ready for AdSense code integration

### Legal & Compliance
- **Privacy Policy**: Comprehensive privacy documentation
- **Terms of Service**: Clear usage terms
- **Disclaimer**: Legal disclaimers for content
- **GDPR Ready**: Privacy-first approach

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ with pnpm
- MySQL/TiDB database
- Vercel account (for deployment)

### Local Development

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local

# Generate and apply database migrations
pnpm drizzle-kit generate
pnpm drizzle-kit migrate

# Start development server
pnpm dev
```

Visit `http://localhost:3000`

### Build for Production

```bash
pnpm build
pnpm start
```

## 📦 Project Structure

```
client/
  ├── src/
  │   ├── pages/          # Page components
  │   ├── components/     # Reusable UI components
  │   ├── lib/           # Utilities (SEO, tRPC)
  │   └── App.tsx        # Main router
  └── public/            # Static assets

server/
  ├── routers.ts         # tRPC procedure definitions
  ├── db.ts              # Database helpers
  ├── routes/            # Express routes (sitemap, robots)
  └── _core/             # Framework internals

drizzle/
  └── schema.ts          # Database schema

shared/
  └── const.ts           # Shared constants
```

## 🗄️ Database Schema

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
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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

## 🌐 Deployment to Vercel

### 1. Connect Repository

```bash
# Push to GitHub
git remote add origin https://github.com/YOUR_USERNAME/hidden-narratives.git
git push -u origin main
```

### 2. Deploy on Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure environment variables:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `VITE_APP_ID`
   - `OAUTH_SERVER_URL`
   - `VITE_OAUTH_PORTAL_URL`
   - And other required secrets
5. Click "Deploy"

### 3. Post-Deployment

After deployment, verify:
- [ ] Homepage loads correctly
- [ ] Episodes page displays all content
- [ ] Language switcher works (EN/AR)
- [ ] RTL layout works for Arabic
- [ ] Newsletter subscription works
- [ ] Contact form submits successfully
- [ ] Sitemap accessible at `/sitemap.xml`
- [ ] Robots.txt accessible at `/robots.txt`
- [ ] YouTube videos embed correctly
- [ ] All social links work

## 🔍 SEO Optimization

### Submit to Search Engines

1. **Google Search Console**
   - Add property: `https://your-domain.vercel.app`
   - Verify ownership
   - Submit sitemap: `/sitemap.xml`

2. **Bing Webmaster Tools**
   - Add site
   - Submit sitemap

3. **Google AdSense**
   - Sign up at [adsense.google.com](https://adsense.google.com)
   - Add site for review
   - Wait for approval (24-48 hours)
   - Add AdSense code to `client/index.html`

### SEO Features Implemented

- ✅ Dynamic meta tags per page
- ✅ JSON-LD structured data
- ✅ XML sitemap generation
- ✅ Robots.txt configuration
- ✅ Open Graph tags
- ✅ Twitter Card tags
- ✅ Responsive design (mobile-first)
- ✅ Fast page load times
- ✅ Proper heading hierarchy
- ✅ Internal linking

## 📊 Analytics

### Recommended Tools

1. **Google Analytics 4**
   - Track user behavior
   - Monitor conversion goals
   - Analyze audience demographics

2. **Google Search Console**
   - Monitor search performance
   - Fix indexing issues
   - Analyze search queries

3. **Vercel Analytics**
   - Monitor Core Web Vitals
   - Track performance metrics
   - Get real-time insights

## 🛠️ Maintenance

### Regular Tasks

- [ ] Monitor analytics weekly
- [ ] Check search console for errors
- [ ] Update episode content monthly
- [ ] Review contact form submissions
- [ ] Monitor newsletter subscribers
- [ ] Check AdSense performance
- [ ] Update dependencies monthly
- [ ] Run security audits

### Backup Strategy

- Database backups: Weekly
- Code backups: GitHub (automatic)
- Content backups: Weekly

## 📝 Content Management

### Adding New Episodes

1. Create markdown file with frontmatter:
```markdown
---
title: Episode Title
description: Short description
keywords: keyword1, keyword2
category: history
---

# Episode Content
```

2. Add to database via admin panel or API

3. Episode automatically appears on site

### Updating Content

- Edit episode markdown
- Update database record
- Changes reflect immediately

## 🔐 Security

- Environment variables for secrets
- SQL injection prevention (parameterized queries)
- XSS protection via React
- CSRF protection via tRPC
- Rate limiting on contact form
- Email validation

## 📱 Mobile Optimization

- Responsive design (320px - 2560px)
- Touch-friendly buttons and links
- Fast mobile page loads
- Mobile-first CSS approach
- Optimized images and fonts

## 🎨 Customization

### Colors
Edit `client/src/index.css` for theme colors:
- Primary: Amber (#f59e0b)
- Background: Slate-950
- Text: White/Gray

### Fonts
- System fonts for performance
- Add Google Fonts in `client/index.html`

### Content
- Edit pages in `client/src/pages/`
- Update database for episodes
- Modify translations in component files

## 🐛 Troubleshooting

### Build Issues
```bash
# Clear cache and reinstall
rm -rf node_modules dist
pnpm install
pnpm build
```

### Database Connection
- Verify `DATABASE_URL` format
- Check database credentials
- Ensure database is accessible

### Deployment Issues
- Check Vercel logs
- Verify environment variables
- Test locally first

## 📚 Documentation

- [DEPLOYMENT.md](./DEPLOYMENT.md) - Detailed deployment guide
- [todo.md](./todo.md) - Project roadmap

## 📞 Support

For issues or questions:
1. Check GitHub Issues
2. Review deployment logs
3. Contact: contact@hiddennarratives.com

## 📄 License

© 2026 Hidden Narratives. All rights reserved.

## 🙏 Acknowledgments

Built with:
- React 19
- Tailwind CSS 4
- Express.js
- tRPC
- Drizzle ORM
- Vercel

---

**Last Updated**: April 2026
**Version**: 1.0.0
**Status**: Production Ready
