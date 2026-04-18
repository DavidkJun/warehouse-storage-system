FROM node:22-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy" npx prisma generate
RUN npm run build

FROM node:22-alpine
WORKDIR /app

RUN addgroup -g 1001 appgroup && \
    adduser -D -u 1001 -G appgroup appuser

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder --chown=appuser:appgroup /app/dist ./dist
COPY --from=builder --chown=appuser:appgroup /app/prisma ./prisma
COPY --from=builder --chown=appuser:appgroup /app/node_modules/.prisma ./node_modules/.prisma

USER appuser

EXPOSE 3000

CMD ["node", "dist/src/main"]
