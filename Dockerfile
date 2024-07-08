FROM node:alpine
WORKDIR /usr/src/app
COPY package*.json  .
RUN npm ci
COPY .  .
CMD ["pm2", "start", "src/index.js"]
