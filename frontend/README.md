# Irmak Bozkurt — Tattoo Portfolio

A Next.js site for a fictional Istanbul tattoo artist. See `.claude` plan history for the
full brief; the short version:

> **Backend required.** All content (about text, process steps, gallery, board selection,
> contact info) and admin auth are served by the Laravel API in `../backend`. Set `API_URL`
> in `.env.local` and run `php artisan serve` alongside `npm run dev` — see the root
> [README](../README.md) for the full local setup. `lib/db.ts` and `lib/appointments.ts` are
> the only places that talk to it.

- **Hero** (`components/hero/`): a full-bleed isometric tattoo-studio diorama illustration
  (`public/images/hero/hero-studio-v2.png`, AI-generated via Higgsfield/Nano Banana Pro,
  then outpainted twice for horizontal and vertical breathing room around the room) behind
  the "Irmak Bozkurt" wordmark, with a pointer-driven drift and a CSS
  "breathing" lamp glow (`HeroBackground.tsx`), no WebGL. The scattered section links
  pinned into the diorama (`HeroLinks.tsx`) are the site's only top-level navigation. If the illustration ever needs
  replacing, use a **new filename** (not the same path) — browsers and the Next.js dev
  server aggressively cache `/_next/image` responses by URL, so overwriting the same
  filename in place can keep serving the stale image. The old full-bleed photo
  (`hero-ref.jpg`) is now the second print in the artist section.
- **Structure**: one page, no navbar. `app/page.tsx` runs Hero → manifesto → `Artist` →
  `Board` → `Process` → `Contact` (`components/sections/`), each anchored at a Turkish id
  (`#sanatci`, `#pano`, `#surec`, `#iletisim`). Sections separate by ground — the
  `.board-surface` linen against plain paper — rather than by a divider rule. The pinboard
  primitives (`.board-surface`, `.paper-card`, `.tape`, `.pin`, `.thread`) live in
  `globals.css`; `FloatingCTA` covers booking for the stretch between hero and contact.
- **Gallery** (`lib/tattoos.ts`, `public/images/work/`): the 9 tattoo photos are **temporary
  stock photography from Unsplash**, chosen to match each style category, not Irmak's real
  work. Replace them with real photos before shipping. Sources (all via
  `images.unsplash.com`, Unsplash License — free to use, no attribution required, credited
  here anyway):
  - `muzik-notu.jpg` — photo-1547754145-ef9ff306e3f3
  - `portre-calismasi-no1.jpg` — photo-1645836594987-3596702e8870
  - `kirik-geometri.jpg` — photo-1588417490413-57973b627712
  - `nokta-nokta-manzara.jpg` — photo-1614174487989-10fc7b5382a9
  - `ince-bir-soz.jpg` — photo-1570168983832-8989dae1522e
  - `golge-oyunu.jpg` — photo-1561377455-190afb395ed7
  - `simetrik-yaprak.jpg` — photo-1588417490421-63d4e4175f95
  - `yildiz-haritasi.jpg` — photo-1758404255679-9afd847ede1c
  - `canli-desen.jpg` — photo-1712027858623-feaadeec9c0e
  - `hakkimda/portre.jpg` — photo-1605647533135-51b5906087d0

---

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
