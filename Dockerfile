FROM node:alpine
WORKDIR /usr/src/app
COPY package*.json  .
RUN npm install pm2 -g
COPY .  .
CMD ["npm", "start"]
