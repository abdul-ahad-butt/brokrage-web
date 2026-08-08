# FreightBridge

> A two-sided freight marketplace operating as an Independent Agent of a licensed FMCSA property broker. Shippers post loads, carriers bid, and every transaction settles through the licensed broker's TMS.

---

## Legal Structure

FreightBridge is an independent agent of a licensed property broker. It is **not** a licensed broker itself. All transport agreements are executed between the customer and the licensed broker. The broker's name, MC#, and USDOT# are configured via environment variables and displayed in the persistent legal footer on every page.

---

## Prerequisites

| Tool | Version |
|------|---------|
| Node.js | ≥ 20 |
| pnpm | ≥ 9 (`npm i -g pnpm`) |
| Docker | ≥ 24 |
| Docker Compose | ≥ 2 |

---

## Local Development Setup

### 1. Clone and install dependencies

```bash
git clone <repo-url> freightbridge
cd freightbridge
pnpm install
```

### 2. Configure environment variables

```bash
# API environment (copy and edit)
cp .env.example apps/api/.env

# Web environment (copy and edit)
cp .env.example apps/web/.env.local
```

Edit each file and set the values appropriate for your environment. At minimum you must set:
- `JWT_SECRET` — a long random string (64+ chars)
- `NEXT_PUBLIC_BROKER_NAME`, `NEXT_PUBLIC_BROKER_MC`, `NEXT_PUBLIC_BROKER_DOT` — your licensed broker partner's details

### 3. Start the Postgres database

```bash
docker-compose up -d postgres
```

Wait for the health check to pass (about 10–15 seconds):
```bash
docker-compose ps   # postgres should show "healthy"
```

### 4. Run Prisma migrations and seed

```bash
# Generate the Prisma client
pnpm --filter api exec prisma generate

# Apply migrations
pnpm --filter api exec prisma migrate dev --name init

# Seed demo data (2 shippers, 4 carriers, 5 loads)
pnpm --filter api exec prisma db seed
```

### 5. Start the development servers

```bash
# Option A: Both servers in parallel
pnpm dev

# Option B: Individual
pnpm --filter api dev        # API at http://localhost:3001
pnpm --filter web dev        # Web at http://localhost:3000
```

### 6. Inspect the database (optional)

```bash
pnpm --filter api exec prisma studio
# Opens at http://localhost:5555
```

---

## Project Structure

```
freightbridge/
├── apps/
│   ├── web/                       # Next.js 14 frontend (App Router, TypeScript)
│   │   ├── app/
│   │   │   ├── (public)/          # Landing, login, register
│   │   │   ├── shipper/           # Shipper portal
│   │   │   ├── carrier/           # Carrier portal
│   │   │   └── agent/             # Agent/Admin portal
│   │   ├── components/
│   │   │   ├── ui/                # Shared design-system primitives
│   │   │   ├── shipper/
│   │   │   ├── carrier/
│   │   │   └── agent/
│   │   └── lib/                   # API client, auth helpers, formatters
│   └── api/                       # Express 5 backend (TypeScript)
│       ├── src/
│       │   ├── routes/
│       │   ├── controllers/
│       │   ├── services/
│       │   │   ├── tms/           # Swappable TMS client (mock → real)
│       │   │   ├── compliance/    # Swappable carrier vetting (mock → real)
│       │   │   └── payments/      # Swappable split-payment (mock → real)
│       │   ├── middleware/
│       │   └── ledger/
│       └── prisma/
├── packages/
│   └── shared-types/              # Load, Bid, User, LedgerEntry shared types
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## Architecture Notes

### Swappable Service Layer

All three integration services (`tms`, `compliance`, `payments`) define a **TypeScript interface** and export a **mock implementation** by default. Swapping to a real integration requires:

1. Create `services/<name>/real<Name>Service.ts` implementing the same interface
2. Change the `export` in `services/<name>/index.ts` to point to the real implementation
3. Set `USE_REAL_<SERVICE>=true` in `.env`

No calling code in controllers or routes needs to change.

### Role-Based Access Control

Three roles are enforced via JWT middleware:
- `SHIPPER` — post loads, view own bids, accept bids
- `CARRIER` — browse load board, place/withdraw bids, upload POD
- `AGENT_ADMIN` — full platform visibility, compliance management, ledger export

### Legal Compliance Ledger

Every accepted bid creates an immutable `LedgerEntry`. An `ledger_audit_log` table receives an append-only copy. Neither table exposes `update` or `delete` methods in the service layer — enforcement is at the application level, not just DB permissions.

---

## Docker Compose Services

| Service | Port | Purpose |
|---------|------|---------|
| `postgres` | 5432 | PostgreSQL 16 with persistent volume |
| `api` | 3001 | Express API + Prisma |
| `web` | 3000 | Next.js dev server |

To run everything in Docker:
```bash
docker-compose up
```

---

## Scripts Reference

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all dev servers in parallel |
| `pnpm build` | Build all packages |
| `pnpm lint` | ESLint across all packages |
| `pnpm format` | Prettier format all files |
| `pnpm typecheck` | TypeScript check all packages |
| `pnpm --filter api exec prisma studio` | Open Prisma Studio |
| `pnpm --filter api exec prisma migrate dev` | Apply new migrations |
| `pnpm --filter api exec prisma db seed` | Re-run seed script |
