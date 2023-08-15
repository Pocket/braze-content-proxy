FROM node:16-slim@sha256:f01219de3763c4097c87de36fa7ffd748e1a0bd40d57fa1cf8a648e81ccbcbe6

WORKDIR /usr/src/app

ARG GIT_SHA

COPY . .

ENV NODE_ENV=production
ENV PORT 4500
ENV GIT_SHA=${GIT_SHA}

EXPOSE ${PORT}

RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

CMD ["npm", "start"]
