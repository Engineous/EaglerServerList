FROM node:16
WORKDIR /home/eaglerserverlist/backend/
COPY package*.json ./
RUN npm ci --only=production
RUN npm install typescript
COPY . .
RUN npx prisma generate
WORKDIR /home/eaglerserverlist/backend/dist/
EXPOSE 3002
CMD ["node", "index.js"]
