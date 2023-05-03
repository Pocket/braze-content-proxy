FROM node:16-slim@sha256:d2cbecc68a33595039bfb82b9d0e52c0229e9ced5ee481623f2e90d0012ba9f5

WORKDIR /usr/src/app

ARG GIT_SHA

COPY . .

ENV NODE_ENV=production
ENV PORT 4500
ENV GIT_SHA=${GIT_SHA}

EXPOSE ${PORT}

RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

CMD ["npm", "start"]
