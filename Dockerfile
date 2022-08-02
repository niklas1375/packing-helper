# stage 1
FROM docker.io/node:alpine as packing-helper-build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# stage 2
FROM docker.io/node:alpine
WORKDIR /app
COPY package* ./
RUN npm install --production
COPY --from=packing-helper-build ./app/dist ./dist
EXPOSE 3000
CMD ["npm", "start"]