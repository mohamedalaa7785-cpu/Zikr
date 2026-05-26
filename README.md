# ZIKR | ذِكرٌ

## A Premium Islamic Spiritual Platform

ZIKR is a cinematic, luxurious Islamic platform designed to deepen spiritual connection through the Quran, Hadith, Islamic stories, AI-powered assistance, and Islamic radio. Built with modern web technologies and a focus on user experience, ZIKR combines traditional Islamic knowledge with contemporary digital innovation.

### 🌟 Key Features

- **القرآن الكريم (The Quran)**: Read and listen to Quranic verses with deep explanations and translations
- **الأحاديث الشريفة (Hadith)**: Discover authentic Hadith from reliable Islamic sources
- **القصص الإسلامية (Islamic Stories)**: Experience stories of Prophets, Companions, and Scholars in a cinematic way
- **المساعد الذكي (AI Assistant)**: Get reliable religious answers from an AI trained on Islamic sciences
- **الإذاعة الإسلامية (Islamic Radio)**: Listen to lectures and seminars from renowned Islamic scholars
- **المجتمع (Community)**: Connect with a community of committed Muslims

### 🎨 Design Philosophy

ZIKR embodies a **spiritual, cinematic, luxurious, calm, and immersive** aesthetic:

- **Deep Black & Dark Navy**: Premium, focused atmosphere
- **Soft Gold**: Spiritual elegance and warmth
- **Islamic Green**: Connection to Islamic heritage
- **Glassmorphism & Glow Effects**: Modern, ethereal design
- **Arabic-First Typography**: Optimized for RTL languages
- **Smooth Animations**: Framer Motion for cinematic transitions

### 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS 4, Framer Motion
- **Backend**: Express.js, tRPC
- **Database**: Supabase (PostgreSQL)
- **Storage**: AWS S3
- **Deployment**: Vercel
- **Build Tools**: Vite, esbuild
- **UI Components**: Radix UI

### 📱 Multi-Language Support

ZIKR is built with full internationalization (i18n) support:

- **Arabic (العربية)**: Primary language with RTL support
- **English**: Fully supported
- **Future Ready**: Architecture prepared for Turkish, Urdu, Indonesian

### 🚀 Getting Started

#### Prerequisites

- Node.js 18+
- pnpm 10+
- PostgreSQL database (via Supabase)

#### Installation

```bash
# Clone the repository
git clone https://github.com/mohamedalaa7785-cpu/zikr.git
cd zikr

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Run development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

#### Environment Variables

See `.env.example` for all required environment variables. Key variables:

- `DATABASE_URL`: PostgreSQL connection string
- `SUPABASE_URL` & `SUPABASE_ANON_KEY`: Supabase configuration
- `AWS_*`: S3 storage configuration
- `OPENAI_API_KEY`: For AI assistant features

### 📁 Project Structure

```
zikr/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── _core/         # Core utilities and types
│   │   ├── components/    # Reusable React components
│   │   │   ├── layout/    # Navbar, Footer, etc.
│   │   │   └── ui/        # UI system components
│   │   ├── features/      # Feature-specific components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utilities and libraries
│   │   │   └── i18n/      # Internationalization
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── store/         # State management
│   │   ├── styles/        # Design system (colors, typography, etc.)
│   │   └── types/         # TypeScript type definitions
│   └── public/            # Static assets
├── server/                # Backend Express/tRPC server
│   ├── _core/            # Core server utilities
│   └── routes/           # API routes
├── shared/               # Shared types and utilities
├── drizzle/              # Database schema and migrations
└── package.json          # Project dependencies
```

### 🎯 Development Workflow

#### Running Development Server

```bash
pnpm dev
```

This starts both the frontend (Vite) and backend (Express) in development mode.

#### Type Checking

```bash
pnpm check
```

#### Building for Production

```bash
pnpm build
```

#### Database Migrations

```bash
pnpm db:push
```

### 🗄️ Database Schema

ZIKR uses Drizzle ORM with PostgreSQL. Key tables:

- **users**: User accounts and authentication
- **episodes**: Content episodes (legacy compatibility)
- **stories**: Islamic stories
- **story_progress**: User progress tracking
- **subscriptions**: Newsletter subscriptions
- **payments**: Payment tracking
- **user_subscriptions**: Subscription plans

See `drizzle/schema.ts` for complete schema definition.

### 🔐 Security & Privacy

- Row-Level Security (RLS) policies in Supabase
- JWT-based authentication
- Encrypted sensitive data
- GDPR-compliant data handling
- Privacy policy and terms of service

### 📊 Performance Optimization

- Lazy loading and code splitting
- Image optimization
- Dynamic imports for large components
- Lighthouse-ready architecture
- SEO optimization with structured data

### 🌐 SEO & Metadata

- Dynamic metadata per page and locale
- OpenGraph and Twitter Card support
- Structured data (JSON-LD) for rich snippets
- Sitemap and robots.txt
- Canonical URLs with hreflang support

### 📱 PWA Support

ZIKR is built as a Progressive Web App:

- Installable on mobile and desktop
- Offline-ready architecture
- Web manifest with app icons
- Service worker support

### 🤝 Contributing

We welcome contributions! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

### 📞 Support & Contact

- **Email**: contact@zikr.app
- **Website**: https://zikr.vercel.app
- **GitHub Issues**: Report bugs and request features

### 🙏 Acknowledgments

ZIKR is built with respect for Islamic knowledge and values. We acknowledge:

- Islamic scholars and sources
- The open-source community
- Our users and contributors

---

**ZIKR | ذِكرٌ** - Bringing Islamic knowledge to the digital age with elegance and authenticity.

*Last Updated: May 2026*

## Phase 2 setup (Supabase + Auth + Drizzle)

### Required environment variables

Create `.env.local` with:

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

### Apply migrations

1. Ensure your Drizzle database URL points to Supabase Postgres.
2. Run:

```bash
pnpm db:push
```

Or execute SQL manually:

```bash
psql "$DATABASE_URL" -f drizzle/migrations/0002_phase2_auth_foundation.sql
```

### Supabase dashboard steps

- Enable Email provider in Auth.
- Configure Redirect URLs to include `/auth/callback`.
- Verify `public-assets` bucket exists.
- Verify RLS and policies on `profiles`, `favorites`, `reading_progress`, and `reminders`.


## Phase 3 content import scripts

```bash
pnpm tsx scripts/import-quran.ts
pnpm tsx scripts/import-tafsir.ts
pnpm tsx scripts/import-reciters.ts
pnpm tsx scripts/import-hadith.ts
```

All scripts are idempotent (upsert-based) and require `DATABASE_URL` plus Supabase-side RLS/admin setup.
