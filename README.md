# Kunal Gaur — portfolio

A single-page portfolio built on Next.js (App Router, TypeScript) with a
real-time WebGL scene: a GPU-simulated particle system that reshapes itself
for each section as the page scrolls.

## Commands

```bash
npm run dev     # development server at http://localhost:3000
npm run lint    # ESLint
npm run build   # static production build, written to ./out
npx serve out   # preview the production build
```

The build is a static export, so `out/` can be hosted on any static host.

## Editing content

All copy, projects, skills, jobs and links live in `src/content.ts`.

The social preview images (`src/app/opengraph-image.png` and
`twitter-image.png`) have the name and role baked in; replace them if those
change.

## Where things are

- `src/content.ts`: every piece of text on the site
- `src/app`: layout, metadata, global styles
- `src/components`: page sections, preloader, cursor, scroll runtime
- `src/three`: the WebGL scene (particle simulation, shaders, camera, panels)
- `src/lib/runtime.ts`: per-frame state shared between the DOM and the scene
