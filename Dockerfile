FROM node:latest as market

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 27017

CMD ["node", "server.js"]

