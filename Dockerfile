FROM node:16 AS Production

ENV NODE_ENV=Production

WORKDIR /usr/src/api

COPY package.json .

RUN npm install && npm rebuild bcrypt --build-from-source

COPY . .

RUN npm run build

CMD ["sh", "-c", "npm run start"]