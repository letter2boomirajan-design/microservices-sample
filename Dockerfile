# Dockerfile
FROM node:20-alpine

WORKDIR /usr/src/app

# copy package files first to install deps
COPY package.json package-lock.json* ./

RUN npm ci --production

# copy source
COPY . .

# build
RUN npm run build

EXPOSE 4000

CMD ["npm", "start"]
