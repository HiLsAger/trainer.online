# build stage
FROM node:20-alpine as build

WORKDIR /app

COPY . .

RUN npm install
RUN npm run build

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY docker/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY public/env.template.js /usr/share/nginx/html/env.template.js

CMD ["/bin/sh", "-c", "envsubst < /usr/share/nginx/html/env.template.js > /usr/share/nginx/html/env.js && nginx -g 'daemon off;'"]