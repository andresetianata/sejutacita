FROM node:14-alpine

WORKDIR /home/sejutacita

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8002

CMD ["node", "sejutacita.js"]