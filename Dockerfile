FROM node

WORKDIR /app

COPY /server/package*.json ./server/
COPY server ./server/

WORKDIR /app/server

RUN npm install

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]