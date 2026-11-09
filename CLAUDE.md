# Project Rules

## Framework

- This is a Next.js project using the **App Router**.
- **This is not the Next.js you know.** The installed version has breaking changes: APIs, conventions and file structure may differ from your training data. Before writing Next.js code, read the relevant guide in `node_modules/next/dist/docs/` and heed any deprecation notices.
- Use **TypeScript only**: `.ts` and `.tsx` files, no `.js` or `.jsx`.
- Use **npm** as the package manager.
- Keep the project minimal. Add a config file only when a tool cannot work without it, and prefer `.ts` config files where the tool supports them.

## Project Structure

All source code lives under `src/`:

| Folder          | What goes in it                                              |
| --------------- | ------------------------------------------------------------ |
| `src/app/`      | Routes, layouts, `robots.ts`, `sitemap.ts`, `globals.css`.   |
| `src/components/` | All components, grouped by category (see below).           |
| `src/hooks/`    | Custom React hooks.                                          |
| `src/lib/`      | Utilities and helpers.                                       |
| `src/types/`    | Shared TypeScript types.                                     |
| `src/content/`  | Site content: projects, experience, skills, links and so on. |

## Components

Components are grouped by category inside `src/components/`:

| Folder                     | What goes in it                                                              |
| -------------------------- | ---------------------------------------------------------------------------- |
| `src/components/ui/`       | Base-layer building blocks: inputs, buttons, text and headings, and similar. |
| `src/components/sections/` | Page sections built from smaller components.                                 |
| `src/components/forms/`    | Forms.                                                                       |
| `src/components/modals/`   | Modals and dialogs.                                                          |
| `src/components/shared/`   | Components reused across sections and pages.                                 |

- Put each new component in the category that fits it. If none fits, add a new category folder rather than leaving the component at the root of `src/components/`.
- Build higher-level components (sections, forms, modals) from `ui/` components instead of re-styling raw HTML elements.
- One component per file. Name the file in PascalCase after the component, such as `PrimaryButton.tsx`.
- Use named exports, never default exports. The only exception is files where Next.js requires a default export, such as `page.tsx` and `layout.tsx`.
- Import with the `@/` alias, such as `@/components/ui/PrimaryButton`, never with relative paths like `../../`.

### Server and Client Components

- Components are server components by default. Sections stay server components.
- Add `"use client"` only to small, focused components that need it, such as animated wrappers or interactive elements. Never put it on a whole section to make one part interactive.

## Pages

- A `page.tsx` only imports sections from `src/components/sections/` and renders them in order.
- A page may also export SEO `metadata`.
- Nothing else goes in a page: no state, hooks, data fetching, handlers, conditionals or inline markup and styling. Put all of that inside the sections.

## Styling and Animation

- No CSS files alongside components: no `.css` or `.module.css` files in `src/components/`. The only stylesheet is `src/app/globals.css`.
- Style with Tailwind CSS through a strict, themed design system:
	- The design system is defined with Tailwind v4's `@theme` in `src/app/globals.css`.
	- The design system defines every token: colors, typography, spacing, radii, shadows, breakpoints and motion values. It replaces Tailwind's default theme instead of extending it, so only design-system classes exist.
	- The site is mostly dark-themed; theme specifics will be defined later. Themes switch by changing token values, not by changing component classes.
	- Components may only use design-system classes. No default Tailwind palette or scale values, no arbitrary values like `w-[37px]` or `text-[#ff0000]`, and no inline `style` values for anything the design system covers.
	- If a needed value is missing, add a token to the design system first, then use it.
- Use the **Impeccable** skill (`.claude/skills/impeccable/`) to decide typography, color and spacing, and to audit and polish UI:
	- Impeccable chooses the values. They are written as `@theme` tokens in `src/app/globals.css`, and components use only those tokens.
	- Animation and transition work follows the Motion and Anime.js rules below, not Impeccable's own animation guidance.
	- When Impeccable conflicts with any rule in this file, this file wins.
- Movement is split between two libraries. Do not use any other animation library, CSS keyframes or CSS transitions.
	- **Motion** (the `motion` package, imported from `motion/react`) handles **transitions**: elements entering and leaving, page and route transitions, layout changes, and hover, tap and state changes. Do not use the legacy `framer-motion` package.
	- **Anime.js** (the `animejs` package) handles **animations**: timelines, multi-step sequences, staggered effects, SVG and path animation, text effects and looping or ambient motion.
- Anime.js code runs only in client components. Create animations inside an effect, scope them to the component, and clean them up when the component unmounts.
- Every animation and transition must respect the user's reduced-motion setting. When reduced motion is on, remove or tone down movement.

## Images and Fonts

- Always use `next/image` for images and `next/font` for fonts.

## Accessibility

- Use semantic HTML elements (`header`, `nav`, `main`, `section`, `button` and so on) instead of generic `div`s with handlers.
- Every interactive element must be keyboard accessible and have a visible focus state.
- Every meaningful image needs descriptive alt text. Decorative images use `alt=""`.

## SEO

- The project must always have `src/app/robots.ts` and `src/app/sitemap.ts`, using the App Router metadata file conventions.
- Keep them up to date. Update `sitemap.ts` whenever a route is added, removed or renamed. Update `robots.ts` whenever crawl rules change, such as a new private route that should not be indexed.

## Code Style

- Indent code with tabs, with a tab width of 4.
- Code should grow vertically, not horizontally:
	- Keep lines at 80 characters or fewer, counting each tab as 4. JSON files are exempt from this limit.
	- When a line gets long, break it across lines. Put one item per line for long props lists, function arguments, arrays, objects, imports and chained calls.
	- Avoid deep nesting. Use early returns and pull nested logic into named functions or components.
- No file may be longer than 300 lines. Before a file reaches that, split it into smaller components, hooks or utility modules. Generated files such as `package-lock.json` are exempt.
- Third-party tooling in `.claude/`, such as the Impeccable skill, is exempt from the code style, file length and TypeScript-only rules. Do not edit it by hand. Update it by copying a new release over it.

## Commits and Pull Requests

- Commit only when the user asks for a commit.
- Never add Claude or AI attribution to commit messages or pull request descriptions. That means no `Co-Authored-By: Claude ...` trailer, no "Generated with Claude Code" line, and no other mention of Claude.
