# PaisaAds Frontend

A modern, full-stack advertising platform built with Next.js 15, TypeScript, and React 19. This application allows users to post, manage, and search for different types of advertisements (line ads, poster ads, and video ads) with role-based access control and comprehensive admin management features.

## Table of Contents

- [Project Overview](#project-overview)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Development Setup](#development-setup)
- [Architecture & Design Patterns](#architecture--design-patterns)
- [Key Features](#key-features)
- [Development Workflow](#development-workflow)
- [Code Quality & Standards](#code-quality--standards)
- [Deployment](#deployment)
- [API Integration](#api-integration)

## Project Overview

PaisaAds is a comprehensive advertising platform featuring:
- Multi-type ad management (line ads, poster ads, video ads)
- Role-based access control (User, Viewer, Reviewer, Editor, Super Admin)
- Admin dashboard for ad review and approval
- Payment integration and tracking
- Category management with hierarchical structure
- Advanced search and filtering
- Real-time ad status updates
- Responsive design with dark mode support

## Technology Stack

### Core Framework
- **Next.js 15.3.1** - React framework with App Router
- **React 19** - UI library with latest features
- **TypeScript 5.8** - Type-safe development
- **Tailwind CSS 4** - Utility-first styling

### State Management & Data Fetching
- **Zustand 5** - Lightweight state management
- **TanStack Query (React Query) 5** - Server state management and caching
- **Axios 1.8** - HTTP client for API requests

### UI Components & Libraries
- **Radix UI** - Accessible, unstyled component primitives
  - Dialog, Dropdown, Select, Accordion, Avatar, Checkbox, etc.
- **shadcn/ui** - Re-usable component system built on Radix UI
- **Lucide React** - Icon library
- **Recharts** - Data visualization and charts
- **next-themes** - Dark mode support

### Form Management
- **React Hook Form 7** - Performant forms with easy validation
- **Zod 3** - Schema validation
- **@hookform/resolvers** - Validation resolver integration

### Rich Text & Media
- **TipTap 2** - Rich text editor with extensions
- **React Quill** - Alternative WYSIWYG editor
- **Plyr React** - Video player
- **React Player** - Media player component
- **React Medium Image Zoom** - Image zoom functionality

### Development Tools
- **ESLint** - Code linting with Next.js and TypeScript configs
- **Knip** - Find unused files, dependencies, and exports
- **Turbopack** - Fast bundler for development (via Next.js 15)

### Authentication & Security
- **Jose** - JWT token handling
- **Next.js Middleware** - Route protection and role-based access

## Project Structure

```
paisaads/frontend/
├── .claude/                    # Claude Code configuration
├── public/                     # Static assets
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (website)/          # Public-facing pages
│   │   │   ├── about-us/
│   │   │   ├── contact/
│   │   │   ├── faq/
│   │   │   ├── privacy-policy/
│   │   │   ├── search/         # Ad search functionality
│   │   │   ├── terms-and-conditions/
│   │   │   └── components/     # Website-specific components
│   │   ├── api/                # API routes
│   │   │   └── images/         # Image handling endpoints
│   │   ├── dashboard/          # User dashboard
│   │   │   ├── edit-ad/        # Edit ad pages
│   │   │   ├── my-ads/         # User's ad management
│   │   │   ├── post-ad/        # Create new ads
│   │   │   ├── profile/        # User profile
│   │   │   └── view-ad/        # View ad details
│   │   ├── mgmt/               # Admin management portal
│   │   │   └── dashboard/
│   │   │       ├── ad-slots-overview/
│   │   │       ├── ads-on-hold/
│   │   │       ├── categories/
│   │   │       ├── configurations/
│   │   │       ├── published-ads/
│   │   │       ├── rejected-ads/
│   │   │       ├── reports/
│   │   │       ├── review-ads/
│   │   │       └── users/
│   │   ├── register/           # User registration
│   │   ├── verify-otp/         # Phone verification
│   │   ├── layout.tsx          # Root layout
│   │   ├── globals.css         # Global styles
│   │   └── root_provider.tsx   # App-level providers
│   ├── components/             # Reusable components
│   │   ├── dashboard/          # Dashboard-specific components
│   │   ├── forms/              # Form components for ads and auth
│   │   ├── mgmt/               # Admin management components
│   │   ├── payment/            # Payment-related components
│   │   ├── profile/            # Profile components
│   │   ├── ui/                 # shadcn/ui components
│   │   ├── ad-search.tsx       # Search component
│   │   ├── ad-status-badge.tsx # Status display
│   │   ├── image-upload.tsx    # Image upload handler
│   │   └── navbar.tsx          # Navigation
│   ├── lib/                    # Utilities and configurations
│   │   ├── enum/               # TypeScript enums
│   │   ├── hooks/              # Custom React hooks
│   │   ├── services/           # API service layers
│   │   ├── types/              # TypeScript type definitions
│   │   ├── api.ts              # API client configuration
│   │   ├── navigation.ts       # Navigation helpers
│   │   ├── utils.ts            # Utility functions
│   │   └── validations.ts      # Zod schemas
│   └── middleware.ts           # Next.js middleware (auth, routing)
├── .env                        # Environment variables
├── .gitignore                  # Git ignore rules
├── captain-definition          # CapRover deployment config
├── components.json             # shadcn/ui configuration
├── Dockerfile                  # Docker container definition
├── eslint.config.mjs           # ESLint configuration
├── next.config.ts              # Next.js configuration
├── package.json                # Dependencies and scripts
├── postcss.config.mjs          # PostCSS configuration
├── README.md                   # Project documentation
└── tsconfig.json               # TypeScript configuration
```

## Quick Start (Run Locally)

```bash
# 1. Clone the repository
git clone https://github.com/hari1098/pay.git
cd pay

# 2. Install dependencies (use --legacy-peer-deps if you get conflicts)
npm install --legacy-peer-deps

# 3. Create .env.local file with your configuration
cp .env.example .env.local
# Edit .env.local with your database credentials

# 4. Start the development server
npm run dev

# 5. Open http://localhost:3000 in your browser
```

## Development Setup

### Prerequisites
- Node.js 18+ (LTS recommended, v20+ preferred)
- npm v9+ (or yarn/pnpm/bun)
- PostgreSQL 14+ (for backend database)
- MongoDB 6+ (optional, for backend)
- Backend API running on port 3001

### Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Frontend Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Backend Configuration (for reference - use in backend .env)
NODE_ENV=development
PORT=3001
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=HEROsprint@123
DB_NAME=paisaads
MONGODB_URI=mongodb://localhost:27017/paisaads
JWT_SECRET=9a4f2c8d3b7a1e6f4g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d
JWT_EXPIRATION=7d
SMS_API_KEY=your_sms_api_key
SMS_SENDER_ID=your_sender_id
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
ALLOWED_ORIGINS=http://localhost:3000,https://paisaads.in
```

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd paisaads/frontend
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Create production build
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run knip` - Find unused files and dependencies

## Architecture & Design Patterns

### App Router Architecture

This project uses Next.js 15's App Router with the following patterns:

1. **Route Groups**: `(website)` for public pages, separating concerns
2. **Nested Layouts**: Shared layouts for dashboard and management sections
3. **Server Components**: Default server components for better performance
4. **Client Components**: Used only when needed for interactivity
5. **API Routes**: RESTful API endpoints in `/app/api`

### Component Architecture

```
┌─────────────────────────────────────┐
│         Page Component              │
│  (Server Component by default)      │
└──────────────┬──────────────────────┘
               │
        ┌──────┴──────┐
        │             │
┌───────▼────┐   ┌────▼──────┐
│   Layout   │   │  Client   │
│ Components │   │ Components│
└────────────┘   └───────────┘
        │             │
        └──────┬──────┘
               │
        ┌──────▼──────┐
        │ UI Primitives│
        │  (shadcn/ui) │
        └──────────────┘
```

### State Management Strategy

1. **Server State**: TanStack Query (React Query) for API data
   - Automatic caching and revalidation
   - Optimistic updates
   - Request deduplication

2. **Client State**: Zustand for global UI state
   - User preferences
   - UI state (modals, sidebars)
   - Form state between pages

3. **Form State**: React Hook Form
   - Local form state
   - Validation with Zod schemas
   - Performance optimization

### Authentication & Authorization

**Middleware-based protection** (`src/middleware.ts`):
- JWT token verification using Jose
- Role-based route protection
- Phone verification enforcement
- Automatic redirects based on user role

**Role Hierarchy**:
1. **VIEWER** - Search and view ads only
2. **USER** - Create and manage own ads
3. **REVIEWER** - Review submitted ads
4. **EDITOR** - Edit and publish ads
5. **SUPER_ADMIN** - Full system access

## Key Features

### 1. Multi-Type Ad Management
- **Line Ads**: Text-based advertisements
- **Poster Ads**: Image-based advertisements
- **Video Ads**: Video-based advertisements

Each ad type has its own:
- Submission form with validation
- Review workflow
- Display components
- Search filters

### 2. Admin Dashboard Features
- Ad approval/rejection workflow
- Category management with hierarchical tree structure
- User management
- Payment tracking and reports
- Ad slot monitoring
- System configuration (pricing, FAQs, policies)

### 3. Search & Discovery
- Advanced search with filters
- Category-based browsing
- Real-time search results
- Pagination and sorting

### 4. Payment Integration
- Payment dialog for ad submissions
- Payment status tracking
- Payment reports and analytics

## Development Workflow

### 1. Feature Development

```bash
# Create a feature branch
git checkout -b feature/new-feature-name

# Make changes following the patterns:
# - Server components by default
# - Client components when needed (use 'use client')
# - Type-safe with TypeScript
# - Validated forms with Zod

# Run lint and fix issues
npm run lint

# Test the build
npm run build
```

### 2. Component Development

When creating new components:

```typescript
// 1. Define types
interface ComponentProps {
  title: string;
  description?: string;
}

// 2. Create component (server by default)
export default function Component({ title, description }: ComponentProps) {
  return (
    <div>
      <h1>{title}</h1>
      {description && <p>{description}</p>}
    </div>
  );
}

// 3. For client components
'use client';

export function InteractiveComponent() {
  const [state, setState] = useState();
  // ... client-side logic
}
```

### 3. API Integration

Services are organized in `src/lib/services/`:

```typescript
// Example API service
import { api } from '@/lib/api';

export async function fetchAds(params: SearchParams) {
  const response = await api.get('/ads', { params });
  return response.data;
}

// Use with React Query
const { data, isLoading } = useQuery({
  queryKey: ['ads', params],
  queryFn: () => fetchAds(params)
});
```

### 4. Form Development

Forms use React Hook Form + Zod:

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  title: z.string().min(1, 'Title required'),
  description: z.string().optional()
});

export function MyForm() {
  const form = useForm({
    resolver: zodResolver(schema)
  });

  // ... form logic
}
```

## Code Quality & Standards

### TypeScript Configuration
- Strict mode enabled
- Path aliases configured (`@/*` → `src/*`)
- No implicit any
- ESNext module resolution

### ESLint Rules
- Next.js core web vitals
- TypeScript-specific rules
- Custom overrides for project needs

### Code Organization
1. **Colocation**: Keep related files together
2. **Separation of Concerns**: UI, logic, and data layers
3. **Reusability**: Extract common patterns to components/hooks
4. **Type Safety**: Comprehensive TypeScript usage

### Naming Conventions
- **Components**: PascalCase (`AdCard.tsx`)
- **Utilities**: camelCase (`formatDate.ts`)
- **Constants**: UPPER_SNAKE_CASE (`API_URL`)
- **Types**: PascalCase with descriptive names (`AdSearchParams`)

## Deployment

### Docker Deployment

```bash
# Build the image
docker build -t paisaads-frontend .

# Run the container
docker run -p 3000:3000 paisaads-frontend
```

### CapRover Deployment

The project includes `captain-definition` for one-click CapRover deployment:

```json
{
  "schemaVersion": 2,
  "dockerfilePath": "./Dockerfile"
}
```

### Production Build

```bash
# Create optimized build
npm run build

# The output is configured as 'standalone'
# Build artifacts are in .next/standalone/
npm run start
```

### Environment Configuration

Ensure production environment variables are set:
- `NEXT_PUBLIC_API_URL` - Backend API endpoint
- `JWT_SECRET` - Secret key for token verification
- `NEXT_PUBLIC_BASE_URL` - Frontend URL

## API Integration

### API Client Setup

The project uses Axios with a configured base client (`src/lib/api.ts`):

```typescript
import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true
});
```

### Service Layer Pattern

API calls are abstracted in service modules:
- `ad-position-api.ts` - Ad positioning
- `ad-slots-api.ts` - Ad slot management
- Additional services organized by domain

### Error Handling

- Global error boundaries
- Toast notifications for user feedback
- Automatic token refresh handling
- Graceful fallbacks for failed requests

## Troubleshooting

### Dependency Conflicts (ERESOLVE)

If you see peer dependency errors during install:

```bash
# Solution 1: Use legacy peer deps
npm install --legacy-peer-deps

# Solution 2: Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

### "next: command not found"

```bash
# Reinstall dependencies
npm install --legacy-peer-deps

# Or install Next.js globally (not recommended)
npm install -g next
```

### Port Already in Use

```bash
# Kill process on port 3000
npx kill-port 3000

# Or run on different port
npm run dev -- -p 3001
```

### Backend Connection Issues (0 ads showing)

1. Ensure backend is running on port 3001
2. Check PostgreSQL is running: `pg_isready -h localhost -p 5432`
3. Verify database exists: `psql -U postgres -c "\\l" | grep paisaads`
4. Check `.env.local` has correct `NEXT_PUBLIC_API_URL=http://localhost:3001`

### TypeScript/Build Errors

```bash
# Check for type errors
npm run lint

# Clear Next.js cache
rm -rf .next
npm run dev
```

## Contributing

1. Follow the established patterns and structure
2. Write type-safe TypeScript code
3. Use server components by default
4. Create reusable components
5. Add proper error handling
6. Test locally before committing
7. Run `npm run lint` before pushing
8. Keep components focused and small

## License

Copyright 2025 Mobifish

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

See the [LICENSE](LICENSE) file for the full license text.
