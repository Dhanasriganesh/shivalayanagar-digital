# Shivalaya Nagar · Street Watch

Mobile-first civic app for reporting street problems across **11 streets** via permanent QR codes. Reports (photo as base64, heading, optional description) are stored in **Cloud Firestore**. Admin lives at the obscure path `/admin-san`.

## Features

- Home page listing all 11 streets
- Per-street pages at `/street/1` … `/street/11` (QR targets)
- Report form: image (compressed → base64), heading, optional description
- Public problem list per street
- Admin panel (`/admin-san`): reports grouped by street, mark resolved / delete, printable QR sheet

## Setup

1. Create a Firebase project and enable **Firestore**.
2. Copy `.env.example` → `.env` and fill in your web app config:

```bash
cp .env.example .env
```

3. Deploy or paste `firestore.rules` in the Firebase console (Firestore → Rules).
4. Create a composite index if Firestore asks for one when querying by `streetId` + `createdAt`.
5. Install & run:

```bash
npm install
npm run dev
```

6. Open `/admin-san` → **QR codes** → **Print QR sheet**, then stick each QR on its street.

## Permanent QR URLs

After you deploy (e.g. `https://your-domain.com`):

| Street   | URL                          |
|----------|------------------------------|
| Street 1 | `https://your-domain.com/street-1` |
| …        | …                            |
| Street 11| `https://your-domain.com/street-11` |

Both `/street-4` and `/street/4` work. Rename streets in `src/data/streets.js` if you use local names.

## Notes

- Images are resized/compressed in the browser before saving as JPEG base64 (Firestore 1MB doc limit).
- `/admin-san` is obscurity-only (no login). Add Firebase Auth before production if you need real admin security.
- Deploy with any static host (Firebase Hosting, Netlify, Vercel). Ensure SPA fallback to `index.html` for client routes.
