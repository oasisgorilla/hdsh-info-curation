# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a news curation and weekly report application for Hyundai Samho Heavy Industries. It provides:
- News browsing and search functionality with categorization
- Weekly report generation and viewing
- PDF export of weekly reports
- Authentication-based access

## Development Commands

### Essential Commands
```bash
npm run dev          # Start development server with Vite HMR
npm run build        # TypeScript compilation + production build
npm run lint         # Run ESLint on codebase
npm run preview      # Preview production build locally
```

## Architecture Overview

### Core Structure

**Pages** ([src/pages/](src/pages/))
- [LoginPage.tsx](src/pages/LoginPage.tsx) - Authentication entry point
- [MainPage.tsx](src/pages/MainPage.tsx) - News browsing/search with pagination
- [WeeklyReportPage.tsx](src/pages/WeeklyReportPage.tsx) - Weekly report listing
- [NewsDetailPage.tsx](src/pages/NewsDetailPage.tsx) - Individual news article view

**Routing** ([src/App.tsx](src/App.tsx))
```
/ → /login (redirect)
/login → LoginPage
/main → MainPage
/weekly-report → WeeklyReportPage
/news/:newsId → NewsDetailPage
```

### Data Flow Pattern

**API Communication**
- [src/lib/api.ts](src/lib/api.ts:1-69) - Central `ApiClient` class with axios
  - Automatic Bearer token injection from `localStorage.getItem('access_token')`
  - Global 401 interceptor redirects to `/login`
  - Base URL from `VITE_API_BASE_URL` env variable

**Service Layer** ([src/services/](src/services/))
- [authService.ts](src/services/authService.ts) - Login, logout, token management
- [newsService.ts](src/services/newsService.ts) - `fetchNewsList`, `searchNews`, `fetchNewsDetail`
- [reportService.ts](src/services/reportService.ts) - `fetchReport` for weekly reports

**Type Definitions** ([src/types/](src/types/))
- [news.ts](src/types/news.ts) - `NewsItem`, `NewsListResponse`, `NewsSearchParams`, etc.
- [report.ts](src/types/report.ts) - `ClusteredNewsRead`, `ReportResponse`, `CATEGORY_MAP`
- [auth.ts](src/types/auth.ts) - Authentication types

### News Categories

Categories are defined with numeric IDs (see [src/types/report.ts](src/types/report.ts#L30-37)):
```typescript
1: '국내동향'
2: '중국동향'
3: '해외동향'
4: '원자재RISK'
5: '기술R&D'
6: '정책규제'
```

**MainPage Implementation Notes**:
- Supports two modes: regular listing and search mode
- Search mode fetches all results (limit: 500) and does client-side pagination
- Regular mode uses server-side pagination with offset/limit
- Category filtering works in both modes

### Weekly Report System

**Report Data Structure**
- Reports contain clustered news grouped by category
- Each cluster has: title, summary, score, size, and list of news items
- [src/utils/reportHelpers.ts](src/utils/reportHelpers.ts) provides utility functions:
  - `extractTopKeywords` - Extract top N keywords by size
  - `groupIssuesByCategory` - Group clusters by category
  - `getMaxIssueSize` - Get max size for normalization

**PDF Generation** ([src/utils/generatePDF.ts](src/utils/generatePDF.ts))
- Uses `html2pdf.js` library to convert HTML elements to PDF
- Configured for A4 portrait format
- Preserves exact styling and layout from HTML

**Report Components** ([src/features/report/](src/features/report/))
- [WeeklyReportDialog.tsx](src/features/report/WeeklyReportDialog.tsx) - Modal dialog for report viewing
- [CoverPage.tsx](src/features/report/CoverPage.tsx) - PDF cover page component
- [TableOfContentsPage.tsx](src/features/report/TableOfContentsPage.tsx) - PDF table of contents
- [CategorySummaryPage.tsx](src/features/report/CategorySummaryPage.tsx) - Category-specific summary pages

### Component Organization

**Atomic Components** ([src/components/atomic/](src/components/atomic/))
- Small, reusable UI elements: Tag, StatusBadge, KeywordTag, CategoryFilter

**Common Components** ([src/components/common/](src/components/common/))
- Shared components: Header, SearchBar, Pagination

**Feature Components** ([src/features/](src/features/))
- Organized by domain (news/ and report/)
- Feature-specific components that combine atomic/common components

### Styling

**MUI Theme** ([src/styles/theme.ts](src/styles/theme.ts))
- Custom theme configuration with Material-UI
- Primary font: Pretendard (Korean-optimized)
- Color definitions in [src/styles/colors.ts](src/styles/colors.ts)
- `categoryColorMap` maps category IDs to theme colors

**Global Styles**
- [src/index.css](src/index.css) - Global styles and CSS variables
- Uses both MUI theme and custom CSS

## Important Implementation Details

### Authentication Flow
1. User logs in via [LoginPage](src/pages/LoginPage.tsx)
2. [authService.login()](src/services/authService.ts#L5-12) calls `/api/auth/login`
3. Access token stored in `localStorage` under key `access_token`
4. [ApiClient](src/lib/api.ts#L17-28) automatically adds token to all requests
5. 401 responses trigger automatic logout and redirect to `/login`

### News Search vs List Modes
When implementing features in [MainPage](src/pages/MainPage.tsx):
- `isSearchMode` flag controls which data source is used
- Search mode: All results fetched once, paginated client-side
- List mode: Server-side pagination, fetch per page change
- Both modes respect category filtering

### PDF Generation Best Practices
When working with PDF generation:
- Ensure HTML structure is print-friendly (avoid complex layouts)
- Custom fonts (Pretendard, Noto Sans KR) are embedded in [src/assets/](src/assets/)
- Use A4 dimensions (210mm × 297mm) for layout planning
- Test with `scale: 2` in html2canvas options for quality

### TypeScript Configuration
- Project uses TypeScript 5.9.3 with strict mode
- Multiple tsconfig files: `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`
- Path aliases are not configured; use relative imports

## Backend API Integration

API Base URL: `http://hdsamho.ihopper.co.kr:8000/` (defined in [.env](.env))

**Key Endpoints**:
- `POST /api/auth/login` - Authentication
- `GET /api/news/` - News list with filtering/pagination
- `GET /api/search/news` - News search
- `GET /api/news/{newsId}` - News detail
- `GET /api/report` - Weekly report data

All authenticated endpoints require `Authorization: Bearer {token}` header (automatically added by ApiClient).
