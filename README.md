# AI Movie Insight Builder

A futuristic web app that fetches movie details and delivers **AI-powered audience sentiment analysis** by scraping real IMDb reviews and processing them through Google Gemini.

## ✨ Features

- **Instant Movie Lookup** — Fetches poster, cast, rating, runtime, and plot via OMDB API
- **Live IMDb Review Scraping** — Uses Puppeteer to extract user reviews directly from IMDb
- **AI Sentiment Analysis** — Google Gemini analyzes reviews and returns a summary + classification (Positive / Mixed / Negative)
- **Premium Glassmorphism UI** — Animated gradient backgrounds, floating glow orbs, neon accents, and Framer Motion animations

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | Next.js 16, React 19, TypeScript | App Router with server-side API routes |
| Styling | Tailwind CSS v4, Framer Motion | Glassmorphism design system + animations |
| Scraping | Puppeteer, Cheerio | Headless Chrome for IMDb review extraction |
| AI | Google Gemini (`@google/genai`) | Sentiment analysis and summarization |
| Movie Data | OMDB API | Poster, metadata, and ratings |
| Icons | Lucide React | UI iconography |

## 🏗️ Architecture

```
User → [page.tsx] → /api/movie   → OMDB API (movie metadata)
                  → /api/reviews  → IMDb (Puppeteer scraping)
                  → /api/sentiment → Google Gemini (AI analysis)
```

1. **Frontend** (`page.tsx`) — Orchestrates API calls sequentially, renders results with animated transitions
2. **`/api/movie`** — Validates IMDb ID, fetches metadata from OMDB, returns standardized response
3. **`/api/reviews`** — Launches headless Chrome, navigates to IMDb reviews page, extracts review text from `__NEXT_DATA__` JSON (with Cheerio fallback)
4. **`/api/sentiment`** — Sends reviews to Gemini with a structured prompt, returns summary + classification

## 🚀 Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables** — create `.env.local`:
   ```env
   OMDB_API_KEY=your_omdb_key
   GEMINI_API_KEY=your_gemini_key
   ```
   - OMDB key: [omdbapi.com/apikey.aspx](http://www.omdbapi.com/apikey.aspx)
   - Gemini key: [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)

3. **Run the dev server:**
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) and enter an IMDb ID (e.g., `tt0133093` for The Matrix).

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx           # Main UI (search, results, animations)
│   ├── layout.tsx         # Root layout with Google Fonts
│   ├── globals.css        # Glassmorphism design system
│   └── api/
│       ├── movie/route.ts     # OMDB API proxy
│       ├── reviews/route.ts   # IMDb Puppeteer scraper
│       └── sentiment/route.ts # Gemini AI analysis
├── components/
│   ├── MovieCard.tsx      # Movie details with 3D parallax poster
│   ├── SentimentInsight.tsx # AI sentiment display with badges
│   └── AILoader.tsx       # Animated loading visualization
└── lib/
    └── utils.ts           # IMDb ID validation
```

## 🌐 Deployment

Optimized for **Vercel**:

1. Push to GitHub
2. Import in Vercel dashboard
3. Add `OMDB_API_KEY` and `GEMINI_API_KEY` as environment variables
4. Deploy

> **Note:** Puppeteer uses `@sparticuz/chromium` for serverless compatibility. In development, it uses your local Chrome installation.
