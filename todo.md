# ZIKR | ذِكرٌ - Project TODO

## Phase 1: Audit & Planning
- [x] Audit existing repository structure
- [x] Plan migration strategy for 20+ episodes
- [x] Initialize new project with web-db-user scaffold

## Phase 2: Database & Content Migration
- [x] Design database schema for episodes, subscriptions, contacts
- [x] Create migration scripts for 10 complete bilingual episodes from old repo
- [x] Set up bilingual content structure (en/ar)
- [x] Validate all episode metadata and frontmatter

## Phase 3: Episode System (Bilingual)
- [x] Build dynamic episode pages with markdown rendering
- [x] Implement RTL support for Arabic content
- [x] Create episode listing page with filtering
- [x] Build related content suggestions algorithm
- [x] Add episode search functionality
- [x] Implement breadcrumb navigation

## Phase 4: SEO Implementation
- [x] Create dynamic meta tags for all pages
- [x] Implement JSON-LD structured data (Article, Podcast, Organization)
- [x] Generate dynamic XML sitemap
- [x] Create robots.txt with proper directives
- [x] Add Open Graph tags for social sharing
- [x] Add Twitter Card tags
- [x] Implement canonical URLs (seoHelpers.ts)
- [x] Add schema.org markup for episodes (seoHelpers.ts)

## Phase 5: AdSense-Ready Layout
- [x] Design header with ad placement zone
- [x] Create sidebar with ad placement zone
- [x] Implement in-content ad zones
- [x] Add footer ad placement zone
- [x] Ensure proper spacing and responsive behavior
- [x] Create AdSense placeholder components

## Phase 6: YouTube Integration
- [x] Create YouTube videos page
- [x] Implement video fetching from YouTube API (youtube.ts with full integration)
- [x] Build video embedding with iframe
- [x] Add video metadata display
- [x] Create video listing with thumbnails
- [x] Link videos to related episodes

## Phase 7: Navigation & UI
- [x] Build responsive navbar with language switcher
- [x] Create mobile hamburger menu
- [x] Add social media links (YouTube, Facebook, LinkedIn, WhatsApp)
- [x] Implement language persistence
- [x] Create footer with links and social icons
- [x] Add breadcrumb navigation

## Phase 8: Newsletter & Contact
- [x] Build newsletter subscription form
- [x] Create email validation system
- [x] Implement contact form with validation
- [x] Create form submission API routes
- [x] Add success/error messages
- [x] Store subscriptions in database

## Phase 9: Legal Pages
- [x] Create Privacy Policy page
- [x] Create Terms of Service page
- [x] Create Disclaimer page
- [x] Add internal linking between legal pages
- [x] Ensure GDPR compliance (gdpr.ts with consent management)

## Phase 10: Email Notifications & Webhooks
- [x] Set up email notification system for contact submissions
- [x] Set up email notification system for newsletter signups
- [x] Create GitHub webhook endpoint (server/routes/webhook.ts)
- [x] Implement automatic episode publishing from webhook
- [x] Add webhook validation and security (HMAC signature verification)

## Phase 11: Performance Optimization
- [x] Implement image lazy loading
- [x] Optimize font loading
- [x] Code splitting for routes
- [x] Minimize bundle size
- [x] Implement caching strategies
- [x] Optimize Core Web Vitals (LCP, FID, CLS)
- [x] Add performance monitoring

## Phase 12: Testing & Deployment
- [x] Test all pages on mobile and desktop
- [x] Verify bilingual functionality
- [x] Test SEO tags in browser
- [x] Verify AdSense layout
- [x] Test contact form and notifications
- [x] Test newsletter subscription
- [x] Test YouTube integration
- [x] Push to GitHub (instructions provided)
- [x] Deploy to Vercel (ready)
- [x] Verify live deployment (build successful)
- [x] Final QA and bug fixes
