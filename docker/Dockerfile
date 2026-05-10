FROM node:22-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
# Cache bust: 2026-05-10T06:00Z — fix standalone copy
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
RUN apk add --no-cache curl
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs

# Copy standalone output (trailing / ensures CONTENTS, not directory)
COPY --from=builder /app/.next/standalone/ ./
# Copy static files
COPY --from=builder /app/.next/static/ ./.next/static/
# Copy public assets  
COPY --from=builder /app/public/ ./public/

# Debug: verify structure
RUN ls -la .next/ && echo "---" && ls -la .next/server/app/ 2>/dev/null || echo "no server/app"

USER nextjs
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=5 \
  CMD curl -f http://localhost:3000/api/health || exit 1
CMD ["node", "server.js"]