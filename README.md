# VerifyTW 台企查 - MVP Frontend

A polished, production-oriented frontend prototype for a Taiwan public-record lookup tool. Check companies, employers, and business partners using public registration data.

## Project Overview

**Core Promise:**
> 查公司、查雇主、查交易對象。公開資料，一次看懂。
> Check Taiwan companies, employers, and business partners with public records.

**Status:** MVP Frontend Prototype with mock data

## What's Built

### Pages
- **Landing Page** (`/`) - Hero section with search, trust note, and info cards
- **Search Results** (`/search`) - Mock search with filter chips and result cards
- **Company Detail** (`/company/[ban]`) - Public-record-style report page
- **Design System** (`/design-system`) - Internal reference for brand consistency

### Component Library
- **UI Components**: Button, Input, StatusBadge, Chip, NoticeBox, LoadingSkeleton, EmptyState
- **Feature Components**: BrandHeader, SearchBox, CompanyCard, CompanyInfoTable, RiskSummary, SourceNote
- All components include:
  - TypeScript types
  - WCAG AA accessibility
  - Focus rings and keyboard navigation
  - Responsive design (mobile-first)
  - Proper state management (hover, active, disabled, loading)

### Design System
- **Color Tokens**: Brand palette from VerifyTW style guide
- **Typography**: Noto Sans TC (Chinese) + Inter (English) with proper fallbacks
- **Spacing**: 8px grid system
- **Motion**: Fast (120ms), Base (180ms), Slow (250ms) with easing functions
- **Dark Mode**: Token structure ready, UI defaults to light mode
- **Accessibility**: High contrast ratios, status labels with icons, `prefers-reduced-motion` support

### Data Layer
- **Mock Data**: 7 sample companies in `src/lib/mockCompanies.ts`
- **Zod Schemas**: Validation for Company, SearchQuery, Status
- **Search Function**: Filters mock data by name, BAN, or representative
- **TODO Comments**: Placeholders for real API integration (MOEA, MOF, Supabase)

## Tech Stack

```
Next.js 14         App Router, SSR-ready
TypeScript         Full type safety
Tailwind CSS       Design tokens aligned with brand
shadcn/ui style    Custom components (not generic)
Zod               Schema validation
Lucide React       Icons (24px-compatible)
```

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. **Clone and navigate:**
   ```bash
   cd d:\git\verifytw
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Open browser:**
   ```
   http://localhost:3000
   ```

### Build for Production

```bash
npm run build
npm run start
```

## Project Structure

```
src/
├── app/                      # Next.js App Router
│   ├── layout.tsx           # Root layout + header/footer
│   ├── globals.css          # Tailwind + global styles
│   ├── page.tsx             # Landing page (/)
│   ├── search/
│   │   └── page.tsx         # Search results (/search)
│   ├── company/[ban]/
│   │   └── page.tsx         # Company detail (/company/[ban])
│   └── design-system/
│       └── page.tsx         # Design system reference
│
├── components/
│   ├── ui/                  # Reusable UI primitives
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── StatusBadge.tsx
│   │   ├── Chip.tsx
│   │   ├── NoticeBox.tsx
│   │   ├── LoadingSkeleton.tsx
│   │   └── EmptyState.tsx
│   ├── BrandHeader.tsx      # Navigation + logo
│   ├── SearchBox.tsx        # Search form
│   ├── CompanyCard.tsx      # Search result card
│   ├── CompanyInfoTable.tsx # Detail page table
│   ├── RiskSummary.tsx      # Risk/check summary
│   └── SourceNote.tsx       # Data source citation
│
├── lib/
│   ├── mockCompanies.ts     # Mock data + search function
│   └── utils.ts             # Helper functions (cn)
│
├── types/
│   └── company.ts           # Zod schemas + types
│
└── config files:
    ├── tsconfig.json
    ├── tailwind.config.ts
    ├── postcss.config.js
    └── next.config.js
