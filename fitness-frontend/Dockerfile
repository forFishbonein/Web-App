# ---------- 1. Build React -------------
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
# RUN npm ci            --omit=dev      # reproducible, uses package-lock
# allow peer deps conflicts
RUN npm ci --legacy-peer-deps
COPY . .
# outputs to /app/dist  (Vite / CRA)
RUN npm run build

# ---------- 2. Runtime (Nginx) --------
FROM nginx:1.25-alpine

# custom conf – over-write default one (listens 80→301→HTTPS & serves SSL on 443)
# COPY nginx.conf /etc/nginx/conf.d/default.conf
# Copy both configurations and the entrypoint script in
COPY nginx.dev.conf /etc/nginx/conf.d/nginx.dev.conf
COPY nginx.prod.conf /etc/nginx/conf.d/nginx.prod.conf
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# copy static files produced above
COPY --from=builder /app/dist /usr/share/nginx/html

# optional: “it’s alive?” check
HEALTHCHECK CMD wget -qO- http://localhost/ || exit 1

# EXPOSE 80
# expose both HTTP and HTTPS
EXPOSE 80 443
ENTRYPOINT ["/entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]