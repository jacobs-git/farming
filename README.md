# Garden Planner

Garden Planner is a desktop-first 2D garden layout app built with React + Vite + TypeScript, Cloudflare Pages Functions, and D1.

## Stack

- React
- Vite
- TypeScript
- Tailwind CSS
- Cloudflare Pages Functions
- Cloudflare D1

## Features (MVP)

- Build CRUD
- Bed CRUD + duplicate with offset
- Plant catalog CRUD
- Plant placement CRUD
- Planner canvas with drag + resize for beds and plants
- Grid toggle, snap toggle, zoom controls
- Right-side inspector editing
- Autosave status with debounced persistence
- Seeded default dataset

## Local setup

1. Install dependencies:

```bash
npm install
```

2. Create a D1 database (first time):

```bash
wrangler d1 create garden_planner
```

3. Set the generated `database_id` in [`wrangler.toml`](./wrangler.toml).

4. Apply migrations locally:

```bash
npm run migrate:local
```

5. Run frontend locally:

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Cloudflare deployment

1. Push this repo to GitHub.
2. Connect the repo to Cloudflare Pages.
3. Set build command: `npm run build`.
4. Set build output directory: `dist`.
5. Add D1 binding in Pages project settings:
   - Binding name: `DB`
   - Database: `garden_planner`
6. Apply remote migrations:

```bash
npm run migrate:remote
```

## API endpoints

- `GET /api/health`
- `GET /api/builds`
- `POST /api/builds`
- `GET /api/builds/:id`
- `PATCH /api/builds/:id`
- `DELETE /api/builds/:id`
- `GET /api/beds?buildId=...`
- `POST /api/beds`
- `PATCH /api/beds/:id`
- `DELETE /api/beds/:id`
- `POST /api/beds/:id/duplicate`
- `GET /api/plants/catalog`
- `POST /api/plants/catalog`
- `PATCH /api/plants/catalog/:id`
- `DELETE /api/plants/catalog/:id`
- `GET /api/plants/placements?buildId=...`
- `POST /api/plants/placements`
- `PATCH /api/plants/placements/:id`
- `DELETE /api/plants/placements/:id`
- `GET /api/export/build/:id`

## Notes

- No auth, no accounts, one shared workspace.
- Geometry is stored in inches and rendered with scale + zoom.
- `robots.txt` and page-level `noindex` meta are included.
