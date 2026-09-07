# Server structure

The API entry point remains `../server.js` for local development and Vercel compatibility.

- `config/` — environment and database setup
- `middleware/` — reusable request middleware
- `models/` — Mongoose schemas (move domain models here as they grow)
- `controllers/` — request handlers
- `routes/` — endpoint registration
- `services/` — business and integration logic
- `utils/` — shared helpers

The current MVP keeps the existing route behavior intact while extracting shared configuration, database connection, and authentication concerns first.
