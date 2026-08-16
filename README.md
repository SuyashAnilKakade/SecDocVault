# SecureDoc Vault — Frontend

A complete React (Vite) frontend built to match your existing MERN backend exactly —
every request/response shape was read directly from your controllers, services, and
models, not guessed.

## 1. Setup

```bash
cd frontend
npm install
cp .env.example .env
```

Open `.env` and confirm `VITE_API_URL` points at your backend (default assumes it
runs on `http://localhost:5000`, matching your `server.js` default `PORT`).

## 2. Run

```bash
# Terminal 1 — backend
cd server
npm install
npm run dev   # or: node server.js

# Terminal 2 — frontend
cd frontend
npm run dev
```

Frontend runs at `http://localhost:5173`, backend at `http://localhost:5000`.
Your backend's `cors()` middleware already allows all origins, so no changes needed there.

## 3. What's implemented

**Auth** — Register, Login, Logout, Forgot/Reset Password, JWT access + refresh token
with automatic silent refresh on 401 (see `src/services/api.js`).

**Documents** (`/documents`) — Upload (drag & drop, 10MB limit, PDF/PNG/JPG/JPEG only —
matches your multer config exactly), list, download, delete.

**Sharing** — Generate a password-optional share link per document, public download
page at `/share/:token` that matches your `/api/share/download/:token` contract
(handles the 401 "password required" flow).

**Activity Log** (`/audit-logs`) — personal audit trail via `/api/audit/my-logs`.

**Admin panel** (`/admin/*`, role-gated) — dashboard stats, user management
(search/block/unblock/delete), all-documents view, system-wide audit logs — all with
the exact pagination/search/filter query params your `adminService.js` expects.

## 4. Design

Dark "vault" theme (ink-navy + teal/amber accents), Space Grotesk + Inter, with
JetBrains Mono specifically for file metadata (sizes, timestamps, tokens) to reinforce
the security/terminal feel. Fully responsive, keyboard-focus states, and
`prefers-reduced-motion` respected.

## 5. One addition beyond your original file list

Your structure didn't include Forgot/Reset Password pages or a public share-download
page, but your backend has routes for all three (`/auth/forgot-password`,
`/auth/reset-password`, `/share/download/:token`), so I added:
- `pages/auth/ForgotPassword.jsx`, `pages/auth/ResetPassword.jsx`
- `pages/SharedDocument.jsx` (public route, no login required)
- `components/documents/UploadModal.jsx` and `ShareModal.jsx` (shared between Dashboard and My Documents so the upload/share logic isn't duplicated)
- `components/common/ConfirmDialog.jsx` and `Pagination.jsx` (shared across delete-confirmation and admin list pages)

Everything else follows your listed folder structure exactly.

## 6. Verified

`npm run build` and `npx oxlint src` both run clean with zero errors — this is a real,
compiling project, not just generated text.
