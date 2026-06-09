# VerifyTW 台企查 - MVP Frontend

A polished, production-oriented frontend prototype for a Taiwan public-record lookup tool. Check companies, employers, and business partners using public registration data.

## Project Overview

**Core Promise:**
> 查公司、查雇主、查交易對象。公開資料，一次看懂。
> Check Taiwan companies, employers, and business partners with public records.

**Status:** Chinese-first validation-ready MVP with live MOEA company and business registration lookup, combined keyword search, a restrained English helper layer, and a lightweight deeper-check intake flow.

VerifyTW is designed as a Chinese-first Taiwan public-record tool with concise English helper text for Taiwan users plus English-speaking newcomers, job seekers, freelancers, and remote workers.
It does not provide a full English mode yet.
It is an independent project by Jeremy Jewell and is not affiliated with any Taiwan government agency.

## What's Built

### Pages
- **Landing Page** (`/`) - Hero section with search, trust note, and info cards
- **Search Results** (`/search`) - Live + fallback registration search with filter chips and result cards
- **Company Detail** (`/company/[ban]`) - Public-record-style registration report page
- **Data Guide** (`/data`) - What VerifyTW checks, what it does not yet cover
- **About** (`/about`) - Product explanation and positioning
- **Deeper Check** (`/deeper-check`) - Lightweight validation request intake
- **Sample Report** (`/sample-report`) - Demo manual-report format using fictional data and submitted-info comparison
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
- **MOEA Lookup Spike**:
  - `/company/[ban]` attempts a live MOEA company-registration lookup and business-registration lookup, then falls back to mock data
  - `/search?q=...` attempts live MOEA company + business keyword search, then falls back to mock/local results
  - keyword search depends on MOEA response speed and official registered entity names
  - Business ID lookup is usually more reliable than keyword search
  - alias/common-name expansion is limited and shown transparently in the UI
- **Deeper Check Flow**: Validated intake form with server-side submission and Email fallback
- **TODO Comments**: Placeholders for pagination, exact matching, MOF cross-checks, and caching

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

## Real-Data Spike: Business ID Lookup + Multi-source Keyword Search

The current public-data integration spike now covers:

- `/company/[ban]` for 8-digit Business ID (`統一編號`) lookup
- `/search?q=...` for keyword / registration-name search

- Sources: MOEA / GCIS company registration and business registration public-data endpoints
- company Business ID lookup endpoint:
  - `https://data.gcis.nat.gov.tw/od/data/api/5F64D864-61CB-4D0D-8AD9-492047CC1EA6?$format=json&$filter=Business_Accounting_NO eq {BAN}&$skip=0&$top=1`
- company keyword search endpoint:
  - `https://data.gcis.nat.gov.tw/od/data/api/6BBA2268-1367-4B42-9CCA-BC17499EBE8C?$format=json&$filter=Company_Name like {QUERY} and Company_Status eq 01&$skip=0&$top=20`
- business Business ID lookup endpoint:
  - `https://data.gcis.nat.gov.tw/od/data/api/426D5542-5F05-43EB-83F9-F1300F14E1F1?$format=json&$filter=President_No eq {BAN}&$skip=0&$top=1`
- business keyword search endpoint:
  - `https://data.gcis.nat.gov.tw/od/data/api/A1B4CBFF-2D3A-409B-8A78-2AD94F63AE4A?$format=json&$filter=Business_Name like {QUERY} and Business_Current_Status eq 01&$skip=0&$top=20`
- Behavior:
  - validates 8-digit Business IDs before detail lookup
  - validates search queries before live keyword search
  - tries live MOEA company + business data first when enabled
  - normalizes official MOEA fields into the app's shared registration-record shape
  - combines company and business search results into one list with clear type labels
  - can partially succeed when one source is available and another is slow or unavailable
- falls back to mock/local results when live data is unavailable or returns no usable result

Keyword search depends on MOEA response speed and official registered names.
Business ID lookup is usually more reliable.
Alias mapping is limited and disclosed in the UI when used.

## MOF Research Spike

MOEA is currently the active live source authority for company and business registration lookups.

The next true cross-source candidate is the MOF tax-business registration dataset:

- Dataset: `全國營業(稅籍)登記資料集`
- Provider: Fiscal Information Agency, Ministry of Finance
- Official dataset page: `https://data.gov.tw/dataset/9400`

Current research indicates:

