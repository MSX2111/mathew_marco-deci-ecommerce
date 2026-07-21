FROM node:20-alpine AS base
WORKDIR /app

# Install dependencies for server
FROM base AS deps
COPY server/package.json server/package-lock.json ./
RUN npm install

# Build client
FROM base AS client-build
WORKDIR /app/client
COPY client/package.json client/package-lock.json ./
RUN npm install
COPY client/ .
RUN npm run build

# Final image
FROM base AS release
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=client-build /app/client/dist ./client/dist
COPY server/ .
EXPOSE 5000
ENV NODE_ENV=production
CMD ["node", "server.js"]
