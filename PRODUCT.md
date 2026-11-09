# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js (App Router), TypeScript, Tailwind CSS v4 with `@theme` tokens, Motion for transitions, Anime.js for animations, npm. Chosen by the owner; full rules live in `CLAUDE.md`.

## Users

Kunal Gaur's personal developer portfolio. Four audiences matter equally:

- **Recruiters and hiring managers:** scanning quickly for role fit, experience and stack.
- **Engineering leads:** judging depth, meaning the hard problems solved and the decisions behind them.
- **Freelance and agency clients:** deciding whether to start a project with Kunal.
- **The design and dev community:** peers and award-site judges who reward craft and originality.

## Product Purpose

Present Kunal's work and experience so that every audience above leaves knowing who Kunal is, what Kunal has done and how to get in touch. The site has to be memorable enough to stand out, and every visitor must actually read and take in the content. Success means the content gets absorbed, not just the effects admired.

## Positioning

Kunal Gaur (he/him), Software Developer 2 based in New Delhi. A backend-leaning engineer who builds reliable systems end to end, with full-stack range (React, Next.js). The work that sets him apart is consistent across roles:

- **Money and subscriptions:** Stripe and Razorpay integrations, webhooks, escrow, payouts, automated billing lifecycles.
- **Identity and access:** a Keycloak IAM platform that is the single source of truth for users and permissions, plus RBAC systems.
- **Distributed and real-time systems:** event-driven microservices, Kafka, RabbitMQ, gRPC, Redis-backed real-time state, anti-collusion validation.

Primary action for visitors: get in touch (LinkedIn for now). The exact call to action and any other contact channels are still to be confirmed.

## Capabilities and Constraints

- Single-owner portfolio site.
- All content lives in `src/content/`. `src/content/profile.json` is the source of truth for basics, experience, education and skills. Do not hard-code this content in components.
- Open content questions:
	- The Adaan Digital Solutions role has no highlights yet.
	- Case-study details have not been provided yet.
	- Whether to show LinkedIn stats (connections, followers) is undecided. Default to not showing them.

## Brand Commitments

Binding direction from the owner, recorded as given:

- Dark site.
- Blue with black, a pairing the owner has always been drawn to.
- A space feel that must never look gimmicky.
- Award-site (Awwwards) level, with striking animation.
- Tasteful and easy on the eye. Nothing may feel out of place.

## Evidence on Hand

- **Provided:** basics, six roles of experience with highlights, education and skills, in `src/content/profile.json`.
- **Available, not yet provided:** case-study details for some projects, a résumé/CV file.
- **Not available:** a set of shipped project links was not confirmed. Do not invent projects, links, clients, metrics or testimonials.

## Product Principles

1. **Content first, spectacle second.** Animation exists to draw the eye to the content and help it land, never to compete with it.
2. **Readable at speed and in depth.** A recruiter skimming and an engineering lead reading closely must both be served.
3. **Craft is the proof.** The quality of the site itself shows the skill it claims.
4. **Restraint over novelty.** Every effect has to look like it belongs. If it feels out of place, it goes.

## Accessibility & Inclusion

Per `CLAUDE.md`: semantic HTML, keyboard access with visible focus, alt text, and reduced-motion support for every animation and transition. Long-form text must stay comfortable to read on a dark background.
