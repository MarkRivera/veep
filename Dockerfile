FROM node:20

RUN apt-get update && apt-get install -y curl

WORKDIR /usr/src/server

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

RUN npm run build

CMD ["npm", "start"]