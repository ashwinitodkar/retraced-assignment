FROM node:alpine as base
WORKDIR /usr/src/app
COPY . /usr/src/app
RUN npm i npm@latest -g && npm install
RUN npm -v && ls

FROM keymetrics/pm2:8-alpine
RUN npm i -g nodemon
RUN apk -U upgrade && apk add curl && rm -rf /var/cache/apk/*
WORKDIR /usr/src/app
COPY --from=base /usr/src/app .
RUN npm -v && ls
EXPOSE 3000
ARG APP_ENV
ENV APP_ENV ${APP_ENV}
CMD ["nodemon", "index.js"]
