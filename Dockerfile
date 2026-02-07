FROM node:20

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install

COPY . .

EXPOSE 9090

CMD ["sh", "-c", "npx prisma generate && npm run dev"]
