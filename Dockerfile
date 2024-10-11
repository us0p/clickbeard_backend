# syntax=docker/dockerfile:1
FROM node:16-alpine
WORKDIR /app
COPY . .
ENV HASH_SCRT=secret
RUN npm install
CMD ["npm", "start"]
EXPOSE 4000
