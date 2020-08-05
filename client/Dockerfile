# Stage 0, "build-stage", based on Node.js, to build and compile the frontend
FROM node:10-alpine as build-stage

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

COPY ./build /usr/src/app/build
# Stage 1, based on Nginx, to have only the compiled app, ready for production with Nginx
FROM nginx:alpine

COPY  nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build-stage /usr/src/app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]