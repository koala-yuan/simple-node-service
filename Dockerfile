FROM node:14-alpine as backend

WORKDIR /app
COPY ./web/package*.json ./
RUN npm ci
COPY ./web/ .

# EXPOSE 6666

CMD ["npm", "start"]