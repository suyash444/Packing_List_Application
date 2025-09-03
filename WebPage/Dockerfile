# ---------- Stage 1: build the Angular app ----------
# Node 20/22 alpine both fine; use 20 for widest compatibility
FROM node:20-alpine AS build
WORKDIR /app

# Install deps
COPY package*.json ./
RUN npm ci

# Copy sources and build (production is default in your angular.json)
COPY . .
RUN npm run build

# ---------- Stage 2: serve with NGINX ----------
FROM nginx:alpine

# Copy our NGINX config (see below)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Angular 16+ output is dist/<project>/browser
COPY --from=build /app/dist/*/browser /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
