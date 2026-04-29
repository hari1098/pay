FROM node:21-alpine

WORKDIR /usr/src/app

EXPOSE 3000

COPY package*.json ./

RUN npm install --force

COPY . .

RUN npm run build

RUN ls

CMD ["npm", "run", "start"]