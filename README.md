# Javed Ahmed & Nauma — Wedding Invitation

Next.js 15 (App Router) · TypeScript · Framer Motion · plain CSS · self-hosted fonts (@fontsource).

## Run
```bash
npm install
npm run dev        # http://localhost:3000
npm run typecheck && npm run lint && npm run build
```

## Edit the details
Everything lives in `data/wedding.ts`: names, spelling (bride is `NAUMA`), parents, dates, times,
venues and map queries. Set `time` on the reception event when a time is confirmed; add a `venueId`
to Manda when its venue is known. Countdown logic is in `lib/events.ts` (IST, fixed +05:30 offset).

## Deploy to Vercel
Push to GitHub → vercel.com/new → import → Framework "Next.js" (auto) → Deploy. No env vars needed.
Or: `npx vercel --prod`.

## Not included (by design)
- Music: no audio asset supplied. Add a user-triggered toggle once a licensed file exists.
- RSVP: needs a backend/form service (e.g. Formspree, Google Forms, or a Vercel route + database)
  plus a real contact/deadline from the family. Nothing is faked.
