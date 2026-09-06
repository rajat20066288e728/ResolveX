# ResolveX

ResolveX is a MERN complaint management platform. The interface follows `design.md`: a compact, mobile-first blue utility dashboard with rounded cards, status pills, and bottom navigation.

## Run
1. `npm install`
2. `npm install --prefix server`
3. `npm install --prefix client`
4. Copy `.env.example` to `.env`, set `MONGODB_URI` and `JWT_SECRET`, then `npm run dev`.

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

Use MongoDB Atlas for production; a local `127.0.0.1` MongoDB URL only works during local development. Uploaded complaint files are stored as binary data in MongoDB, so keep uploads below the configured 5 MB file limit and keep each complaint document below MongoDB's 16 MB document limit.

Complaint attachments are stored in MongoDB as binary file records containing the original filename, MIME type, size, and buffer data. Keep upload limits small because MongoDB documents have a 16 MB document limit; for larger production files, migrate the file records to GridFS or object storage.

## Role portals

- Student: `/dashboard`, `/complaints`, `/complaints/new`
- Admin: `/dashboard`, `/complaints`, `/announcements`, `/reports`
- Staff: `/dashboard`, `/complaints`

Demo accounts (all use `ResolveX@123`) are seeded by `npm run seed --prefix server`.