- the dataset is published as a file dataset, with a CSV resource and a ZIP download reference
- the dataset page says the open file covers active tax registrations only
- the update frequency is listed as daily
- this is not yet treated as a proven lightweight per-request lookup API in this repo

Because of that, VerifyTW does not yet use MOF as a live production lookup source.
The safest next step is to ingest the CSV/ZIP dataset into a generated local index or future cache layer, then perform Business ID cross-checks against that indexed data.

Public records remain preliminary reference only.

### Local MOF Ingestion

The local MOF ingestion workflow expects the official CSV to exist at:

- `data/mof/BGMOPEN1.csv`

PowerShell setup:

```powershell
New-Item -ItemType Directory -Force data/mof, data/generated
Test-Path data/mof/BGMOPEN1.csv
```

Run a small limited test:

```powershell
npm run build:mof-index -- --input data/mof/BGMOPEN1.csv --output data/generated/mof-tax-index.sample.json --limit 1000
```

Run the full index:

```powershell
npm run build:mof-index -- --input data/mof/BGMOPEN1.csv --output data/generated/mof-tax-index.json
```

Run the fixture parser check:

```powershell
npm run build:mof-index -- --input src/lib/sources/fixtures/mof-tax-sample.csv --output data/generated/mof-tax-index.fixture.json
```

Notes:

- `data/mof/BGMOPEN1.csv` must not be committed
- generated JSON files under `data/generated/` are ignored by Git
- this is local/prototype ingestion only
- MOF is not yet shown as a live UI source
- MOF and MOEA fields such as capital, address, and dates may differ because source definitions and update timing may differ

## Validation-ready MVP

The current product goal is monetization validation, not building a full business platform yet.

What is working now:

- live MOEA company/business detail lookup by Business ID (`統一編號`)
- live MOEA keyword/registration-name search
- mock fallback when live results are unavailable or out of scope
- a manual deeper-check request flow on `/deeper-check`
- server-side intake suitable for monetization validation
- a sample report page at `/sample-report` showing the manual report format with fictional/demo data and submitted-info comparison

What is intentionally not built yet:

- no payment system yet
- no Supabase/cache yet
- no MOF cross-check yet
- no branch (`分公司`) live coverage yet
- no legal, investment, or transaction advice
- no guarantee of safety

### Environment Variables

No environment variables are required for the default spike.

Optional:

```bash
# Disable live MOEA lookup and use mock-only behavior
MOEA_LOOKUP_ENABLED=false

# Override the endpoint for testing or future proxying
MOEA_COMPANY_API_BASE=https://data.gcis.nat.gov.tw/od/data/api/5F64D864-61CB-4D0D-8AD9-492047CC1EA6
MOEA_COMPANY_KEYWORD_API_BASE=https://data.gcis.nat.gov.tw/od/data/api/6BBA2268-1367-4B42-9CCA-BC17499EBE8C
MOEA_BUSINESS_API_BASE=https://data.gcis.nat.gov.tw/od/data/api/426D5542-5F05-43EB-83F9-F1300F14E1F1
MOEA_BUSINESS_KEYWORD_API_BASE=https://data.gcis.nat.gov.tw/od/data/api/A1B4CBFF-2D3A-409B-8A78-2AD94F63AE4A

# Deeper-check intake
RESEND_API_KEY=re_xxx
DEEPER_CHECK_TO_EMAIL=hello@verifytw.example
DEEPER_CHECK_FROM_EMAIL=VerifyTW <onboarding@resend.dev>
```

### Fallback Rules

- `real company data available` → render the real MOEA-backed registration detail
- `real business data available and no company record exists` → render the real MOEA-backed business registration detail
- `real API unavailable + matching mock record exists` → render the mock record with a calm fallback note
- `real API unavailable + no matching mock record` → show a respectful unavailable state
- `real API returns no record + no matching mock record` → show the existing not-found state
- `live keyword results available` → render MOEA-backed company/business search results
- `one live source returns results and another source fails` → render available live results with a partial-source note
- `live keyword results unavailable + matching mock/local results exist` → render mock/local results with a calm fallback note
- `live keyword results return no usable result + matching mock/local results exist` → render mock/local results
- `live keyword results return no usable result + no mock/local result` → show the existing calm no-results state

### Local Troubleshooting

If local testing becomes confusing, especially when `3000` and `3001` show different behavior:

1. Stop every running local Next server.
   - `Ctrl+C`
2. Clear the local build output.
   - `Remove-Item -Recurse -Force .next`
3. Reinstall if needed.
   - `npm install`
