# ResolveX — Scoped-Down Version for a Small College Project

## 1. Why the Original Prompt Is Too Big

The original prompt describes a **production SaaS product**, not a college project. Red flags:

| Issue | Why it's a problem for a small project |
|---|---|
| 3 full roles (Student/Admin/Staff) each with their own dashboard, sidebar, and permission rules | Triples the frontend work — 3x the pages, 3x the auth logic |
| 7 Mongoose models with cross-references (User, Complaint, Department, Category, Comment, Notification, Feedback) | Realistic for a startup MVP, not a 2–6 week academic timeline |
| Real-time notifications (Socket.io), email (Nodemailer), file storage (Cloudinary), PDF export (jsPDF), QR codes | Each is a separate integration with its own setup, API keys, and failure points |
| 6+ chart types (status, category, department, time-series, resolution rate, avg resolution time) | Needs a solid aggregation pipeline in MongoDB just to feed the charts |
| Full CRUD admin panels for Users, Departments, Staff, Categories | 4 separate management UIs on top of the core complaint flow |
| Dark mode, Framer Motion animations, loading skeletons, empty/error states everywhere | Polish work that eats time without being gradable "features" |
| Public complaint tracking, feedback + star ratings, resolution proof uploads, comment threads | Nice-to-haves that multiply testing surface area |
| 18-step build order + "every single button must work, no fakes" | Appropriate for a paid client deliverable, unrealistic for a solo/small-team academic timeline |

**Bottom line:** the original prompt is close to a real commercial complaint-management SaaS. A student (or small team) building this in a few weeks will either burn out, ship something half-broken, or have an AI agent generate a huge pile of code nobody actually understands — which defeats the point of a college project (understanding + demo-ability).

## 2. What a Small College Project Should Keep

Keep the **core loop** intact (this is the actual "complaint management" concept being demonstrated) and cut everything that's operational polish rather than core logic.

### Keep
- 2 roles only: **Student** and **Admin** (drop Staff as a separate role — Admin can do everything Staff would have done, or skip role separation of resolution entirely)
- 1 simplified status flow: `Pending → In Progress → Resolved` (drop Reviewed/Assigned/Accepted/Closed/Rejected as separate states)
- Core models only: **User, Complaint** (fold Department/Category into simple string/enum fields on Complaint instead of separate collections)
- JWT auth + bcrypt password hashing
- Submit complaint (title, category, description, priority, optional single file upload)
- Student: view my complaints, view complaint detail, filter by status
- Admin: view all complaints, change status, view basic stats (counts by status)
- One dashboard per role with 3–4 stat cards and **one** chart (e.g. complaints by status — a single pie/bar chart is enough)
- Responsive UI with Tailwind, but skip dark mode and Framer Motion unless there's time left over
- Toast notifications for actions (success/error) — **skip** the full in-app notification system, unread counts, and Socket.io real-time layer

### Cut entirely (or mark as "stretch goal" only if time remains)
- Staff role and staff dashboard/sidebar
- Department/Category/Staff management admin panels
- Comments system
- Feedback + star ratings
- Resolution proof uploads
- Public complaint tracking-by-ID page
- Real-time notifications (Socket.io)
- Email notifications (Nodemailer)
- Cloudinary (use local `multer` disk storage instead)
- PDF export / QR codes
- Dark mode, animation library
- Forgot/reset password flow (use a simple "contact admin to reset" note, or skip)

This cuts scope by roughly 60–70% while keeping every piece a grader would actually want to see: auth, role-based access, CRUD, a working status workflow, and one real chart.

## 3. Ready-to-Use Instruction Prompt for an AI Coding Agent

Copy the block below into your AI agent (e.g. Claude Code) as-is.

---

```
Build a small, working MERN-stack complaint management app called "ResolveX" for a
college mini-project. Keep the scope intentionally small and make sure everything
that exists actually works — no placeholder buttons.

STACK
- Frontend: React (Vite) + Tailwind CSS + React Router + Axios
- Backend: Node.js + Express + MongoDB (Mongoose)
- Auth: JWT + bcrypt

ROLES (only 2)
- student
- admin

DATA MODELS (only 2)
1. User: name, email, password (hashed), role (student|admin), createdAt
2. Complaint: complaintId (e.g. CMP-0001), title, description, category (enum:
   Electricity, Internet, Hostel, Library, Cleanliness, Other), priority (Low,
   Medium, High), status (Pending, In Progress, Resolved), submittedBy (ref User),
   attachment (optional, single file via multer local storage), createdAt, updatedAt

STATUS FLOW
Pending -> In Progress -> Resolved   (that's it, no other states)

STUDENT FEATURES
- Register / Login / Logout
- Dashboard: stat cards (Total, Pending, In Progress, Resolved) + one bar/pie chart
  of complaints by status (use Recharts)
- Submit Complaint form (title, category, priority, description, optional file)
- My Complaints list: table with search + filter by status, view detail page
- Complaint Detail page: shows all fields + current status

ADMIN FEATURES
- Login (seed one admin account)
- Dashboard: same stat cards + chart, but counts across ALL complaints
- All Complaints table: search, filter by status/category, change status
  (dropdown: Pending/In Progress/Resolved), view detail
- No user management, no department/staff/category management screens

UI
- Clean, modern Tailwind layout: sidebar + navbar per role, rounded cards, soft
  shadows, responsive for mobile/desktop. Use lucide-react for icons.
- Toast messages (react-hot-toast) for success/error on form actions
- Basic loading and empty states (e.g. "No complaints yet") — keep them simple

EXPLICITLY DO NOT BUILD
- Staff role, staff dashboard
- Department/Category/Staff CRUD admin panels
- Comments, feedback/star ratings, resolution-proof upload
- Public track-by-ID page, forgot/reset password flow
- Socket.io real-time notifications, Nodemailer email, Cloudinary, PDF/QR export
- Dark mode, Framer Motion animation

API ROUTES (keep to this minimal set)
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me
POST   /api/complaints            (student, creates complaint incl. file upload)
GET    /api/complaints/my         (student, own complaints)
GET    /api/complaints/:id        (student or admin)
GET    /api/admin/complaints      (admin, all complaints, supports query filters)
PUT    /api/admin/complaints/:id  (admin, update status)
GET    /api/admin/stats           (admin, counts by status for chart)
GET    /api/complaints/stats      (student, own counts by status for chart)

FOLDER STRUCTURE
ResolveX/
  client/  (Vite React app: src/pages/{auth,student,admin}, components, context, services)
  server/  (Express app: config, controllers, middleware, models, routes, uploads)
  README.md with setup steps + one seeded admin login + one seeded student login

BUILD ORDER
1. Project scaffold (client + server, .env, MongoDB connection)
2. Mongoose models (User, Complaint)
3. Auth (register/login, JWT middleware, role check middleware)
4. Complaint APIs (create, list mine, get by id, admin list/update, stats)
5. Student pages (auth forms, dashboard, submit complaint, my complaints, detail)
6. Admin pages (dashboard, all complaints table with status change)
7. Seed script (1 admin + 1 student + ~8 sample complaints)
8. Polish: responsive layout, toasts, empty/loading states
9. Test the full flow end to end, fix errors
10. Write README with setup + demo credentials

Every screen and button you build must be functional — do not add UI for features
that were explicitly excluded above.
```

---

## 4. Optional Stretch Goals (only after the core works)

If time remains after the core app is fully working and demoed once, add — in this order:

1. Comments on a complaint (student + admin)
2. Simple "Staff" role that can only update status on assigned complaints
3. Feedback (star rating) after a complaint is marked Resolved
4. Dark mode toggle
