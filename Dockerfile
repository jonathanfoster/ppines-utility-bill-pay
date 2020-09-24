FROM node:14-alpine AS builder
WORKDIR /usr/src/app
COPY . .
RUN npm install
RUN npm run build

FROM node:14-alpine
WORKDIR /usr/src/app
COPY package*.json ./
COPY --from=builder /usr/src/app/dist/ dist/
RUN npm install --production
CMD npm start
