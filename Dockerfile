FROM nginx
COPY dist/httk-app /usr/share/nginx/html
COPY default.conf /etc/nginx/conf.d/

EXPOSE 80