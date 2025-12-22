# Multi-stage Dockerfile for Acquisitions API

# Stage 1: Base
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./

# Stage 2: Dependencies
FROM base AS dependencies
RUN npm ci --only=production && \
    cp -R node_modules /prod_node_modules && \
    npm ci

# Stage 3: Build (if needed for any build steps)
FROM dependencies AS build
COPY . .
# Add any build steps here if needed in the future
# RUN npm run build

# Stage 4: Development
FROM base AS development
ENV NODE_ENV=development
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]

# Stage 5: Production
FROM base AS production
ENV NODE_ENV=production
COPY --from=dependencies /prod_node_modules ./node_modules
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
