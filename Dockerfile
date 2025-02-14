# stage 1
FROM docker.io/node:lts AS packing-helper-build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# stage 2
FROM docker.io/node:lts
WORKDIR /app
COPY package* ./
RUN npm install --omit=dev
COPY --from=packing-helper-build ./app/dist ./dist
EXPOSE 3000
ENV CONTAINER_RUN 1
ENV DATABASE_URL "/dev/dev.db"
CMD ["npm", "start"]
