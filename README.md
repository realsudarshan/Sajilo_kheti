# Sajilo Kheti — Frontend

A Next.js web client for **Sajilo Kheti**, a MERN-based land leasing and farming education platform that connects landowners with land leasers in Nepal through structured listings, proposals, escrow-backed payments, real-time chat, and an agricultural education blog.

## Overview

The frontend provides three role-specific dashboards — **Land Owner**, **Land Leaser**, and **Admin** — all routed through a centralized tRPC client that talks to the backend over authenticated HTTP requests using Clerk-issued JWTs.

| Role | Capabilities |
|---|---|
| Land Owner | Create/manage land listings, review lease applications, upload Malpot verification documents, receive escrow payouts |
| Land Leaser | Search/filter listings, submit lease proposals, chat with owners, initiate escrow payments, access farming education content |
| Admin | Manage users, verify KYC, approve/reject listings, monitor transactions, moderate blog content |

## Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Framework | Next.js 15+ | SSR + client-side React architecture |
| Styling | Tailwind CSS v4 | Utility-first responsive UI |
| Components | Shadcn/UI & Radix | Accessible, reusable UI primitives |
| API Layer | tRPC (client) | Type-safe communication with the backend |
| Auth | Clerk | Authentication, sessions, role-based access |
| Validation | Zod | Runtime schema validation |
| File Uploads | UploadThing | Land images & legal document uploads |
| Real-time Chat | Stream.io (GetStream) | Owner–leaser messaging per lease |
| Maps | Google Maps API | Land location display, navigation, nearest Malpot office lookup |
| Payments | eSewa | Escrow payment initiation/confirmation UI |
| Blog CMS | Sanity.io | Agricultural education content |
| OCR (client-assist) | Tesseract.js | Assists document field extraction during KYC upload |

## Key Features

- Role-based dashboards (Owner / Leaser / Admin) with route protection via Clerk
- Land listing creation with map-based location picker and multi-image upload
- Search & filter (region, rent range, land area)
- Lease proposal submission and review flow
- Interactive map view for listings + nearest Malpot Karyalaya navigation
- Real-time lease chat, activated only after proposal acceptance
- eSewa escrow payment flow with status tracking (Holding → Released/Refunded)
- Malpot document upload for legal verification
- Community blog: post creation, categorization/tagging, upvotes, comments
- Admin panel: user/KYC management, land approvals, revenue and transaction metrics

## Project Structure (typical Next.js App Router layout)

```
frontend/
├── app/
│   ├── (auth)/                # Clerk sign-in/sign-up routes
│   ├── (owner)/                # Owner dashboard, listings, applications
│   ├── (leaser)/                # Explore lands, applications, chat
│   ├── (admin)/                # Admin panel
│   ├── blog/                    # Sanity-powered blog routes
│   └── api/                     # Route handlers (uploads, webhooks)
├── components/
│   ├── ui/                      # Shadcn/Radix components
│   └── ...                      # Feature components (PostCard, ApplicationCard, etc.)
├── lib/
│   ├── trpc/                    # tRPC client setup
│   ├── clerk/                   # Auth helpers
│   └── validators/              # Zod schemas
├── public/
└── ...
```

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm / npm / yarn
- Access to the running backend (Express + tRPC) instance
- Clerk, UploadThing, Stream.io, Sanity, Google Maps, and eSewa API credentials

### Installation

```bash
git clone <repo-url>
cd frontend
npm install
```

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=              # Backend tRPC endpoint
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=
UPLOADTHING_TOKEN=
NEXT_PUBLIC_STREAM_API_KEY=
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=
NEXT_PUBLIC_ESEWA_MERCHANT_CODE=
```

### Run Locally

```bash
npm run dev
```

App will be available at `http://localhost:3000`.

### Build & Start (Production)

```bash
npm run build
npm run start
```

## Testing

- **Vitest** + **React Testing Library** for unit/component tests (e.g., `PostCard`, `ApplicationCard`, dashboard rendering)
- **Playwright** for end-to-end flows (auth, land search, proposal submission, lease chat activation)

```bash
npm run test        # unit/component tests
npm run test:e2e     # Playwright E2E suite
```

## Notes

- All dashboard data calls go through the shared tRPC client — do not call REST endpoints directly.
- Role-based UI gating should mirror the backend's role checks; treat frontend gating as UX-only, not a security boundary.
- Chat UI only mounts after a lease application is accepted (see `leaseRouter.accept-application` on the backend).

---
*Part of the Sajilo Kheti minor project (NCE, Department of Electronics & Computer Engineering, Tribhuvan University — Pawan Thapa, Rohit Khanal, Sudarshan Dhakal, Tilak Rokaya, 2026).*
