# Porichoy
A personal story-and-poetry website. Nine chapters, a song list and a gallery of handwritten poems in Axomiya, Hindi and Bangla.

**Stack:** HTML, CSS, vanilla JS (frontend) + Node.js, Express, MongoDB with Mongoose (backend). Security: Helmet, rate-limited login, httpOnly JWT cookie.

## Run
```
npm install
docker compose up -d        # MongoDB (or use your own / Atlas)
cp .env.example .env        # set SITE_PASSCODE and JWT_SECRET
npm run seed                # loads poem records
npm start                   # http://localhost:3000
```
## Privacy
Set `SITE_PASSCODE` to keep the site private (poem images are protected too). Do not make the repo public with personal photos or real names. Check each poem page before sharing; the pages in `public/poems` may contain names.
## Structure
`server.js` API + static, `scripts/seed.js` + `poems.json` data, `public/` frontend (`story.js` holds the chapters).
Built with AI assistance. License: MIT