```

## Design System Reference

### Color Tokens (Tailwind)
- `main-ink`: #102A43 (primary text)
- `civic-blue`: #2563A6 (primary action)
- `data-teal`: #159A9C (accent, use #0B6F71 for text)
- `island-green`: #4F8F6B (success/positive)
- `stamp-red`: #C94C4C (use #9F2F2F for warning text)
- `rice-paper`: #F8F3E7 (light background)
- `form-gray`: #E7E2D8 (borders/dividers)
- `support-blue-gray`: #DCE6F1 (info backgrounds)

### Typography Scales
- **Size**: xs (12px) → sm (14px) → base (16px) → lg (18px) → xl (20px) → 2xl (24px) → 3xl (32px) → 4xl (40px)
- **Font**: Noto Sans TC (Chinese) + Inter (English)
- **Line Heights**: Generous (1.5x–2x) for readability

### Spacing Grid
- xs (4px), sm (8px), md (12px), lg (16px), xl (24px), 2xl (32px), 3xl (40px), 4xl (48px), 5xl (64px)

### Motion
- **Durations**: fast (120ms), base (180ms), slow (250ms)
- **Easing**: standard, enter, exit, emphasized

## Key Features

### Accessibility ✓
- WCAG AA contrast ratios (tested on brand colors)
- Keyboard navigation (Tab, Enter, Escape support)
- Visible focus rings
- Status labels always use icon + text (no color-only status)
- `prefers-reduced-motion` support
- Proper `aria-label` and `role` attributes

### Responsive Design ✓
- Mobile-first Tailwind classes
- Flexible grid layouts
- Touch-friendly tap targets (min 44px)
- Collapsible nav on mobile

### No External Dependencies (UI)
- Custom button, input, badge, chip components
- No generic shadcn/ui styles (build our own)
- Lucide icons only (lightweight)
- Tailwind CSS for all styling

## Mock Data

7 sample companies for testing search, filtering, and detail pages:

```json
{
  "ban": "12345678",
  "nameZh": "台灣範例股份有限公司",
  "nameEn": "Taiwan Sample Technology Co., Ltd.",
  "status": "資料相符",
  "representative": "王小明",
  "capital": "5,000,000",
  "address": "臺北市中正區重慶南路一段10號",
  "establishedDate": "2010/01/15",
  "lastUpdated": "2024/05/20",
  "source": "經濟部商工登記公開資料"
}
```

Search filters by BAN, Chinese name, English name, or representative.

## Future Integration Points

### TODO: API Integration
All marked with `TODO:` comments in code:

1. **Company Registration API (MOEA)**
   - Search by name, BAN, keyword
   - Fetch detail by BAN
   - Location: `src/lib/mockCompanies.ts`

2. **Tax Registration Data (MOF)**
   - Link company to tax status
   - Risk flags for inactive/overdue companies

3. **Supabase/Postgres**
   - Cache popular searches
   - User favorites/bookmarks
   - Query analytics

4. **PDF Export**
   - Generate report PDFs
   - Track exports for compliance

### Recommended Next Steps
1. Connect to real MOEA API for company data
2. Add Supabase for user authentication and favorites
3. Implement PDF export functionality
4. Add search analytics and caching
5. Build admin dashboard for data refresh
6. Create public API for partner integrations

## Brand Guidelines

### Language
- Chinese-first, bilingual second
- Civic-tech tone (trustworthy, not corporate SaaS)
- Practical language ("查詢", "確認"), not fearmongering
- Avoid: "scam", "fraud", "dangerous", "guaranteed safe"
- Good phrases: "資料相符", "建議再確認", "無公開資料"

### Visual Tone
- Taiwanese public-record lookup tool
- Friendly but trustworthy
- Practical, not corporate SaaS
- Not cybersecurity-heavy, not fintech-heavy
- Not overly cute

### Internationalization
- All pages bilingual (Chinese/English)
- Proper zh-TW HTML lang attribute
- Font fallback chains: Noto Sans TC → Inter → system sans

## Development Notes

### Component Best Practices
- Use React.forwardRef for custom inputs
- Implement controlled + uncontrolled modes where needed
- Always export types alongside components
- Keep components focused and reusable
- Use cn() utility for conditional classes

### Styling Approach
- Tailwind first, custom CSS last
- Use design tokens consistently
- Support both light and dark mode token structure
- Respect user motion preferences

### Testing (Future)
- Unit tests for components
- Integration tests for pages
- E2E tests for search flow
- A11y tests with axe or WAVE

## Deployment

### Recommended Hosting
- **Vercel** (native Next.js)
- **Netlify** (with adapters)
- **AWS Amplify** (for AWS ecosystem)

### Environment Variables
```
# .env.local
NEXT_PUBLIC_API_BASE=https://api.moea.gov.tw
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

## License & Attribution

This is a civic-tech project. Please follow Taiwan public data terms of service when integrating real APIs.

## Support

For design system questions, see `/design-system` page.
For component docs, check JSDoc comments in `src/components/`.

---

**Happy building! 🎉**

先查一下，再放心合作。
Check first, partner with confidence.
