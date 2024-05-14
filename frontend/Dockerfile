FROM node:latest

WORKDIR /app

COPY  package.json .

RUN npm install --legacy-peer-deps

COPY ./public /app/public
COPY ./src /app/src

EXPOSE 3000

CMD ["npm", "start"]