4. Re-run checks.
   - `npm run lint`
   - `npm run build`
5. Start a single production-style local server.
   - `npm run start`

Notes:
- Use only one local port during testing.
- If `3000` and `3001` differ, stop both and restart cleanly.
- `.env.local` changes require a full server restart.
- `.env.local` should not be committed.

### Debug Diagnostics

Development-only non-secret diagnostics are available at:

- `/api/debug/verifytw`

This endpoint returns:
- `NODE_ENV`
- whether MOEA live lookup is enabled
- whether Resend intake env vars are configured
- current timestamp
- app mode: `live-enabled` or `mock-only`
- MOEA endpoint hostnames
- BAN lookup and keyword lookup timeout values

The debug endpoint is only available in development unless:

- `VERIFYTW_DEBUG_ENABLED=true`

### Known Limitations

- Live lookup now attempts both MOEA company-registration and business-registration records.
- Live keyword search now queries both company and business sources, but response speed still depends on the external MOEA endpoints.
- MOF tax-business registration is being investigated as the next true cross-source check, but it is not live in production yet.
- Early research suggests MOF integration may require CSV/ZIP ingestion and caching rather than simple per-request runtime fetches.
- The keyword endpoint is currently filtered to `Company_Status eq 01`, which favors active company registrations.
- The business keyword endpoint is currently filtered to `Business_Current_Status eq 01`, which favors active business registrations.
- Field availability may differ between company and business registration records.
- Search can partially succeed if one source responds and another source is slow or unavailable.
- Branch (`分公司`) live coverage is still future work.
- Live keyword search depends on the external MOEA response speed; slow upstream responses can trigger a timeout state.
- Full registered company names and 8-digit Business IDs are more reliable than short aliases.
- Alias mapping is intentionally limited and is disclosed in the search UI when used.
- The MOEA response currently maps to the app's shared registration/search shape; it does not yet include pagination, exact-name matching, tax cross-checks, or caching.
- English company names are not provided by the current MOEA BAN endpoint, so live records may omit that field.
- Public-data availability and response times depend on the external MOEA source.

### Manual QA Checklist

- `/company/20828393`
  - Expected: live MOEA company detail if source responds
- `/search?q=台灣積體電路製造股份有限公司`
  - Expected: live company result if MOEA responds in time
- `/company/12345678`
  - Expected: mock fallback/demo data if live disabled or mock exists
- `/search?q=台積電`
  - Expected: alias path or timeout/clear state
- `/search?q=中台灣物流商業社`
  - Expected: business-registration result if the business source responds, or mock fallback if using demo data
- `/search?q=notarealcompanyxyz`
  - Expected: calm zero-results state
- `/deeper-check`
  - Expected: form validates; server submission requires Resend env vars
- `/api/debug/verifytw`
  - Expected: non-secret diagnostics in development

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
│   ├── data/
│   │   └── page.tsx         # Data guide (/data)
│   ├── about/
│   │   └── page.tsx         # About page (/about)
│   ├── deeper-check/
│   │   └── page.tsx         # Manual deeper-check request (/deeper-check)
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
│   ├── SiteFooter.tsx       # Footer links
│   ├── SearchBox.tsx        # Search form
│   ├── SearchResultsControls.tsx
│   ├── CompanyCard.tsx      # Search result card
│   ├── CompanyInfoTable.tsx # Detail page table
│   ├── RiskSummary.tsx      # Risk/check summary
│   └── SourceNote.tsx       # Data source citation
│   ├── DeeperCheckCTA.tsx   # Conversion CTA
│   └── DeeperCheckForm.tsx  # Manual request form
│
├── lib/
│   ├── mockCompanies.ts     # Mock data + search function
│   ├── companyLookup.ts     # Real-data + mock fallback orchestration for detail pages
│   ├── companySearch.ts     # Real-data + mock fallback orchestration for search pages
│   ├── validation.ts        # Zod schemas and validation helpers
│   ├── companyDisplay.ts    # Display labels/helpers
│   ├── sources/
│   │   └── moea.ts          # MOEA company/business registration lookup + keyword search
│   └── utils.ts             # Helper functions (cn)
│
├── types/
│   └── company.ts           # Company/search types
│
└── config files:
    ├── tsconfig.json
    ├── tailwind.config.js
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

7 sample records for testing search, filtering, and detail pages:

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

1. **MOEA Keyword Search Expansion**
   - Add pagination
   - Add exact company-name matching
   - Add branch/business registration coverage
   - Location: `src/lib/sources/moea.ts`

