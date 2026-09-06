# ResolveX

ResolveX is a MERN complaint management platform. The interface follows `design.md`: a compact, mobile-first blue utility dashboard with rounded cards, status pills, and bottom navigation.

## Run
1. `npm install`
2. `npm install --prefix server`
3. `npm install --prefix client`
4. Copy `.env.example` to `.env`, set `MONGODB_URI`, `JWT_SECRET`, and `BLOB_READ_WRITE_TOKEN`, then `npm run dev`.

Demo accounts are documented in `server/seed.js` (password: `ResolveX@123`):

- Student: `student@resolvex.com`
- Admin: `admin@resolvex.com`
- Staff: `staff@resolvex.com`

Admins can publish announcements from the admin dashboard and download an anonymized PDF report containing complaint IDs, status, priority, category, department, dates, descriptions, and complaint messages. Student names, email addresses, phone numbers, student IDs, and staff identity are excluded from the export.

## Vercel deployment

Import the repository into Vercel. The included `vercel.json` deploys the React client and Express API together. Add these Vercel project environment variables:

```env
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>/resolvex
JWT_SECRET=<long-random-secret>
CLIENT_URL=https://<your-vercel-domain>
VITE_API_URL=/api
```

Use MongoDB Atlas for production; a local `127.0.0.1` MongoDB URL only works during local development. Vercel storage is ephemeral, so production file uploads should use Cloudinary or S3 rather than the local `uploads` folder.

The current production upload adapter uses Vercel Blob. Set `BLOB_READ_WRITE_TOKEN` in Vercel and local development when testing uploads. If the token is absent locally, uploads use an in-memory data URL fallback for development only.

## Role portals

- Student: `/dashboard`, `/complaints`, `/complaints/new`
- Admin: `/dashboard`, `/complaints`, `/announcements`, `/reports`
- Staff: `/dashboard`, `/complaints`

Demo accounts (all use `ResolveX@123`) are seeded by `npm run seed --prefix server`.
