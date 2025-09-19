 
# 📄 Donation Hub — Product Requirements Document (PRD)

## 1. Project Overview

**Project Name:** Donation Hub (Single Campaign)
**Goal:** Enable users to submit donation pledges and allow admins to manage pledges and users. Real-time pledge feed for public users.
**Target Users:**

* **Public users:** Submit pledges, view live feed of pledges.
* **Admins:** Manage users and pledges, moderate submissions.

**Key Features:**

1. Real-time pledge feed (Socket.IO).
2. Public pledge submission form.
3. Admin panel: manage users and pledges.
4. Secure authentication with JWT + refresh tokens.
5. Input validation and PII masking.
6. Logging and audit trails.

---

## 2. Tech Stack

* **Monorepo:** Turborepo or single root package.json with workspaces.
* **Frontend:** Next.js 15 (App Router), TypeScript, TailwindCSS, shadcn/ui.
* **Backend:** Node.js, Express, Socket.IO, TypeScript.
* **Database:** MongoDB + Mongoose.
* **Authentication:** JWT (access + refresh), httpOnly secure cookies.
* **Validation:** express-validator (backend), Zod (frontend).
* **Security:** Helmet, CSP headers, CORS, rate limiting, bcrypt ≥12, PII masking.
* **Logging:** Winston (app + security logs).
* **Optional:** Redis for rate limits and session storage.

---

## 3. Monorepo File Structure

```
donation-hub/
├─ apps/
│  ├─ web/                  # Next.js frontend
│  │   ├─ app/
│  │   │   ├─ page.tsx           # Home page
│  │   │   ├─ donate/page.tsx      # Pledge donate
│  │   │   ├─ admin/
│  │   │   │   ├─ layout.tsx
│  │   │   │   ├─ users/page.tsx
│  │   │   │   └─ pledges/page.tsx
│  │   └─ components/
│  │   └─ lib/
│  └─ api/                  # Express backend
│      ├─ src/
│      │   ├─ server.ts
│      │   ├─ socket.ts
│      │   ├─ config.ts
│      │   ├─ database.ts
│      │   ├─ models/
│      │   │   ├─ User.ts
│      │   │   └─ Pledge.ts
│      │   ├─ controllers/
│      │   │   ├─ authController.ts
│      │   │   └─ pledgeController.ts
│      │   ├─ routes/
│      │   │   ├─ auth.ts
│      │   │   └─ pledges.ts
│      │   ├─ middlewares/
│      │   │   ├─ authMiddleware.ts
│      │   │   ├─ roleMiddleware.ts
│      │   │   └─ rateLimiter.ts
│      │   └─ utils/
│      │       ├─ logger.ts
│      │       └─ maskPII.ts
├─ packages/
│  ├─ types/                 # Shared TS types (User, Pledge)
│  └─ ui/                    # Shared UI components
├─ infra/
│  ├─ docker/
│  └─ nginx/                 # TLS/HTTPS examples
├─ .env.example
└─ README-security.md
```

---

## 4. Database Design

**User Model**

```ts
{
  _id: ObjectId,
  name: string,
  email: string (unique),
  passwordHash: string, // bcrypt >=12
  role: "admin",
  createdAt: Date
}
```

**Pledge Model**

```ts
{
  _id: ObjectId,
  donorName?: string,
  contact?: { email?: string, phone?: string },
  amount: number,
  message?: string,
  status: "pending" | "confirmed" | "cancelled" | "review",
  createdAt: Date
}
```

**Security & Audit**

```ts
SecurityLog {
  eventType: string,
  actor?: string,
  ip: string,
  timestamp: Date,
  details: any
}
```

---

## 5. API Endpoints

**Auth**

| Endpoint             | Method | Description          | Security             |
| -------------------- | ------ | -------------------- | -------------------- |
| /api/auth/login      | POST   | Admin login          | Rate-limit, validate |
| /api/auth/refresh    | POST   | Rotate refresh token | httpOnly cookie      |
| /api/auth/seed-admin | POST   | Seed initial admin   | Dev only             |

**Pledges**

| Endpoint                | Method | Description       | Security          |
| ----------------------- | ------ | ----------------- | ----------------- |
| /api/pledges            | POST   | Submit new pledge | Public, sanitized |
| /api/pledges            | GET    | List pledges      | Admin only        |
| /api/pledges/\:id       | PUT    | Update pledge     | Admin only        |
| /api/pledges/\:id/erase | DELETE | Remove PII        | Admin only        |

---

## 6. Socket.IO Events

* **Client → Server**

  * handshake includes JWT token
* **Server → Client**

  * `new-pledge` → masked donorName, amount, createdAt
  * `stats-update` → total count + total sum
  * `pledge-updated` → admin only

---

## 7. Frontend Pages & Behavior

**Home Page (`/`)**

* Live feed of pledges
* Total pledged amount

  **Form Page (`/donate`)**

* Submit pledge: donorName, amount, optional message, contact info
* Client-side validation with Zod
* Success & error messages

**Admin Pages (`/admin`)**

* `/admin/users` → list and manage admins/users
* `/admin/pledges` → list pledges, filter, approve/reject
* Protected via JWT access token

---

## 8. Security Rules

* TLS for all connections (`https` + `wss`)
* bcrypt ≥12 for passwords
* JWT access + refresh, refresh in httpOnly secure cookie
* Rate limiting (global + login strict + pledge submit)
* PII masking for public feed
* CSP + Helmet headers
* Audit logs for security events
* Validate and sanitize all inputs

---

## 9. Development & Deployment

* Local dev: `apps/api` + `apps/web`
* Run monorepo via Turborepo `npm run dev`
* Production: Docker + Nginx TLS termination
* Use environment variables for all secrets
* Redis for rate-limits and refresh token store (optional)

---

## 10. Notes

* Only one campaign supported per instance
* Socket.IO ensures real-time updates without exposing PII
* Admin can moderate pledges before public broadcast
* Supports future multi-campaign expansion
 