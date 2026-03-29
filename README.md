# 🏛️ SarkariSaathi — सरकारी साथी

> Free AI-powered government services navigator for common Indians. Step-by-step guidance for Ration Card, Aadhaar & PAN Card — in Hindi or English, always free.

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![Supabase](https://img.shields.io/badge/Supabase-Free_Tier-green)
![Gemini](https://img.shields.io/badge/Gemini-2.5_Pro-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

## 📌 What is SarkariSaathi?

Millions of Indians lose money to middlemen or waste entire days at government offices because they don't know the exact documents, correct portal, or right steps for a simple service like getting a Ration Card. Official government websites are often confusing, English-only, and not specific to your state.

SarkariSaathi solves this. It gives clear, step-by-step guidance for Ration Card, Aadhaar, and PAN Card — specific to your Indian state, in Hindi or English, completely free. No login, no fees, no middlemen.

It is built for middle-class Indians in tier 2 and tier 3 cities who need reliable, plain-language government help on a mobile phone. You just describe your problem — the AI figures out what you need and takes you straight to the right guide.

---

## ✨ Features

### Core Services
- 🌾 **Ration Card** — New application, correction, and lost card for all 30 Indian states
- 🪪 **Aadhaar Update** — Address change, mobile number update, and name/DOB correction
- 🪙 **PAN Card** — New PAN, lost PAN, and name/DOB correction

### 🔒 Authentication & Security
- 🔑 **Google OAuth** — Secure login powered by `better-auth` and Supabase.
- 🛡️ **Daily Question Limits** — Fair usage policy to manage API costs:
  - 👤 **Guest Users** — 5 free questions / 24 hours
  - ✅ **Logged-in Users** — 10 free questions / 24 hours
  - 🔄 **Auto-Reset** — Daily allowance resets automatically every 24 hours.

### 🤖 AI Navigator (Gemini 2.5)
- 🚀 **Model Prioritization** — Uses the latest **Gemini 2.5 and 2.1** models for superior intent detection, with stable fallback to **1.5 Flash**.
- 📍 **Context-Aware** — Automatically syncs with your selected state (e.g., Haryana) to provide localized results without needing to re-type it.
- ⚡ **Near-Instant Routing** — Refined prompts and route-level caching for faster redirects to official guides.

### 🌐 Localization & Accessibility
- 🇮🇳 **Full Hindi/English Sync** — 100% of the UI, including AI messages and error dialogs, switches instantly between languages.
- 🗣️ **Simplified Language** — Removed technical jargon like "AI Prompt"; uses plain words like "Questions" for common users.
- 🔊 **Live Voice Guidance** — Every step can be heard in Hindi or English using browser-native Text-to-Speech.

---

## 📈 Recent Improvements (March 2026)

- **Better Auth Integration**: Implemented a robust authentication layer with `better-auth`, supporting Google Social Login and session management.
- **Rate-Limiting Engine**: Developed a custom PostgreSQL-backed rate limiter that tracks usage via `ss_guest_id` cookies or user IDs.
- **Model Optimization**: Updated `lib/gemini.ts` to prioritize Gemini 2.5 Pro/Flash for better understanding of complex Indian administrative queries.
- **Port Conflict Fixes**: Resolved critical development environment issues (port 3000/3001) and origin mismatches for `better-auth`.
- **UI Localization Refactor**: Moved all chat-specific strings to metadata-driven state to ensure they update instantly when changing language, even for previously sent messages.
- **Simplified Terminology**: Updated all prompts and labels to use "Questions" instead of "Prompts" per user feedback for better accessibility.

### Design
- Built on UX4G design principles (India's official e-governance design standard)
- Tricolour palette — India Blue (`#1B4FA8`), Saffron (`#E07B00`), India Green (`#138808`)
- Noto Sans + Noto Sans Devanagari for perfect Hindi rendering

---

## 🏗️ Architecture

### How it works end-to-end

```
User types query (Hindi/English)
        ↓
Gemini 2.5 Pro/Flash (free tier)
Detects: service + subcase + state
        ↓
Returns JSON:
{ service, subcase, state }
        ↓
Supabase query:
guides table → filter by
service slug + subcase slug + state
        ↓
Guide page renders:
Steps + Documents + FAQ +
TTS + WhatsApp + Office Finder
```

---

**Frontend (Next.js 14)**
The app uses Next.js 14 with the App Router. Server components handle data fetching from Supabase, and client components handle interactivity (language toggle, TTS, checklist, state selector). i18next and react-i18next manage all Hindi/English translations. Tailwind CSS handles styling with a custom colour palette.

**AI Layer (Gemini 1.5 Flash)**
Gemini is used only for intent detection — not for content generation. When a user types a query, Gemini identifies which of the 3 services (Ration Card, Aadhaar, PAN), which subcase, and which state the user needs. All guide content, steps, and documents come directly from Supabase. Gemini never generates or invents government information.

**Database (Supabase / PostgreSQL)**
Three tables: `services`, `subcases`, and `guides`. The `guides` table stores all state-specific guide data as JSONB arrays — steps, documents, and form fields — in both Hindi and English. A single SQL migration file seeds data for 30 states across 3 services (270 total guide entries).

**Free APIs used**
| API | Purpose | Key required? |
|-----|---------|--------------|
| Web Speech API | Text-to-speech | No — browser native |
| WhatsApp URL scheme | Share guide via WhatsApp | No |
| Google Maps search URL | Find nearest office | No |
| CSC Locator (csc.gov.in) | Find Jan Seva Kendra | No |
| Nominatim / OpenStreetMap | Geocoding (available, not in production) | No |

---

## 🗂️ Project Structure

```
sarkari-saathi/
├── app/
│   ├── page.tsx                        # Homepage (hero + services + how it works)
│   ├── layout.tsx                      # Root layout with Navbar and Footer
│   ├── globals.css                     # Global styles
│   ├── chat/
│   │   └── page.tsx                    # AI chat interface
│   ├── guide/
│   │   └── [service]/[subcase]/[state]/
│   │       └── page.tsx                # Dynamic guide page
│   ├── reminders/
│   │   └── page.tsx                    # Application tracker / reminders
│   └── csc-locator/
│       └── page.tsx                    # CSC / Jan Seva Kendra locator
│
├── components/
│   ├── Navbar.tsx                      # Top navigation with state selector + language toggle
│   ├── Footer.tsx                      # Footer with links and disclaimer
│   ├── ServiceCard.tsx                 # Homepage service card
│   ├── ChatInterface.tsx               # AI chat UI and Gemini integration
│   ├── GuideSteps.tsx                  # Step-by-step guide renderer with TTS
│   ├── DocumentChecklist.tsx           # Interactive document checklist + WhatsApp share
│   ├── FAQSection.tsx                  # Collapsible FAQ per service
│   ├── ReminderTracker.tsx             # Reminder/tracker component
│   ├── StateSelector.tsx               # Searchable dropdown for 30 states
│   ├── LanguageToggle.tsx              # Hindi/English toggle button
│   └── ClientI18nProvider.tsx          # i18next client provider wrapper
│
├── lib/
│   ├── gemini.ts                       # Gemini API client and detectIntent function
│   ├── supabase.ts                     # Supabase client initialisation
│   └── i18n.ts                         # i18next configuration
│
├── context/
│   └── StateContext.tsx                # Global state context (selected Indian state)
│
├── public/
│   └── locales/
│       ├── en/
│       │   └── translation.json        # All English UI strings
│       └── hi/
│           └── translation.json        # All Hindi UI strings
│
├── supabase/
│   └── migrations/
│       └── 001_initial.sql             # Full DB schema + seed data for all 30 states
│
├── .env.local                          # Your private keys (never committed)
├── .env.local.example                  # Template showing which keys are needed
├── .gitignore
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 🛠️ Tech Stack

| Layer | Technology | Why chosen |
|-------|-----------|------------|
| Framework | Next.js 14 (App Router) | Full-stack, free on Vercel |
| Styling | Tailwind CSS | Utility-first, no extra cost |
| AI Model | Gemini 2.5 Pro/Flash | Best free tier (1M tokens/day) |
| Database | Supabase (PostgreSQL) | Free tier, 500MB, instant setup |
| Language | i18next + react-i18next | Hindi/English switching |
| TTS | Web Speech API | Browser native, completely free |
| Sharing | WhatsApp URL scheme | No API key needed |
| Fonts | Noto Sans + Noto Sans Devanagari | Perfect Hindi rendering via Google Fonts |
| Deployment | Vercel (free tier) | Zero config, free for hobby projects |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18 or above installed
- A free Supabase account — [supabase.com](https://supabase.com)
- A free Gemini API key — [aistudio.google.com](https://aistudio.google.com)

---

### 1. Clone the repository

```bash
git clone https://github.com/Vatxsal/SarkariSaathi_v1.git
cd SarkariSaathi_v1
```

---

### 2. Install dependencies

```bash
npm install
```

---

### 3. Set up environment variables

Create a `.env.local` file in the root of the project:

```env
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_key_here
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

**Where to get these keys:**
- **Gemini API key** → [aistudio.google.com](https://aistudio.google.com) → Get API Key → Create API Key (free, no credit card needed)
- **Supabase URL and anon key** → [supabase.com](https://supabase.com) → Your Project → Settings → API

---

### 4. Set up the database

1. Go to [supabase.com](https://supabase.com) and open your project
2. Click **SQL Editor** in the left sidebar
3. Click **New Query**
4. Open the file `supabase/migrations/001_initial.sql` from this project
5. Copy the entire contents and paste them into the SQL Editor
6. Click **Run**
7. You should see a success message — this creates all tables and seeds guide data for all 30 Indian states

---

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

### 6. Deploy to Vercel (optional)

```bash
npm install -g vercel
vercel
```

Then add the same environment variables in:
**Vercel Dashboard → Your Project → Settings → Environment Variables**

---

## 🗃️ Database Schema

### `services`
Stores the 3 top-level service categories.

| Column | Type | Example |
|--------|------|---------|
| id | uuid | — |
| slug | text | `ration_card` |
| name_en | text | `Ration Card` |
| name_hi | text | `राशन कार्ड` |
| icon_name | text | `container` |
| avg_time | text | `30` (minutes) |

---

### `subcases`
Stores the specific sub-problems under each service.

| Column | Type | Example |
|--------|------|---------|
| id | uuid | — |
| service_id | uuid (FK) | references services |
| slug | text | `new_application` |
| name_en | text | `New Application` |
| name_hi | text | `नया आवेदन` |

**Subcases available:**
- Ration Card → `new_application`, `correction`, `lost_card`
- Aadhaar Update → `address_change`, `mobile_update`, `name_correction`
- PAN Card → `new_pan`, `lost_pan`, `correction`

---

### `guides`
The main table. One row per state × subcase (270 total rows).

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| subcase_id | uuid (FK) | References subcases |
| state | text | e.g. `Uttar Pradesh` |
| documents_en | JSONB | Array of required document names in English |
| documents_hi | JSONB | Array of required document names in Hindi |
| steps_en | JSONB | Array of `{ step_number, title, description }` in English |
| steps_hi | JSONB | Array of `{ step_number, title, description }` in Hindi |
| office_name | text | Name of the office to visit |
| portal_url | text | Official government portal URL |
| fee_en | text | Fee description in English |
| fee_hi | text | Fee description in Hindi |
| timeline_days | integer | Expected processing time in days |
| form_fields_en | JSONB | Key form fields (English) |
| form_fields_hi | JSONB | Key form fields (Hindi) |
| last_verified_date | date | When this data was last verified |

---

## 📊 Data Coverage

| Service | States Covered | Subcases |
|---------|---------------|----------|
| Ration Card | 30 states/UTs | New Application, Correction, Lost Card |
| Aadhaar Update | 30 states/UTs | Address Change, Mobile Update, Name/DOB Correction |
| PAN Card | 30 states/UTs | New PAN, Lost PAN, Name/DOB Correction |

**Total: 270 guide entries** (30 states × 3 services × 3 subcases each)

---

## ⚠️ Disclaimer

> SarkariSaathi provides information based on publicly available government data. Always verify requirements at your local office or official government portal before visiting. This is not legal advice and is not affiliated with the Government of India. Information is verified periodically — last verified March 2026.

---

## 🤝 Contributing

Contributions are welcome — especially for keeping guide data accurate and up to date. Government processes change frequently, and keeping 270 guide entries current is a community effort.

If you notice outdated information (wrong fee, changed portal URL, new document requirement), please open an issue or a pull request with the correct data and a link to the official government source.

To add a new state or service, follow the existing seed data format in `supabase/migrations/001_initial.sql` — each guide entry follows the same JSONB structure.

---

## 📄 License

MIT License — free to use, modify, and distribute. See [LICENSE](LICENSE) for details.

---

## 🙏 Acknowledgements

- [UX4G](https://ux4g.gov.in) — India's official e-governance design standard
- NFSA, UIDAI, Income Tax Department — for publicly available government data
- [Google AI Studio](https://aistudio.google.com) — free Gemini API tier
- [Supabase](https://supabase.com) — free PostgreSQL hosting
- OpenStreetMap / Nominatim — free geocoding
