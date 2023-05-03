FROM node:16-slim@sha256:958b2528e3fabcf0e23ecc2c3fb3c646de7ed6b79d1e9c9ce039587a879e206b

WORKDIR /usr/src/app

ARG GIT_SHA

COPY . .

ENV NODE_ENV=production
ENV PORT 4500
ENV GIT_SHA=${GIT_SHA}

EXPOSE ${PORT}

RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

CMD ["npm", "start"]
