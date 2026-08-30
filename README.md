# Locus Movies

A tiny, self-hostable movie & TV-season rating log. Paste a [TMDB](https://www.themoviedb.org/)
link, pick a rating from 0–4, and it's saved with a permanent slug and a
public JSON feed. Ratings are dated by the movie/season's premiere date, but
the feed is ordered reverse-chronologically by when you logged them, so you
can show "the last X things I rated."

Originally built for [1oc.us](https://1oc.us), but designed to run on anyone's
own server.

## Features

- Add a rating with just a TMDB link + a 0–4 score. All metadata (title,
  poster, overview, genres, premiere date, etc.) is pulled from TMDB
  automatically.
- Optional markdown notes/review per rating.
- Edit the rating, swap the link, or delete an entry at any time.
- Public read-only JSON API (`/api/ratings`) for use on any site, in any
  language.
- Admin panel protected by GitHub OAuth (restricted to an allow-list of
  usernames) and/or a simple fallback password — whichever you set up.
- TMDB API key is entered and stored from the admin Settings page, not baked
  into the image.
- All instance data (config + ratings) is stored as plain JSON/markdown files
  on disk — easy to back up, inspect, or migrate.

## Getting started (local development)

```bash
npm install
cp .env.example .env   # fill in AUTH_SECRET at minimum
npm run dev
```

Open [http://localhost:3000/admin](http://localhost:3000/admin), sign in (see
below), then go to **Settings** to paste in your TMDB API key.

### Environment variables

| Variable | Required | Description |
| --- | --- | --- |
| `AUTH_SECRET` | Yes | Signs admin session cookies. Generate with `openssl rand -base64 32`. |
| `DATA_DIR` | No | Where `config.json` and `ratings/*.md` are stored. Defaults to `./data`. |
| `GITHUB_ID` / `GITHUB_SECRET` | No | Enables "Sign in with GitHub". Create an OAuth App at [github.com/settings/developers](https://github.com/settings/developers) with callback URL `https://your-domain/api/auth/callback/github`. |

Everything else (TMDB API key, the list of allowed GitHub usernames, the
fallback admin password) is configured from **/admin/settings** after your
first sign-in.

### First sign-in

The fastest way in is the fallback password, set with the bundled script
(writes directly into `data/config.json`, no server restart required):

```bash
npm run set-password -- "a-strong-password"
```

Then sign in at **/admin/login** with that password, and set your TMDB API
key and (optionally) GitHub allow-list from **Settings**.

If you'd rather use GitHub OAuth from the start, set `GITHUB_ID`/`GITHUB_SECRET`,
add your GitHub username to `allowedGithubUsers` by hand in `data/config.json`
(created after the app's first run), then sign in with GitHub.

## Deploying

### Docker

```bash
cp .env.example .env   # fill in AUTH_SECRET, optionally GITHUB_ID/SECRET
docker compose up -d --build
```

Data persists in `./data` on the host (mounted as a volume). Since the
production image doesn't include dev tooling, run the password bootstrap
script locally (pointed at the same folder you're mounting) before or after
starting the container:

```bash
DATA_DIR=./data npm run set-password -- "a-strong-password"
```

### Plain Node.js

```bash
npm install
npm run build
DATA_DIR=/path/to/data AUTH_SECRET=... npm start
```

## Public JSON feed

`GET /api/ratings` returns everything, most-recently-rated first:

```json
{
  "generatedAt": "2026-08-29T12:00:00.000Z",
  "count": 1,
  "items": [
    {
      "slug": "the-batman-movie-414906",
      "tmdbId": 414906,
      "mediaType": "movie",
      "seasonNumber": null,
      "title": "The Batman",
      "rating": 4,
      "tmdbUrl": "https://www.themoviedb.org/movie/414906",
      "premiereDate": "2022-03-01",
      "ratedAt": "2026-08-20T18:32:00.000Z",
      "updatedAt": "2026-08-20T18:32:00.000Z",
      "notes": "Optional markdown notes/review.",
      "tmdb": { "title": "...", "overview": "...", "posterUrl": "...", "genres": ["..."], "raw": { "...": "full TMDB response" } }
    }
  ]
}
```

Query params:

- `limit` — only return the last N ratings (e.g. `/api/ratings?limit=10`).
- `mediaType` — `movie` or `tv`.

Consume this feed from a static site, RSS generator, or anything else that
can parse JSON — that part is entirely up to you.

## Data format

Each rating is a markdown file at `data/ratings/<slug>.md` with YAML
frontmatter for the structured fields and a markdown body for your notes.
Nothing stops you from editing these files by hand or checking `data/` into
your own backup/version control.

## Tech stack

Next.js (App Router) + Auth.js (NextAuth) for GitHub OAuth/session handling,
file-based storage (no database required).
