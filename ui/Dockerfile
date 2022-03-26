ARG NODE_VERSION=lts-alpine

FROM node:$NODE_VERSION as base

FROM base AS deps

RUN apk add --no-cache libc6-compat

WORKDIR /app
COPY package*.json ./

RUN npm install

FROM base AS builder

WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules

ENV NODE_ENV production
RUN npm run build

FROM base

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next

ENV NODE_ENV production
ENV PORT 3000
ENV NEXT_TELEMETRY_DISABLED 1

USER nextjs

EXPOSE 3000

CMD npm run start