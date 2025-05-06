#!/bin/sh
set -e

# Remove existing default.conf
rm -f /etc/nginx/conf.d/default.conf

# Copy selected config and remove templates
if [ "$NGINX_MODE" = "dev" ]; then
  echo "🛠️  Using nginx.dev.conf"
  cp /etc/nginx/conf.d/nginx.dev.conf /etc/nginx/conf.d/default.conf
  rm -f /etc/nginx/conf.d/nginx.dev.conf
  rm -f /etc/nginx/conf.d/nginx.prod.conf
elif [ "$NGINX_MODE" = "prod" ]; then
  echo "🔒  Using nginx.prod.conf"
  cp /etc/nginx/conf.d/nginx.prod.conf /etc/nginx/conf.d/default.conf
  rm -f /etc/nginx/conf.d/nginx.prod.conf
  rm -f /etc/nginx/conf.d/nginx.dev.conf
else
  echo "⚠️  Unknown NGINX_MODE='$NGINX_MODE', defaulting to prod"
  cp /etc/nginx/conf.d/nginx.prod.conf /etc/nginx/conf.d/default.conf
  rm -f /etc/nginx/conf.d/nginx.prod.conf
  rm -f /etc/nginx/conf.d/nginx.dev.conf
fi

# Execute the CMD passed (e.g., nginx -g 'daemon off;')
exec "$@"
