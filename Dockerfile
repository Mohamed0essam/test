FROM node:alpine
WORKDIR /usr/src/app
COPY package*.json  .
RUN npm ci
RUN npm install pm2 -g
COPY .  .
CMD ["pm2-runtime", "start", "/usr/src/app/src/index.js"]
