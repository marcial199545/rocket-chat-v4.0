FROM node:10-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build-prod

COPY ./dist ./usr/src/app/dist

EXPOSE 5000

CMD ["npm","run","start"]