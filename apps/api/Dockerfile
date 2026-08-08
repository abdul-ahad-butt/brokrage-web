FROM node:20-alpine AS base

# Install pnpm
RUN npm i -g pnpm

FROM base AS builder
WORKDIR /app

# Copy everything
COPY . .

# Install dependencies for the entire workspace
RUN pnpm install --frozen-lockfile || pnpm install

# Generate Prisma Client
WORKDIR /app/apps/api
RUN npx prisma generate

# Build the workspace (or just the API)
WORKDIR /app
RUN pnpm run build --filter=@freightbridge/api... || (cd apps/api && pnpm run build)

# Production image
FROM base AS runner
WORKDIR /app

# Copy built app and node_modules from builder
COPY --from=builder /app .

WORKDIR /app/apps/api

# Expose port (default 3001)
EXPOSE 3001

CMD ["npm", "run", "start"]
