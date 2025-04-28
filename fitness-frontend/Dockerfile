# ---------- 1. Build React -------------
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
# RUN npm ci            --omit=dev      # reproducible, uses package-lock
RUN npm ci --legacy-peer-deps    # allow peer deps conflicts
COPY . .
RUN npm run build                      # outputs to /app/dist  (Vite / CRA)

# ---------- 2. Runtime (Nginx) --------
FROM nginx:1.25-alpine

# custom conf – over-write default one
COPY nginx.conf /etc/nginx/conf.d/default.conf

# copy static files produced above
COPY --from=builder /app/dist /usr/share/nginx/html

# optional: “it’s alive?” check
HEALTHCHECK CMD wget -qO- http://localhost/ || exit 1

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]