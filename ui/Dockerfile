ARG NODE_VERSION=lts-alpine

FROM node:$NODE_VERSION as base

FROM base AS deps

RUN apk add --no-cache libc6-compat

WORKDIR /app
COPY package*.json ./

RUN npm install

FROM base

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY next.config.js ./next.config.js
COPY public ./public
COPY --chown=nextjs:nodejs .next ./.next

ENV NODE_ENV production
ENV PORT 3000
ENV NEXT_TELEMETRY_DISABLED 1

USER nextjs
EXPOSE 3000

CMD npm run start