# Portfolio — Client

A personal portfolio site built with [Next.js](https://nextjs.org) (App Router), React 19, Tailwind CSS v4, and Framer Motion. It consumes a backend API for content and supports responsive layout, markdown/HTML READMEs, and clone URLs for projects.

## Tech stack

- **Next.js 16** (App Router)
- **React 19**
- **Tailwind CSS v4**
- **Framer Motion** — animations and transitions
- **Lucide React** — icons
- **react-markdown** + **remark-gfm** + **rehype-raw** — markdown and HTML in posts/READMEs
- **React Hook Form** + **Zod** — contact form validation

## Getting started

### Prerequisites

- Node.js 18+
- A running instance of the portfolio API (or mock backend)

### Environment variables

Create a `.env.local` in the project root with:

```env
NEXT_PUBLIC_API_BASE_URL=https://your-api.example.com
NEXT_PUBLIC_SECURITY_KEY=your-secret-key
NEXT_PUBLIC_SITE_URL=https://yoursite.com
NEXT_PUBLIC_HOST=https://yoursite.com
```

- `NEXT_PUBLIC_API_BASE_URL` — base URL of the portfolio API (required for data).
- `NEXT_PUBLIC_SECURITY_KEY` — API secret sent as `x-secret-key` header.
- `NEXT_PUBLIC_SITE_URL` — canonical site URL (sitemap, robots, meta).
- `NEXT_PUBLIC_HOST` — host used for assets (e.g. resume PDF).

### Install and run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The app hot-reloads as you edit.

### Scripts

| Command       | Description              |
|---------------|--------------------------|
| `npm run dev` | Start dev server         |
| `npm run build` | Production build       |
| `npm run start` | Run production server |
| `npm run lint`  | Run ESLint             |

## Project structure

- `src/app/` — App Router pages and layouts (home, about, projects, posts, photos, contact, etc.).
- `src/components/` — Reusable UI (navbar, cards, forms, content sections).
- `src/adapters/http/` — API client and types for weather, quotes, experience, projects, posts, contact, etc.
- `src/utils/` — Helpers and constants.
- `src/types/` — Shared TypeScript types.

## Main features

- **Home** — Hero, date, weather, featured project, latest posts.
- **About** — Bio and experience timeline with detail pages per role.
- **Projects** — List with search; detail page with README (markdown/HTML), meta, and clone (HTTPS/SSH) with copy.
- **Posts** — List and per-post pages with markdown content.
- **Photos** — Bento-style gallery with scroll-based loading.
- **Contact** — Form with validation.
- **Picks, Readme, Privacy policy** — Static/content pages.

## Deploy

Build and run in production:

```bash
npm run build
npm run start
```

You can deploy to [Vercel](https://vercel.com), or any Node host that supports Next.js. Set the same environment variables in your deployment dashboard.

## Learn more

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Framer Motion](https://www.framer.com/motion/)
