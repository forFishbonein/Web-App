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
# 把两个配置和 entrypoint 脚本都复制进来
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

# # ---------- 1. Build React -------------
#   FROM node:20-alpine AS builder

#   WORKDIR /app
#   COPY package*.json ./
#   RUN npm ci --legacy-peer-deps
#   COPY . .
#   RUN npm run build    # outputs到 /app/dist

#   # ---------- 2. Runtime (Nginx + SSL) --------
#   FROM nginx:1.25-alpine

#   # 1) 复制你写好的，能同时监听 80 → 重定向到 443，和 443 → SSL 服务的 nginx 配置
#   COPY nginx.conf /etc/nginx/conf.d/default.conf

#   # 2) 复制静态文件
#   COPY --from=builder /app/dist /usr/share/nginx/html

#   # 3) 如果要 bake-in 证书，就把 certs 一并复制进去
#   #   （仅做演示；推荐还是用 docker-compose volume 挂载，这里只是示例）
#   COPY certs/live/8.208.16.103.sslip.io/fullchain.pem  /etc/ssl/certs/fullchain.pem
#   COPY certs/live/8.208.16.103.sslip.io/privkey.pem    /etc/ssl/private/privkey.pem

#   # 4) 同时暴露 80 和 443
#   EXPOSE 80 443

#   CMD ["nginx", "-g", "daemon off;"]