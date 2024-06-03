# stage 1: Node.js environment
FROM node:latest as build
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps --force
COPY . .
RUN npm run build --prod

# stage 2: Nginx environment
FROM nginx:latest
EXPOSE 4200
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /usr/src/app/dist/music-angular /usr/share/nginx/html