2. **Tax Registration Data (MOF)**
   - Cross-check company registration against tax registration status

3. **Supabase/Postgres**
   - Cache public lookup responses
   - Store normalized source snapshots

### Recommended Next Steps
1. Add pagination and exact-name matching for keyword search
2. Add a caching layer before repeated MOEA requests
3. Add MOF tax registration cross-checks
4. Improve source-link display and field-level provenance

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
```bash
# .env.local
MOEA_LOOKUP_ENABLED=false
MOEA_COMPANY_API_BASE=https://data.gcis.nat.gov.tw/od/data/api/5F64D864-61CB-4D0D-8AD9-492047CC1EA6
MOEA_COMPANY_KEYWORD_API_BASE=https://data.gcis.nat.gov.tw/od/data/api/6BBA2268-1367-4B42-9CCA-BC17499EBE8C
```

## Deeper-check Intake

- `/deeper-check` now submits to a server-side intake endpoint: `src/app/api/deeper-check/route.ts`
- The endpoint validates the request body with Zod and sends an email using Resend
- The client shows a success confirmation without opening the user's local mail app
- If server submission fails, the UI shows a calm error state plus an Email fallback link
- Recipient address is controlled by environment variables and is never hardcoded as a real personal email
- No payment system is implemented yet; payment remains manual and out of scope for this MVP
- This flow exists to validate demand for a paid/manual deeper-check service before building a larger platform
- `/sample-report` shows a fictional/demo sample so users can preview the manual report format, including how a Context Check compares submitted claims against public records, without implying a claim about any real company

### Production Checklist For /deeper-check

- Set `RESEND_API_KEY`
- Set `DEEPER_CHECK_TO_EMAIL`
- Set `DEEPER_CHECK_FROM_EMAIL`
- Confirm the sender address or sending domain is allowed in Resend
- Redeploy after changing Netlify environment variables
- Test `/deeper-check` on production after deployment

### Manual Deeper-check Offer

- VerifyTW is an independent project by Jeremy Jewell and is not affiliated with any Taiwan government agency
- The deeper-check offer is manual and currently being tested
- `/deeper-check` has stronger bilingual support than the rest of the app because it is the manual-service validation page for potential paying users
- `/sample-report` exists to show what a manual deeper-check report can look like before a user submits a request
- The sample report demonstrates how a Context Check compares user-provided claims against public records while still avoiding safety or legal guarantees
- The free lookup gives public-record fields plus an initial summary
- The manual deeper check adds human context, comparison against the details the user provides, and next-step confirmation notes
- Basic Record Check: NT$600 for one entity plus short interpretation of what the public record does and does not show
- Context Check: NT$1,200 for one situation plus comparison against user-provided details such as a website, email, contract, message, rental details, or payment information
- Arrival Shortlist: NT$2,500 for brief checks on up to 5 entities; it is not five full Context Check reports
- Manual-check prices are introductory validation pricing and may change later based on scope, demand, and processing time
- Scope, price, and payment method are confirmed by email before work begins
- Payment remains manual after scope confirmation; there is no online checkout yet, and payment method and currency are confirmed by email

### Local Development Without Resend

You can run the app locally without configuring Resend.

- Leave `RESEND_API_KEY`, `DEEPER_CHECK_TO_EMAIL`, and `DEEPER_CHECK_FROM_EMAIL` unset
- The form will still validate normally
- Submission will fail in a controlled way and show:
  - `暫時無法送出申請。你可以稍後再試，或使用 Email 備用方式聯絡我們。`

### Testing Success / Failure

To test failure locally:

1. leave the Resend env vars unset
2. submit a valid deeper-check form
3. confirm the controlled error message appears
4. confirm the Email fallback link is shown

To test success locally:

1. set `RESEND_API_KEY`
2. set `DEEPER_CHECK_TO_EMAIL=hello@verifytw.example` or your own safe test inbox
3. set `DEEPER_CHECK_FROM_EMAIL=VerifyTW <onboarding@resend.dev>`
4. restart the server
5. submit a valid deeper-check form
6. confirm the success message appears without opening a local mail app

## License & Attribution

This is a civic-tech project. Please follow Taiwan public data terms of service when integrating real APIs.

## Support

For design system questions, see `/design-system` page.
For component docs, check JSDoc comments in `src/components/`.

---

先查一下，再放心合作。
Check first, partner with confidence.
