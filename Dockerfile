FROM nginx:alpine

# Copy all project files to NGINX directory
COPY . /usr/share/nginx/html/

# Copy custom NGINX config (optional)
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]